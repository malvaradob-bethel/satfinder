/* =============================================================
   Mapas base para Leaflet · SIN API KEY · Unidad Técnica
   Uso:  const bases = makeBasemaps();
         bases['Satélite'].addTo(map);
         L.control.layers(bases).addTo(map);
   ============================================================= */
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';

function makeBasemaps() {
  // --- Esri (orden de tesela {z}/{y}/{x}) ---
  const sat = L.tileLayer(ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, attribution: '© Esri · Maxar · Earthstar Geographics' });
  const esriLabels = L.tileLayer(ESRI + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, opacity: .9 });
  const relief = L.tileLayer(ESRI + 'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, maxNativeZoom: 13, attribution: '© Esri' });
  const topoEsri = L.tileLayer(ESRI + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, attribution: '© Esri' });
  const physical = L.tileLayer(ESRI + 'World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, maxNativeZoom: 8, attribution: '© Esri' });
  const natgeo = L.tileLayer(ESRI + 'NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, maxNativeZoom: 16, attribution: '© Esri / National Geographic' });
  const grayLight = L.tileLayer(ESRI + 'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, maxNativeZoom: 16, attribution: '© Esri' });
  const grayDark = L.tileLayer(ESRI + 'Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19, maxNativeZoom: 16, attribution: '© Esri' });

  // --- OpenStreetMap / OpenTopoMap (orden {z}/{x}/{y}) ---
  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 19, subdomains: 'abc', attribution: '© OpenStreetMap' });
  const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    { maxZoom: 19, maxNativeZoom: 17, subdomains: 'abc', attribution: '© OpenTopoMap (CC-BY-SA) · © OpenStreetMap' });

  // --- CARTO (limpias clara/oscura · subdominios a,b,c,d) ---
  const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    { maxZoom: 20, subdomains: 'abcd', attribution: '© CARTO · © OpenStreetMap' });
  const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    { maxZoom: 20, subdomains: 'abcd', attribution: '© CARTO · © OpenStreetMap' });
  const cartoVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    { maxZoom: 20, subdomains: 'abcd', attribution: '© CARTO · © OpenStreetMap' });

  // Satélite híbrido = imagen + nombres
  const hybrid = L.layerGroup([sat, esriLabels]);

  return {
    'Satélite': hybrid,
    'Satélite (sin texto)': L.tileLayer(ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),
    'Calles (OSM)': street,
    'Topográfico': topo,
    'Topo Esri': topoEsri,
    'Relieve sombreado': relief,
    'Físico': physical,
    'NatGeo': natgeo,
    'Oscuro (CARTO)': cartoDark,
    'Claro (CARTO)': cartoLight,
    'Voyager': cartoVoyager,
    'Gris oscuro (Esri)': grayDark,
    'Gris claro (Esri)': grayLight
  };
}

/* Ejemplo:
   const map = L.map('map').setView([-9.2, -75], 5);
   const bases = makeBasemaps();
   bases['Satélite'].addTo(map);
   L.control.layers(bases, {}, { collapsed: true }).addTo(map);
*/
