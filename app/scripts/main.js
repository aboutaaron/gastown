// Creating an object as to not pollute the global namesapce
var Data = Data || {};
// Some Default info
Data.bingKey = "AnhYJU1pFXh6M5Qn4zg4htWejzdN5VKZ_c8CC0MQdsCNHaxz-JzNbmwfsMyx3bDq";
Data.totalUnits = 0;
Data.totalOutstanding = 0;
Data.averageUnit = 0;
Data.averageOutstanding = 0;

// Why is this a global?
var markers = new L.MarkerClusterGroup({
    showCoverageOnHover: false,
    disableClusteringAtZoom: 16
});

// This is the function Bing returns when you use the REST API
// As a result, it's global, hence why it's up here
function GeocodeCallback(result) {
    // Only add markers to the app that return full results
    // Sometimes the geocode will return a status code of 200 (ok)
    // but without any data
    if (result.resourceSets[0].resources[0] !== undefined || null) {
        // Custom Markers
        var redMarker = L.AwesomeMarkers.icon({
            icon: 'coffee',
            color: 'red'
        });

        var marker = L.marker(result.resourceSets[0].resources[0].point.coordinates, { icon: redMarker });
        marker.bindPopup(result.resourceSets[0].resources[0].name);
        // Add the coordinates to a map cluster and then add the cluster to the app
        markers.addLayer(marker);
        //map.addLayer(markers);
    }
}


jQuery(document).ready(function($) {
    'use strict';

    // Function to fetch geocode
    function geocode(address) {
        // Build the REST URL to fetch
        // Quick regex to add '+' as spaces
        var url = "http://dev.virtualearth.net/REST/v1/Locations?query=" + address + "+Vancouver+BC+Canada&output=json&jsonp=GeocodeCallback&key=" + Data.bingKey;
        return url;
    }

    function fetchCoordinates(value) {
        $.ajax({ url: geocode(value), dataType: 'jsonp' });
    }

    function createHandlebarTemplate(data) {
        // Handlebar template of data
        var source = $("#location-template").html();
        var template = Handlebars.compile(source);
        $("tbody#rental-data").append(template(data));
    }

    // Grab CSV
    var ds = new Miso.Dataset({
        // The actual url is a FTP link so AJAX won't cut it due to CORS issues
        // ftp://webftp.vancouver.ca/opendata/csv/RentalStandardsCurrentIssues.csv

        // Perhaps I should write a small script that downloads the file daily
        // and stores it to the app.
        url: 'RentalStandardsCurrentIssues.csv',
        delimiter: ','
    });

    ds.fetch({
        success: function() {
            // Remove null values
            this.remove(function(row) { return row.STREET === null });

            // iterate over rows
            this.each(function(row) {
                // Populate Averages
                Data.totalUnits += row.TOTALUNITS
                Data.totalOutstanding += row.TOTALOUTSTANDING

                // Fetch coordinates for map and add values to table template
                fetchCoordinates(row.STREETNUMBER + "+" + row.STREET)
                createHandlebarTemplate(row)
            }); // $.each

            Data.averageUnit = Data.totalUnits / this.length;
            Data.averageOutstanding = Data.totalOutstanding / this.length;

            // Chart
            new Chart($("#chart").get(0).getContext("2d")).Pie([
                {
                    value: Data.averageUnit,
                    color: "#F7464A"
                },
                {
                    value: Data.averageOutstanding,
                    color: "#46BFBD"
                }
            ]);
        } // success
    });

    // Setup Leaflet map
    var layer = new L.StamenTileLayer("toner");
    var map = new L.Map("map", {
        // Vancouver
        center: new L.LatLng(49.261226, -123.113927),
        zoom: 12,

        // Options
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
        zoomControl: false
    });

    // Load map to DOM
    map.addLayer(layer);

    // Control
    new L.Control.Zoom({position: "topright"}).addTo(map);

    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Bing({
            key: Data.bingKey
        }),
        country: 'Canada',
        zoomLevel: 16
    }).addTo(map);

    // Handlebar helper for some math
    Handlebars.registerHelper('percentage', function(value, divisor) {
        return ((value / divisor) * 100).toFixed(1);
    });
});