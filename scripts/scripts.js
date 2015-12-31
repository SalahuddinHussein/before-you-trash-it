var map; // Lazy for now. Just keep it globally defined so that it is accessible by multiple functions.
var marker;
var markers = [];
var info_window = [];

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

//~ Adds or removes a marker to the map.
function toggleMarker(store, enabled){
  if(enabled == true){
    info_window[store.id] = new google.maps.InfoWindow({
      // how do I do the #{} syntax again? <h1>#{store.name}</h1> doesn't work.
      content: '<h3>' + store.name + '</h3><p>' + store.address + '<br /><a href="' + store.website + '" target="_blank">' + store.website + '</p>'
    });
    marker = new google.maps.Marker({
      position: store.coordinates,
      map: map,
      animation: google.maps.Animation.DROP
    });
    marker.addListener('click', function(){
      for(i=0; i<info_window.length;i++){
        if(info_window[i] !== undefined){
          info_window[i].close(); //~ When you click to open a new info window, close the others. They get too cluttered.
        }
      }
      info_window[store.id].open(map, this);
    });
    markers[store.id] = marker; //~ Add this id to the globally-accessible array, so that you can manipulate it later.
  } else {
    //~ Not sure if I would need to manually remove a marker. But if I did, it would happen here.
    // marker = markers[store];
    // if(marker !== null){
    //   marker.setMap(null);
    // }
  }
}

$(document).ready(function(){

  var i_have = [];

  //~ Right now it is doing all of the work with each time you check or uncheck; maybe it should only do the work on pressing a Submit button. - MC 12.5.2015

  var check_products = $('input[type=checkbox]').on('click', function(e){
    $(e.currentTarget).parent().toggleClass('checked');
    //~ Add or remove from the array of what you have.
    if(this.checked == true){
      i_have.push(this.value);
    } else {
      var index = i_have.indexOf(this.value);
      if(index > -1){
        i_have.splice(index, 1);
      }
    }

    //~ Clear everything out.
    $('.array_contents').html('');
    for (var i = 0; i < markers.length; i++) {
      if(markers[i] !== undefined){
        markers[i].setMap(null);
      }
    }

    //~ Triple-nested For loops? Might need to start to refactor some of this silliness.
    for(i=0; i<stores.length;i++){
      for(x=0; x<stores[i].can_bring.length;x++){
        for(y=0; y<i_have.length;y++){
          if(stores[i].can_bring[x].indexOf(i_have[y]) > -1){
            tradein = stores[i].tradein.length > 0 ? ', and you can get ' + stores[i].tradein + '. ' : '. ';
            $('.array_contents').append('<p>You can bring your ' + stores[i].can_bring[x] + ' to ' + stores[i].name + tradein + '</p>');
              toggleMarker(stores[i], true);
          }
        }
      }
    }
  });

});