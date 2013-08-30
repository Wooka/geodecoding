
      var map, latLng, marker, infoWindow, ad;
      var geocoder = new google.maps.Geocoder();

      function showAddress(val) {
        infoWindow.close();
        _gaq.push(['_trackEvent', 'Maps', 'Search', val, 0, true]);
        geocoder.geocode( { 'address': val }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
             marker.setPosition(results[0].geometry.location);
             geocode(results[0].geometry.location);
          } else {
             alert("РњС‹ РЅРµ РјРѕР¶РµРј РЅР°Р№С‚Рё С‚Р°РєСѓСЋ Р»РѕРєР°С†РёСЋ");
          }
       });
      }

      function geocode(position) {
        geocoder.geocode({
           latLng: position
        }, function(responses) {
             var html = '';
             if (responses && responses.length > 0) {
                html += '<strong>Р’Р°С€ Р°РґСЂРµСЃ:</strong><hr/>' + responses[0].formatted_address;
				
					 var address = "", city = "", state = "", zip = "", country = "",street_number = "" ,formattedAddress = "";
					 
                      for (var i = 0; i < responses[0].address_components.length; i++) {
                          var addr = responses[0].address_components[i];
                          if (addr.types[0] == 'country')
                              country = addr.long_name;
						 
                          else if (addr.types[0] == 'route')  // address 2
                              address = address + addr.long_name;
						  else if (addr.types[0] == 'street_number')
                              street_number = addr.long_name;
                          else if (addr.types[0] == 'postal_code')       // Zip
                              zip = addr.long_name;
                          else if (addr.types[0] == ['administrative_area_level_1'])       // State
                              state = addr.short_name;
                          else if (addr.types[0] == ['locality'])       // City
                              city = addr.long_name;
                      }
					
				$("input[name='country']").val(country);
				$("input[name='region']").val(state);
				$("input[name='city']").val(city);
				$("input[name='street']").val(address);
				$("input[name='street_number']").val(street_number);
				$("input[name='zip']").val(zip);
                _gaq.push(['_trackEvent', 'Maps', 'Drag', responses[0].formatted_address, 0, true]);
             } else {
                html += 'РР·РІРёРЅРёС‚Рµ,РЅРѕ РјС‹ РЅРµ РјРѕР¶РµРј СѓР·РЅР°С‚СЊ,С‡С‚Рѕ СЌС‚Рѕ Р·Р° Р°РґСЂРµСЃ.';
             }

             //html += '<br /><br /><strong>Geo Co-ordinates</strong><hr />' + 'Latitude : ' + marker.getPosition().lat() + '<br/>Longitude: ' + marker.getPosition().lng();
             map.panTo(marker.getPosition());
             infoWindow.setContent("<div id='iw'>" + html + "</div>");
             infoWindow.open(map, marker);
         });
      }

      function initialize() {

        var myOptions = {
          zoom: 15,
          panControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('googlemaps'),
            myOptions); 

        if (geoPosition.init()) 
            geoPosition.getCurrentPosition(locationFound, defaultLocation, {enableHighAccuracy:true});
        else
            defaultLocation();
      }

      function locationFound(position) {
        showMap(position.coords.latitude, position.coords.longitude);
      }

      function defaultLocation() {
        showMap(55.768821854766344, 37.63157546556397);
      }

      function showMap(lat, lng) {

        latLng = new google.maps.LatLng(lat, lng);

        var adUnitDiv = document.createElement('div');

        var adWidth = window.innerWidth || document.documentElement.clientWidth;

        if ( adWidth >= 728 )
          adFormat = google.maps.adsense.AdFormat.LEADERBOARD;
        else if ( adWidth >= 300 )
          adFormat = google.maps.adsense.AdFormat.SMALL_SQUARE;
        else
          adFormat = google.maps.adsense.AdFormat.X_LARGE_VERTICAL_LINK_UNIT;


        

   

        map.setCenter(latLng);

        marker = new google.maps.Marker({
           position: latLng, map: map, draggable: true, animation: google.maps.Animation.DROP
        });

        infoWindow = new google.maps.InfoWindow({
           content: '<div id="iw"><strong>РРЅСЃС‚СЂСѓРєС†РёСЏ:</strong><br /><br />РќР°Р¶РјРёС‚Рµ Рё РїРµСЂРµС‚Р°С‰РёС‚Рµ РєСЂР°СЃРЅС‹Р№ РјР°СЂРєРµСЂ РІ РЅСѓР¶РЅСѓСЋ РІР°Рј С‚РѕС‡РєСѓ,С‡С‚Рѕ Р±С‹ СѓР·РЅР°С‚СЊ Р°РґСЂРµСЃ.</div>'
        });

        infoWindow.open(map, marker);

        google.maps.event.addListener(marker, 'dragstart', function (e) {
           infoWindow.close();
        });

        google.maps.event.addListener(marker, 'dragend', function (e) {
           var point = marker.getPosition();
           map.panTo(point);
           geocode(point);
        });
      }

      google.maps.event.addDomListener(window, 'load', initialize);
