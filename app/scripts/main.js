jQuery(document).ready(function($) {
    'use strict';

    var App = App || {};

    // Setup Map
    App.layer = new L.StamenTileLayer("toner");
    App.map = new L.Map("map", {
        center: new L.LatLng(49.261226, -123.113927),
        zoom: 12
    });

    App.map.addLayer(App.layer);


});