// Google Geocode
var map;
var geocoder;

function initialize() {
    geocoder = new google.maps.Geocoder();
    // Setup Leaflet map
    var layer = new L.StamenTileLayer("toner");
    var zoomLayer = new L.Control.Zoom({position: "topright"});
    var geoSearchLayer = new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Bing({
            key: "AnhYJU1pFXh6M5Qn4zg4htWejzdN5VKZ_c8CC0MQdsCNHaxz-JzNbmwfsMyx3bDq"
        }),
        country: 'Canada',
        zoomLevel: 16
    });
    var markers = new L.MarkerClusterGroup({
        showCoverageOnHover: false,
        disableClusteringAtZoom: 16
    });

    map = new L.Map("map", {
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
    zoomLayer.addTo(map);
    geoSearchLayer.addTo(map);
    markers.addTo(map);
}

function codeAddress(address) {
    geocoder.geocode( { 'address': address, 'region': 'CA' }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latlng = []
            latlng.push(results[0].geometry.location.jb);
            latlng.push(results[0].geometry.location.kb);
            //return latlng;
            console.log(latlng);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    } )
}