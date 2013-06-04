var s,
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
        })
    },

    init: function() {
        console.log("Pew pew pew pew!")
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
                console.log(coordinates);
                return [coordinates.jb, coordinates.kb];
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        })
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
            // First remove null values
            this.remove(function(row) { return row.STREET === null });

            // store
            s.data = this;

            // Build template
            Gastown.buildTemplate(s.data);
          }
        });
    },

    buildTemplate: function(data) {
        // Take an object, iterate over it
        // and build a template from Handlebars

        data.each(function(row) {
            // Handlebar template of data
            var source = $("#location-template").html();
            var template = Handlebars.compile(source);
            $("tbody#rental-data").append(template(row));
        });
    },

    buildCoordinates: function() {
        // First remove null values
        s.data.remove(function(row) { return row.STREET === null });
        // Generate new column with latitude and longitude
        s.data.addComputedColumn("coordinates", "string", function(row) {
            var address = row.STREETNUMBER + " " + row.STREET
            // Timeout
            setTimeout(function() {
                return Gastown.codeAddress(address);
            }, 1000 * row._id);
        });
        // Points on map
        L.marker()
    }
}