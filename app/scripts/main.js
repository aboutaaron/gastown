// Creating an object as to not pollute the global namesapce
var App = App || {};

// Why is this a global?
App.markers = new L.MarkerClusterGroup();

// This is the function Bing returns when you use the REST API
// As a result, it's global, hence why it's up here
function GeocodeCallback(result) {
    // Only add markers to the app that return full results
    // Sometimes the geocode will return a status code of 200 (ok)
    // but without any data
    if (result.resourceSets[0].resources[0] !== undefined) {
        App.marker = L.marker(result.resourceSets[0].resources[0].point.coordinates)
        App.marker.bindPopup(result.resourceSets[0].resources[0].name);
        // Add the coordinates to a map cluster and then add the cluster to the app
        App.markers.addLayer(App.marker);
        App.map.addLayer(App.markers);
    }
}


jQuery(document).ready(function($) {
    'use strict';

    // Bing API key
    App.credentials = "AnhYJU1pFXh6M5Qn4zg4htWejzdN5VKZ_c8CC0MQdsCNHaxz-JzNbmwfsMyx3bDq";

    // Function to fetch geocode
    function geocode(address) {
        // Build the REST URL to fetch
        // Quick regex to add '+' as spaces
        App.url = "http://dev.virtualearth.net/REST/v1/Locations?query=" + address.replace(/\s/g,"+") + "Vancouver+BC+Canada&output=json&jsonp=GeocodeCallback&key=" + App.credentials;
        return App.url;
    }

    // Grab CSV
    App.ds = new Miso.Dataset({
        // The actual url is a FTP link so AJAX won't cut it due to CORS issues
        // ftp://webftp.vancouver.ca/opendata/csv/RentalStandardsCurrentIssues.csv

        // Perhaps I should write a small script that downloads the file daily
        // and stores it to the app.
        url: 'RentalStandardsCurrentIssues.csv',
        delimiter: ','
    });

    App.ds.fetch({
        success: function() {
            this.each(function(row) {

                // Use Bing API to grab coordinates of locations
                // The geocode function is used here
                // GeocodeCallback is the response Bing sends back
                $.ajax({
                    url: geocode(row.STREETNUMBER + " " + row.STREET),
                    dataType: 'jsonp'
                });

                // Handlebar template of data
                var source = $("#location-template").html();
                var template = Handlebars.compile(source);
                // Only load full values
                if (row.STREET != null) {
                    $("tbody#rental-data").append(template(row));
                }

            });

        }
    });

    // Setup Leaflet map
    App.layer = new L.StamenTileLayer("toner");
    App.map = new L.Map("map", {
        // Vancouver
        center: new L.LatLng(49.261226, -123.113927),
        zoom: 12,

        // Options
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
        zoomControl: false,
        dragging: false
    });

    // Load map to DOM
    App.map.addLayer(App.layer);

    // Control
    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Bing({
            key: App.credentials
        })
    }).addTo(App.map);

    // Handlebar helper for some math
    Handlebars.registerHelper('percentage', function(value, divisor) {
        return ((value / divisor) * 100).toFixed(1);
    });
});