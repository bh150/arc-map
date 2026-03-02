// =========================
// GLOBALS
// =========================

let map;
let currentOverlay = null;
let markerLayer;

// Map definitions
const maps = {
  "map1.png": { name: "Blue Gate" },
  "map2.png": { name: "Buried City" },
  "map3.png": { name: "Dam Battlegrounds" },
  "map4.png": { name: "Spaceport" },
  "quest.png": { name: "Quest Tree" }
};

// =========================
// QUEST TREE MARKER DATA
// Define all pins here
// Coordinates are [y, x]
// =========================

const questMarkers = [
  { y: 1488,  x: 1164, text: "Lure Grenade Blueprint" },
  { y: 1017,  x: 1866, text: "Burletta Blueprint" },
  { y: 1488, x: 1725, text: "Triggernade Blueprint" },
  { y: 863, x: 2007, text: "Hullcracker Blueprint" }
];


// =========================
// LOAD MAP
// =========================

function loadMap(filename) {
  const mapData = maps[filename];
  if (!mapData) {
    console.error("Map not found:", filename);
    return;
  }

  // Remove previous image
  if (currentOverlay) {
    map.removeLayer(currentOverlay);
  }

  // Clear old markers
  if (markerLayer) {
    markerLayer.clearLayers();
  }

  const img = new Image();

  img.onload = () => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    const bounds = [[0, 0], [height, width]];

    currentOverlay = L.imageOverlay(filename, bounds).addTo(map);

    map.fitBounds(bounds);
    map.setMaxBounds(bounds);

    // Only add markers for Quest Tree
    if (filename === "quest.png") {
      addQuestMarkers();
    }
  };

  img.onerror = () => {
    console.error("Failed to load image:", filename);
  };

  img.src = filename;
}


// =========================
// ADD QUEST MARKERS (LOOP)
// =========================

function addQuestMarkers() {
  questMarkers.forEach(marker => {

    L.circleMarker([marker.y, marker.x], {
      radius: 8,
      color: 'yellow',
      fillColor: 'yellow',
      fillOpacity: 0.9
    })
    .addTo(markerLayer)
    .bindPopup(marker.text);

  });
}


// =========================
// BUILD MENU
// =========================

function buildMenu() {
  const menu = document.getElementById("mapMenu");
  if (!menu) return;

  Object.keys(maps).forEach(filename => {
    const button = document.createElement("button");

    const displayName = maps[filename].name || filename.replace(".png", "");
    button.textContent = displayName;

    button.onclick = () => loadMap(filename);

    menu.appendChild(button);
  });
}


// =========================
// INITIALIZE
// =========================

document.addEventListener("DOMContentLoaded", () => {

  // Create map
  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    zoomControl: false,
    boxZoom: false
  });

  // Create marker layer group
  markerLayer = L.layerGroup().addTo(map);

  // Debug: click to get coordinates
  map.on('click', function(e) {
    console.log("Y:", e.latlng.lat, "X:", e.latlng.lng);
  });

  // Sidebar toggle
  const toggleBtn = document.getElementById("toggleMenu");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      if (!sidebar) return;

      const hidden = sidebar.classList.toggle("hidden");

      if (hidden) {
        toggleBtn.classList.add('tab-visible');
      } else {
        toggleBtn.classList.remove('tab-visible');
      }
    });
  }

  buildMenu();
  loadMap("map1.png"); // default map

});