let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.3, lng: -0.9 },
    zoom: 9,
  });
}

function focusLocation(lat, lng) {
  map.setCenter({ lat: lat, lng: lng });
  map.setZoom(12);
}


window.initMap = initMap;
window.focusLocation = focusLocation;
