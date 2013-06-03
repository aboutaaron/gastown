var s,
Kitsilano = {
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
            })
    },

    init: function() {
        // pull in config
        s = this.config;

        // Load Map
        this.createMap();
    },

    createMap: function() {
        // Setup Leaflet map
        var layer = new L.StamenTileLayer("toner");
        var zoomLayer = new L.Control.Zoom({position: "topright"});
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

    codeAddress: function(address) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address, 'region': 'CA' }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var coordinates = results[0].geometry.location;
                new L.marker([coordinates.jb, coordinates.kb]).addTo(s.map);
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        })
    }
}