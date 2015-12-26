var map; // Lazy for now. Just keep it globally defined so that it is accessible my=by multiple functions.
var markers = {};
function initMap(){
  var portland_center = {lat: 45.5204387, lng: -122.662442};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: portland_center,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.TERRAIN
      ]
    }
  });
}

// function addMarker(location, map) {
// Adds a marker to the map.
function addMarker(store, disabled){
  // debugger;
  if(disabled != true){
    var infowindow = new google.maps.InfoWindow({
      // how do I do the #{} syntax again? <h1>#{store.name}</h1> doesn't work.
      content: '<h3>' + store.name + '</h3><p>' + store.address + '<br /><a href="' + store.website + '" target="_blank">' + store.website + '</p>'
    });
    marker = new google.maps.Marker({
      position: store.coordinates,
      map: map,
      animation: google.maps.Animation.DROP
    });
  // testing map even click listener....
    marker.addListener('click', function(){
      infowindow.open(map, marker);
    });
    id = store.id; // Store the id to this marker.
    markers[store.id] = marker; // Add this id to the globally-accessible array, so that you can manipulate it later.
  } else {
    // Not working yet -- this may be challenging. This code has gotten robust enough that I think it will swiftly be time for a refactor... - MC 12.19.2015
    marker = markers[store];
    marker.setMap(null);
  }
}

$(document).ready(function(){

  var i_have = [];

  // Right now it is doing all of the work with each time you check or uncheck; maybe it should only do the work on pressing a Submit button. - MC 12.5.2015

  var check_products = $('input[type=checkbox]').on('click', function(e){
    if(this.checked == true){
      i_have.push(this.value);
    } else {
      var index = i_have.indexOf(this.value);
      if(index > -1){
        // Remove it from the array. Testing: remove the map markers. - MC 12.17.2015
        i_have.splice(index, 1);        
        // console.log('removed from the array.');
        addMarker(stores[1].id, true); // Static test for now. Can I pass the object along here? But how would I know which store to remove? This section may have to be placed further down in the arrays. But triple-nested for loops? Might need to start to refactor some of this craziness.
      }
    }
    $('.array_contents').html('');
    for(i=0; i<stores.length;i++){
      for(x=0; x<stores[i].can_bring.length;x++){
        for(y=0; y<i_have.length;y++){
          if(stores[i].can_bring[x].indexOf(i_have[y]) > -1){
            // debugger;
            tradein = stores[i].tradein.length > 0 ? ', and you can get ' + stores[i].tradein + '. ' : '. ';
            $('.array_contents').append('<p>You can bring your ' + stores[i].can_bring[x] + ' to ' + stores[i].name + tradein + '</p>');
              addMarker(stores[i]);
            // activate map marker here.
          }
        }
      }
    }
  });

});