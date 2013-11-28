//define namespace (if exsits extend it)
var widget = widget || {};

widget.GoogleMap = function () {

    return {

        clientId: null,
        map: null,
        options: { mapTypeId: google.maps.MapTypeId.ROADMAP, zoom: 15 },
        container: function () { return document.getElementById(this.clientId + '_gmap_div'); },
        wrapper: function () { return $(document.getElementById(this.clientId + '_dvGoogleMapWrapper')); },
        markers: [],
        templateId:  function () { return this.clientId + '_infowindow-template-default' },
        template: null,
        templateContainerId: function () { return this.clientId + '_infowindow-templates' },
        _getData: function () {
            return this.wrapper().data();
        },
        _setTemplate:function(){
            
            var that = this;
            $("body").append(
                $("<div>")
                .attr("id", that.templateContainerId())
                .html('<script id="' + that.templateId() + '" type="text/x-jquery-tmpl">' +
                        '<div class="infobox-default-style" href="${dataUrl}">' +
                            '<div class="infobox-text">name: ${n}</div>' +
                            '<div class="infobox-text">latitude: ${lat}</div>' +
                            '<div class="infobox-text">lontitude: ${lon}</div>' +
                            '<div class="infobox-text">driver id: ${driver_id}</div>' +
                            '<div class="infobox-text">type: ${t}</div>' +
                            '<div class="infobox-text">version: ${v}</div>' +
                            '<div class="infobox-text">time: ${ts}</div>' +
                        '</a></script>'));

            //set the template property
            that.template = $(document.getElementById(that.templateId()));

        },
        _init: function (clientId) {
            if (typeof clientId === undefined) {
                console.error("error: cntrlId is undefined ( widget.GoogleMap )");
            }
            var that = this;
            that.clientId = clientId;
            var data = that._getData();

            //init options
            that.options.zoom = data.zoom;
            that.map = new google.maps.Map(that.container(), that.options);

            //init template
            that._setTemplate();

        },
        _start: function () {

            var that = this;
            var data = this._getData();
            if (data.centerLat != undefined && data.centerLat != undefined) {
                that._centerMapByLatLng(data.centerLat, data.centerLng, data.zoom)
            }
            else if (data.centerAddress != undefined && data.centerAddress != '') {
                that._centerMapByAddress(data.centerAddress, data.zoom);
            }

            //build markers
            that._buildMarkers();

        },
        _centerMapByAddress: function (address, zoom) {

            var taht = this;
            var map = taht.map;

            if (typeof zoom !== undefined) {
                //set default
                zoom = taht.options.zoom;
            }

            //by address
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location, zoom);
                }
            });

        },
        _centerMapByLatLng: function (lat, lon, zoom) {

            var taht = this;
            var map = taht.map;

            if (typeof zoom !== undefined) {
                //set default
                zoom = taht.options.zoom;
            }

            //by lontitde and latitude
            var lon = parseFloat(lon);
            var lat = parseFloat(lat);
            map.setCenter(new google.maps.LatLng(lat, lon), zoom);

        },
        _clearAllMarkers: function(){
            var that = this;
            for (var i = that.markers.length - 1; i >= 0; i--) {
                that.markers[i].gMarker.setMap(null);
            };
        },

        _buildMarkers: function (locations) {

           
            var that = this;
            var data = that._getData();
            var map = that.map;

            if(typeof locations == 'undefined' && typeof data.locations != 'undefined'){
                locations = data.locations;
            }



            //build markers and info window
            for (i = 0; i < locations.length; i++) {

                //Create New Marker
                var curLoc = locations[i];
                var newmarker = new google.maps.Marker({
                    position: new google.maps.LatLng(curLoc.lat, curLoc.lon),
                    map: map,
                    //title: curLoc.value,
                    icon: data.markerImage
                });

                //Build Marker infoBox 
                var infoBox = that._buildMarkerHtml(curLoc)
                newmarker['infobox'] = infoBox;

                //case you need to wirk with google infowindow
                //newmarker['infowindow'] = new google.maps.InfoWindow({
                //    content: 
                //});

                //Set Marker Events Listeners
                google.maps.event.addListener(newmarker, 'mouseover', function () {
                    var marker = this;
                    marker['infobox'].open(map, marker);
                    //infoBox.open(mngr.map, newmarker);
                    //this['infowindow'].open(mngr.map, this);
                });

                google.maps.event.addListener(newmarker, 'mouseout', function () {

                    var marker = this;
                    marker['infobox'].close(map, this);
                    
                    
                    //this['infowindow'].close(mngr.map, this);
                });

                var markerStoreObj = {
                    id: curLoc.id,
                    gMarker: newmarker
                }

                that.markers.push(markerStoreObj);
                //cenetr map to first store
            }
        },
        _buildMarkerHtml: function (location) {

            var that = this;
            var data = that._getData();
            var map = that.map;

            if (that.template == null)
            {
                return null;
            }
            var content = that.template.tmpl(location);

            var boxoptions = {
                content: content.get()[0].outerHTML,
                disableAutoPan: false,
                maxWidth: 0,
                pixelOffset: new google.maps.Size(-50, -70),
                zIndex: null,
                boxClass:data.infoboxClass,
                //boxStyle: {
                //    background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                //    opacity: 0.95,
                //    width: "300px",
                //    height: "auto",
                //    padding:"5px"
                //},@@ no need with the "boxClass" property
                closeBoxMargin: "",
                closeBoxURL: "",//hide the button
                infoBoxClearance: new google.maps.Size(1, 1),
            };

            return new InfoBox(boxoptions);
        }

    };
}
