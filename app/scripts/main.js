/*global L:false, Handlebars:false, $:false, jQuery:false, Miso:false */

var Gastown = Gastown || {}, s;

Gastown = {
    config: {
        defaultZoomLevel: 16,
        map: new L.Map('map', {
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
            'use strict';
            return ((value / divisor) * 100).toFixed(1);
        }),
        csv: 'data/2013-06-03-rental-standards.csv',
        cluster: new L.MarkerClusterGroup({
            // Change on.click zoom value
            showCoverageOnHover: false,
            disableClusteringAtZoom: 17
        })
    },

    init: function() {
        'use strict';

        // pull in config
        s = this.config;

        // Load Map
        this.createMap();
        this.extractCSV(s.csv);
    },

    createMap: function() {
        'use strict';

        // Setup Leaflet map
        var layer = new L.StamenTileLayer('toner');
        var zoomLayer = new L.Control.Zoom({position: 'topright'});
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
        'use strict';

        // Miso Dataset
        var ds = new Miso.Dataset({
            url : url,
            delimiter : ','
        });

        ds.fetch({
            error: function(error) { console.log(error); },
            success: function() {
                s.data = this;
                Gastown.addMarkerToCluster(s.data);
            }
        });
    },

    buildTemplate: function(data) {
        'use strict';
        // Take an object and build a template from Handlebars
        // Handlebar template of data
        var source = $('#rental-details-template').html();
        var template = Handlebars.compile(source);
        $('#rental-details').html(template(data));
    },

    addMarkerToCluster: function(data) {
        'use strict';
        // Take the JS Object
        // Iterate over each
        data.each(function(row) {
            // Create a marker with Latitude and Longitude
            // Store each marker in a cluster
            var m = new L.marker([row.LAT, row.LNG]);
            s.cluster.addLayer(m);

            m.on('click', function() {
                Gastown.buildTemplate(row);
            });
        });

        // After iteration, add cluster to map
        s.map.addLayer(s.cluster);
    }
};

jQuery(document).ready(function() {
    'use strict';
    Gastown.init();
});