var Gastown = Gastown || {}, s, p;

Gastown = {
    config: {
        defaultZoomLevel: 16,
        map: new L.Map("map", {
                // Vancouver
                center: new L.LatLng(49.261226, -123.113927),
                zoom: 12,

                // Options
                scrollWheelZoom: false,
                touchZoom: false,
                doubleClickZoom: false,
                zoomControl: false
            }),
        data: 0,
        helpers: Handlebars.registerHelper('percentage', function(value, divisor) {
            return ((value / divisor) * 100).toFixed(1);
        }),
        csv: "data/2013-06-03-rental-standards.csv",
        pushToTemplate: true,
        cluster: new L.MarkerClusterGroup({
            // Change on.click zoom value
            showCoverageOnHover: false,
            disableClusteringAtZoom: 17
        })
    },

    init: function() {
        console.log("Pew pew pew pew!")
        // pull in config
        s = this.config;

        // Load Map
        this.createMap();
        this.extractCSV(s.csv);
    },

    createMap: function() {
        // Setup Leaflet map
        var layer = new L.StamenTileLayer("toner");
        var zoomLayer = new L.Control.Zoom({position: "bottomleft"});
        var geoSearchLayer = new L.Control.GeoSearch({
            provider: new L.GeoSearch.Provider.Google(),
            country: 'Canada',
            zoomLevel: s.defaultZoomLevel
        });
        var markers = new L.MarkerClusterGroup({
            showCoverageOnHover: false,
            disableClusteringAtZoom: s.defaultZoomLevel
        });

        // Load map to DOM
        s.map.addLayer(layer);
        zoomLayer.addTo(s.map);
        geoSearchLayer.addTo(s.map);
        markers.addTo(s.map);
    },

    extractCSV: function(url) {
        // Miso Dataset
        var ds = new Miso.Dataset({
          url : url,
          delimiter : ","
        });

        ds.fetch({
          error: function(error) { console.log(error) },
          success: function() {
            s.data = this;
            Gastown.addMarkerToCluster(s.data);
          }
        });
    },

    buildTemplate: function(data) {
        // Take an object and build a template from Handlebars
        // Handlebar template of data
        var source = $("#location-template").html();
        var template = Handlebars.compile(source);
        $("tbody#rental-data").append(template(data));
        //console.log("Template built. Your data contains " + data.length + " values and the following methods (extracted from the CSV headers): " + data.columnNames());
    },

    addMarkerToCluster: function(data) {
        // Take the JS Object
        // Iterate over each
        // Create a marker with Latitude and Longitude
        // Store each marker in a cluster
        data.each(function(row) {
            s.cluster.addLayer(new L.marker([row.LAT, row.LNG]))
        });

        // After iteration, add cluster to map
        s.map.addLayer(s.cluster)
    }
}

jQuery(document).ready(function($) {
    "use strict";
    Gastown.init();
});