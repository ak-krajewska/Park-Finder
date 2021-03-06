  var map;
  var geocoder = new google.maps.Geocoder();
  var markers = [];       
  var infowindow = new google.maps.InfoWindow();


   // Request places info from Google, draw the map
  function requestPlaces(location) {
       var request = {
           location: location,
           types: ['park'],
           rankBy: google.maps.places.RankBy.DISTANCE
       };
      
       var service = new google.maps.places.PlacesService(map);
       service.search(request, callback);
  }


  // Automatically detect the location, move map to it
  function autoDetectLocation() {
      if (!navigator.geolocation) return;
      
      navigator.geolocation.getCurrentPosition(function(position) {
          var my_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          requestPlaces(my_location);
          infowindow.close(); // close any open infowindows
          map.panTo(my_location);
      });                            
  }

  
  // Convert address to geocode, request places
  function requestAddress() {
      var address = document.getElementById("address").value;
      geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
                  // set the location with the info from the geocoder
                  var my_location = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()); 
                  requestPlaces(my_location);
                  infowindow.close(); // close any open infowindows
                  map.panTo(my_location); // move the map to the new location                      
          } else {
              alert("Geocode was not successful for the following reason: " + status);
          }
      });
  }


function initialize() { 
  // initial location is Blue Bottle coffe on Linden St
  var my_location = new google.maps.LatLng(37.77640, -122.42327);
  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: my_location,
    zoom: 15
  });

  requestPlaces(my_location);
   
  infowindow = new google.maps.InfoWindow();

  var timer;
  google.maps.event.addListener(map, 'drag', function() { 
      infowindow.close();
      if( timer ) clearTimeout(timer);
      // 1 second after drag
      timer = setTimeout(function() {
          requestPlaces(map.getCenter());
      }, 1000); // set to 2 secs for testing
  });
  autoDetectLocation();
}

function showInfoWindow() { 
  infowindow.setContent(this.getTitle()); 
  infowindow.open(map, this);
}


var old_center;
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {  
          // No marker, need to create it
          if (!markers[i]) {
              var marker = new google.maps.Marker({
                  map: map,
                  position: results[i].geometry.location,
              }); 

              markers.push(marker); // Add marker to markers array          

              google.maps.event.addListener(marker, 'click', showInfoWindow);
          } 
          markers[i].setPosition(results[i].geometry.location);
          // Reuse markers
          markers[i].setVisible(true); 
          markers[i].setTitle(results[i].name);
      }
  }  
}


google.maps.event.addDomListener(window, 'load', initialize);      

