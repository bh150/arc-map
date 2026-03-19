const xmin = 8144;
const xmax = 8175;
const ymin = 8140;
const ymax = 8181;
const tileSize = 256;

// Map init
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 14
});

// Center map in pixel space
const width = (xmax - xmin + 1) * tileSize;
const height = (ymax - ymin + 1) * tileSize;
map.setView([height/2, width/2], 14);
map.setMaxBounds([[0,0],[height, width]]);

// Custom tile layer
const CustomTileLayer = L.TileLayer.extend({
    getTileUrl: function(coords) {
        const x = coords.x + xmin;
        const y = coords.y + ymin;

        // Prevent requests outside existing tiles
        if(x < xmin || x > xmax || y < ymin || y > ymax) return '';

        return `dambattle_tiles/14/${x}/${y}.jpg`;
    }
});

// Add the tile layer
new CustomTileLayer('', {
    tileSize: tileSize,
    noWrap: true,
    errorTileUrl: '' // hides broken images
}).addTo(map);