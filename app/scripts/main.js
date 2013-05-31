var App = App || {};

function GeocodeCallback(result) {
    /*dataDebug = result;
    App.rentalNames.push(result.resourceSets[0].resources[0].name);
    App.rentalCoordinates.push(result.resourceSets[0].resources[0].point.coordinates);*/

    var marker = L.marker(result.resourceSets[0].resources[0].point.coordinates).addTo(App.map);
    marker.bindPopup(result.resourceSets[0].resources[0].name);
}

jQuery(document).ready(function($) {
    'use strict';

    function geocode(address) {
        // lookup `address`
        App.credentials = "AnhYJU1pFXh6M5Qn4zg4htWejzdN5VKZ_c8CC0MQdsCNHaxz-JzNbmwfsMyx3bDq";
        // Possibly add regex to add `+` in between spaces
        App.vancouver = "+Vancouver+BC+Canada"
        App.url = "http://dev.virtualearth.net/REST/v1/Locations?query=" + address.replace(/\s/g,"+") + App.vancouver + "&output=json&jsonp=GeocodeCallback&key=" + App.credentials;
        return App.url;
    }

    // Grab CSV
    App.ds = new Miso.Dataset({
        // The actual url is a FTP link so AJAX won't cut it due to CORS issues
        // ftp://webftp.vancouver.ca/opendata/csv/RentalStandardsCurrentIssues.csv
        // Perhaps I should write a small script that downloads the file weekly
        // and stores it to the app.
        url: 'RentalStandardsCurrentIssues.csv',
        delimiter: ','
    });

    App.ds.fetch({
        success: function() {
            this.each(function(row) {
                // Handlebar template of data
                var source = $("#location-template").html();
                var template = Handlebars.compile(source);
                $("tbody#rental-data").append(template(row));

                // Retreive AJAX response
                $.ajax({
                    url: geocode(row.STREETNUMBER + " " + row.STREET),
                    dataType: 'jsonp'
                });

            });
        }
    });

    // Setup Map
    App.layer = new L.StamenTileLayer("toner");
    App.map = new L.Map("map", {
        center: new L.LatLng(49.261226, -123.113927),
        zoom: 12
    });

    App.map.addLayer(App.layer);


});