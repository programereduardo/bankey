var map = '';
var markers = [];
var dt = [];
var flightPath=null;
debugger
if (username !== 'gerente' && user_rol !== 'Administrador') {
  $('#pestana_mapa').css('display', 'none')
  $('#mostrar_mapa').css('display', 'none')
}
function initializate_map(){
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 10.9947115, lng: -74.79292509999999}
  });
  $.ajax({
    async: false,
    url: 'location/location_controller/get_location',
    success: function(response){
      resp = $.parseJSON(response);
      items = resp.data
      initMap(items)
    }
  })
} 

$('#buscar').on('click', function(){
  clearMarkers()
  removeLine()
  var vendedor = $('#vendedor').val()
  var vendedor_id = $('#vendedor-id').val()
  var desde = $('#desde').val()
  var hasta = $('#hasta').val()
  var next = true;
  if (vendedor == "" || vendedor == undefined) {
    generarNotify('Ingrese un vendedor.', 'danger')
    next = false;
  } else {
    if (vendedor_id == "" || vendedor_id == undefined) {
      generarNotify('Error! Ese vendedor no se encuentra registrado.', 'danger')
      next = false;
    }
  }
  if (next) {
    data = {
      vendedor: vendedor,
      vendedor_id: vendedor_id,
      desde: desde,
      hasta: hasta
    }
    $.ajax({
      async: false,
      url: 'location/location_controller/search_location',
      type: 'POST',
      data: data,
      success: function(response){
        resp = $.parseJSON(response)
        var items = resp.data;
        var success = resp.success;
        if (success) {
          deleteMarkers()
          initMap(items)
        }
      }
    })
  }
})

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -33, lng: 151}
  });

  var image = 'data:image/png;base64,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';
  var beachMarker = new google.maps.Marker({
    position: {lat: -33.890, lng: 151.274},
    map: map,
    icon: image
  });
}


function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function removeLine() {
  flightPath.setMap(null);
  dt=[];
}

$('#limpiar').on('click', function(){
  clear()
})

function clear(){
  clearMarkers()
  removeLine()
  limpiar()
}