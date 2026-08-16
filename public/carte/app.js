/* Carte des arrêts STSV — logique d'affichage.
   La langue vient du paramètre ?lang= (fr par défaut). */

const LANG = (new URLSearchParams(location.search).get('lang') || 'fr').slice(0, 2);
document.documentElement.lang = LANG;

const I18N = {
  fr: {
    lignes: '🚌 Lignes fixes', poiWalmart: '🛒 Walmarts', poiSante: '🏥 Santé / CLSC',
    poiRes: '🏠 Résidences', poiLoisirs: '🛍️ Loisirs / Autres',
    legend: 'Légende', ref: 'Lieu de référence', sel: 'Arrêt sélectionné', stop: 'Arrêt de bus',
    close: 'Fermer le panneau', search: '🔍 Chercher un lieu...',
    selectCat: 'Sélectionner', chooseLine: 'Choisir une ligne fixe',
    chooseHint: 'Sélectionnez une ligne pour voir son trajet et tous ses arrêts (aller/retour).',
    stopsCount: 'arrêts (2 directions)', stopsOrder: 'Ordre des arrêts', seeOrder: 'Voir l’ordre des arrêts',
    hideLine: '✕ Masquer la ligne', backList: '↩ Retour à la liste', hide: '✕ Masquer',
    details: 'Détails', reduce: 'Réduire', seeMap: '↓ Voir la carte', directions: 'directions',
    stopInfo: '🎯 Informations de l’arrêt', stopNum: 'Arrêt', at: 'À',
    start: '(début)', end: '(fin)', stopN: 'Arrêt',
    passages: 'Passages à cet arrêt', express: '— = course express, sans arrêt ici',
    expressTitle: 'Course express — cet arrêt n’est pas desservi',
    schedules: 'Horaires', weekdays: 'Lundi-vendredi', weekend: 'Samedi-dimanche',
    firstDep: 'Premier départ', lastDep: 'Dernier départ', tripCount: 'Nombre de courses',
    noService: 'Aucun service pour cette direction.',
    depFrom: 'Heures de départ depuis', arrivalAt: 'arrivée à', ofStops: 'de',
  },
  en: {
    lignes: '🚌 Fixed lines', poiWalmart: '🛒 Walmarts', poiSante: '🏥 Health / CLSC',
    poiRes: '🏠 Residences', poiLoisirs: '🛍️ Leisure / Other',
    legend: 'Legend', ref: 'Reference place', sel: 'Selected stop', stop: 'Bus stop',
    close: 'Close panel', search: '🔍 Search for a place...',
    selectCat: 'Select', chooseLine: 'Choose a fixed line',
    chooseHint: 'Select a line to see its route and all its stops (both directions).',
    stopsCount: 'stops (2 directions)', stopsOrder: 'Stop order', seeOrder: 'See stop order',
    hideLine: '✕ Hide line', backList: '↩ Back to list', hide: '✕ Hide',
    details: 'Details', reduce: 'Collapse', seeMap: '↓ See map', directions: 'directions',
    stopInfo: '🎯 Stop information', stopNum: 'Stop', at: 'At',
    start: '(start)', end: '(end)', stopN: 'Stop',
    passages: 'Times at this stop', express: '— = express trip, no stop here',
    expressTitle: 'Express trip — this stop is not served',
    schedules: 'Schedules', weekdays: 'Monday-Friday', weekend: 'Saturday-Sunday',
    firstDep: 'First departure', lastDep: 'Last departure', tripCount: 'Number of trips',
    noService: 'No service for this direction.',
    depFrom: 'Departure times from', arrivalAt: 'arriving at', ofStops: 'of',
  },
  es: {
    lignes: '🚌 Líneas fijas', poiWalmart: '🛒 Walmarts', poiSante: '🏥 Salud / CLSC',
    poiRes: '🏠 Residencias', poiLoisirs: '🛍️ Ocio / Otros',
    legend: 'Leyenda', ref: 'Lugar de referencia', sel: 'Parada seleccionada', stop: 'Parada de autobús',
    close: 'Cerrar el panel', search: '🔍 Buscar un lugar...',
    selectCat: 'Seleccionar', chooseLine: 'Elegir una línea fija',
    chooseHint: 'Selecciona una línea para ver su recorrido y todas sus paradas (ida/vuelta).',
    stopsCount: 'paradas (2 direcciones)', stopsOrder: 'Orden de las paradas', seeOrder: 'Ver el orden de las paradas',
    hideLine: '✕ Ocultar la línea', backList: '↩ Volver a la lista', hide: '✕ Ocultar',
    details: 'Detalles', reduce: 'Reducir', seeMap: '↓ Ver el mapa', directions: 'direcciones',
    stopInfo: '🎯 Información de la parada', stopNum: 'Parada', at: 'A',
    start: '(inicio)', end: '(fin)', stopN: 'Parada',
    passages: 'Pasos por esta parada', express: '— = viaje exprés, sin parada aquí',
    expressTitle: 'Viaje exprés — esta parada no se atiende',
    schedules: 'Horarios', weekdays: 'Lunes-viernes', weekend: 'Sábado-domingo',
    firstDep: 'Primera salida', lastDep: 'Última salida', tripCount: 'Número de viajes',
    noService: 'Sin servicio para esta dirección.',
    depFrom: 'Horas de salida desde', arrivalAt: 'llegada a', ofStops: 'de',
  },
};
const L = I18N[LANG] || I18N.fr;

/* Libellés statiques */
document.getElementById('btn-lignes-fixes').textContent = L.lignes;
document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = L[el.dataset.i18n]; });
document.getElementById('lg-title').textContent = L.legend;
document.getElementById('lg-ref').textContent = L.ref;
document.getElementById('lg-sel').textContent = L.sel;
document.getElementById('lg-stop').textContent = L.stop;
document.getElementById('btn-close-panel').setAttribute('aria-label', L.close);

const LIGNE_LAYER_IDS = ['ligne-trace-casing','ligne-trace','ligne-stops','ligne-stops-labels'];
const LIGNE_SOURCE_IDS = ['ligne-trace-src','ligne-stops-src'];
const ROUTE_CACHE = {};
let map, userMarker = null, sourceLoaded = false, currentGeocoder = null;
let currentLineNumero = null, currentLineDirection = 'aller', currentHoraireDayType = 'semaine';
let lineFetchReqId = 0;
let lignePanelStopsOpen = window.matchMedia('(min-width: 769px)').matches;
let lignePanelDetailsOpen = false;

function isMobileViewport() { return window.matchMedia('(max-width: 768px)').matches; }
function setPanelOpen(o) { document.body.classList.toggle('map-panel-open', o); }
function showResultPanel(box) { box.classList.add('show'); setPanelOpen(true); setLineReopenVisible(false); setTimeout(() => map && map.resize(), 0); }
function hideResultPanel(box) { box.classList.remove('show'); setPanelOpen(false); }

function getFitPadding(kind = 'default') {
  if (isMobileViewport()) {
    const reserve = kind === 'line' ? Math.round(innerHeight * 0.26) : Math.round(innerHeight * 0.34);
    return { top: 128, bottom: reserve, left: 28, right: 28 };
  }
  return kind === 'line' ? { top: 150, bottom: 80, left: 60, right: 60 } : { top: 130, bottom: 90, left: 90, right: 90 };
}

function clearUserSelection(resetGeocoder = false) {
  if (userMarker) { userMarker.remove(); userMarker = null; }
  if (sourceLoaded) {
    map.setPaintProperty('paradas-individuales', 'circle-color', '#FFC107');
    map.setPaintProperty('paradas-individuales', 'circle-radius', 8);
  }
  if (resetGeocoder) {
    const i = document.querySelector('.mapboxgl-ctrl-geocoder--input');
    if (i) i.value = '';
  }
}

function setLineReopenVisible(v) {
  const btn = document.getElementById('ligne-reopen-btn');
  if (!btn) return;
  const show = v && currentLineNumero !== null && isMobileViewport();
  btn.classList.toggle('show', show);
  document.body.classList.toggle('line-panel-collapsed', show);
  if (show) {
    const ligne = LIGNES_FIXES[currentLineNumero];
    document.getElementById('ligne-reopen-label').textContent = `${ligne.nom} · ${L.directions}`;
    btn.style.borderColor = ligne.couleur;
    btn.style.color = ligne.couleur;
  }
}

function collapseLignePanelToMap() {
  if (currentLineNumero === null) return;
  const box = document.getElementById('result-box');
  lignePanelDetailsOpen = false;
  box.classList.remove('ligne-details-open');
  hideResultPanel(box);
  setLineReopenVisible(true);
  setTimeout(() => map && map.resize(), 0);
}
function showLignePanelFromMap() { if (currentLineNumero !== null) renderLignePanel(currentLineNumero); }

function onLigneStopMouseEnter() { map.getCanvas().style.cursor = 'pointer'; }
function onLigneStopMouseLeave() { map.getCanvas().style.cursor = ''; }
function detachLigneLayerHandlers() {
  if (!map || !map.getLayer('ligne-stops')) return;
  map.off('click', 'ligne-stops', onLigneStopClick);
  map.off('mouseenter', 'ligne-stops', onLigneStopMouseEnter);
  map.off('mouseleave', 'ligne-stops', onLigneStopMouseLeave);
}

function resolveStops(ids) {
  return ids.map(id => STOPS_CATALOG[id] ? { id, ...STOPS_CATALOG[id] } : null).filter(Boolean);
}
function getPassagesArret(numero, direction, stopId) {
  if (numero !== 30) return null;
  const d = (LIGNE30_PASSAGES || {})[direction];
  if (!d) return null;
  const t = d[stopId];
  return (t && t.length) ? t : null;
}
function formatPassagesHtml(times, couleur) {
  if (!times) return '';
  return times.map(t => t
    ? `<span style="display:inline-block;background:${couleur}14;color:${couleur};border:1px solid ${couleur}55;border-radius:4px;padding:1px 5px;margin:2px 3px 0 0;font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;">${t}</span>`
    : `<span title="${L.expressTitle}" style="display:inline-block;background:#f4f4f4;color:#bbb;border:1px solid #e2e2e2;border-radius:4px;padding:1px 5px;margin:2px 3px 0 0;font-size:11px;">—</span>`
  ).join('');
}

async function fetchRouteGeometry(stops) {
  if (!stops || stops.length < 2) return null;
  const MAX = 25, chunks = [];
  for (let i = 0; i < stops.length; i += (MAX - 1)) {
    chunks.push(stops.slice(i, i + MAX));
    if (i + MAX >= stops.length) break;
  }
  try {
    const all = [];
    for (const chunk of chunks) {
      const coords = chunk.map(s => `${s.lon},${s.lat}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data.routes || !data.routes[0]) throw new Error('no route');
      const seg = data.routes[0].geometry.coordinates;
      if (all.length > 0 && seg.length > 0) seg.shift();
      all.push(...seg);
    }
    return { type: 'LineString', coordinates: all };
  } catch (e) {
    console.warn('Directions API:', e);
    return null;
  }
}

function initMap() {
  const el = document.getElementById('map');
  if (!el) { setTimeout(initMap, 100); return; }
  mapboxgl.accessToken = MAPBOX_TOKEN;
  map = new mapboxgl.Map({
    container: 'map', style: 'mapbox://styles/mapbox/streets-v12',
    center: [-74.1331, 45.2501], zoom: 13, attributionControl: false
  });
  map.addControl(new mapboxgl.AttributionControl({ compact: true }));
  map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: false }), 'bottom-right');
  const geo = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true }, trackUserLocation: false,
    showUserLocation: false, showUserHeading: false
  });
  map.addControl(geo, 'bottom-right');
  geo.on('geolocate', e => mostrarUbicacionUsuario(e.coords.longitude, e.coords.latitude));

  new ResizeObserver(() => map.resize()).observe(document.getElementById('map-wrapper-id'));
  map.on('load', () => { map.resize(); agregarParadasOptimizado(); });

  function buscadorLocal(query) {
    const s = query.toLowerCase();
    return POIS_DATABASE.filter(p => p.nombre.toLowerCase().includes(s) || p.cat.toLowerCase().includes(s))
      .map(p => ({ place_name: `⭐ ${p.nombre}`, center: [p.lng, p.lat], geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, place_type: ['poi'] }));
  }
  currentGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken, mapboxgl, localGeocoder: buscadorLocal,
    placeholder: L.search, marker: false, countries: 'ca',
    proximity: { longitude: -74.1331, latitude: 45.2501 }
  });
  document.getElementById('geocoder').appendChild(currentGeocoder.onAdd(map));
  currentGeocoder.on('result', e => mostrarUbicacionUsuario(e.result.geometry.coordinates[0], e.result.geometry.coordinates[1]));
  currentGeocoder.on('clear', () => limpiarBusqueda());
}

function mostrarOpcionesPOI(categoria) {
  if (currentLineNumero !== null) limpiarLigne(true);
  const box = document.getElementById('result-box');
  const content = document.getElementById('result-content');
  box.classList.remove('ligne-mode', 'ligne-details-open');
  box.style.borderLeftColor = ''; box.style.borderTopColor = '';
  const lista = POIS_DATABASE.filter(p => p.cat === categoria);
  let html = `<h4 style="margin-bottom:12px;font-size:14px;color:#135EEF;">📍 ${L.selectCat} (${categoria})</h4>`;
  lista.forEach((poi, i) => {
    html += `<div class="poi-option-item" onclick="seleccionarOpcionDirecta(${i},'${categoria}')"><strong>${poi.nombre}</strong><span>${poi.desc}</span></div>`;
  });
  content.innerHTML = html;
  box.scrollTop = 0;
  showResultPanel(box);
}
function seleccionarOpcionDirecta(index, categoria) {
  const poi = POIS_DATABASE.filter(p => p.cat === categoria)[index];
  map.flyTo({ center: [poi.lng, poi.lat], zoom: 15 });
  mostrarUbicacionUsuario(poi.lng, poi.lat);
  const i = document.querySelector('.mapboxgl-ctrl-geocoder--input');
  if (i) i.value = poi.nombre;
}

function mostrarLignesFixes() {
  if (currentLineNumero !== null) { limpiarLigne(); return; }
  const box = document.getElementById('result-box');
  const content = document.getElementById('result-content');
  clearUserSelection(false);
  box.classList.add('ligne-mode');
  box.classList.remove('ligne-details-open');
  box.style.borderLeftColor = ''; box.style.borderTopColor = '';
  let html = `<h4 style="margin-bottom:6px;font-size:14px;color:#135EEF;">🚌 ${L.chooseLine}</h4>`;
  html += `<div style="font-size:11px;color:#888;margin-bottom:12px;">${L.chooseHint}</div>`;
  Object.values(LIGNES_FIXES).forEach(ligne => {
    const total = Object.values(ligne.directions).reduce((s, d) => s + d.stops.length, 0);
    html += `<div class="ligne-card" onclick="seleccionarLigne(${ligne.numero})">
      <div class="ligne-badge" style="background:${ligne.couleur};">${ligne.numero}</div>
      <div class="ligne-info"><strong>${ligne.nom} — ${ligne.sousNom}</strong><span>${ligne.sousNom} · ${total} ${L.stopsCount}</span></div>
    </div>`;
  });
  content.innerHTML = html;
  box.scrollTop = 0;
  lignePanelDetailsOpen = false;
  showResultPanel(box);
  document.getElementById('btn-lignes-fixes').classList.add('active');
}

async function seleccionarLigne(numero, direction) {
  const ligne = LIGNES_FIXES[numero];
  if (!ligne || !ligne.disponible) return;
  const initial = (currentLineNumero !== numero);
  if (initial) limpiarLigne(false);
  currentLineNumero = numero;
  currentLineDirection = direction || 'aller';
  if (isMobileViewport()) { lignePanelDetailsOpen = false; lignePanelStopsOpen = false; }

  const dir = ligne.directions[currentLineDirection];
  const stops = resolveStops(dir.stops);

  detachLigneLayerHandlers();
  LIGNE_LAYER_IDS.forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
  LIGNE_SOURCE_IDS.forEach(id => { if (map.getSource(id)) map.removeSource(id); });

  const cacheKey = `${numero}-${currentLineDirection}`;
  const straight = { type: 'LineString', coordinates: stops.map(s => [s.lon, s.lat]) };
  const cached = ROUTE_CACHE[cacheKey];
  const isRouted = !!cached;

  map.addSource('ligne-trace-src', { type: 'geojson', data: { type: 'Feature', geometry: cached || straight, properties: {} } });
  map.addLayer({ id: 'ligne-trace-casing', type: 'line', source: 'ligne-trace-src',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#ffffff', 'line-width': 9, 'line-opacity': 0.9 } });
  map.addLayer({ id: 'ligne-trace', type: 'line', source: 'ligne-trace-src',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': ligne.couleur, 'line-width': 5,
      'line-opacity': isRouted ? 0.95 : 0.55, 'line-dasharray': isRouted ? [1, 0] : [2, 1.5] } });

  map.addSource('ligne-stops-src', { type: 'geojson', data: {
    type: 'FeatureCollection',
    features: stops.map((s, i) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [s.lon, s.lat] },
      properties: { id: s.id, nom: s.nom, ordre: i + 1, terminus: i === 0 || i === stops.length - 1 } }))
  } });
  map.addLayer({ id: 'ligne-stops', type: 'circle', source: 'ligne-stops-src',
    paint: { 'circle-color': ligne.couleur,
      'circle-radius': ['case', ['==', ['get', 'terminus'], true], 14, 11],
      'circle-stroke-width': ['case', ['==', ['get', 'terminus'], true], 3, 2],
      'circle-stroke-color': '#fff' } });
  map.addLayer({ id: 'ligne-stops-labels', type: 'symbol', source: 'ligne-stops-src',
    layout: { 'text-field': ['to-string', ['get', 'ordre']],
      'text-size': ['case', ['==', ['get', 'terminus'], true], 13, 11],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-allow-overlap': true },
    paint: { 'text-color': '#ffffff' } });

  map.on('click', 'ligne-stops', onLigneStopClick);
  map.on('mouseenter', 'ligne-stops', onLigneStopMouseEnter);
  map.on('mouseleave', 'ligne-stops', onLigneStopMouseLeave);

  if (sourceLoaded) {
    map.setPaintProperty('paradas-individuales', 'circle-opacity', 0.18);
    map.setPaintProperty('paradas-individuales', 'circle-stroke-opacity', 0.25);
    map.setPaintProperty('clusters', 'circle-opacity', 0.25);
    map.setLayoutProperty('cluster-count', 'visibility', 'none');
  }

  if (straight.coordinates.length > 0) {
    const b = new mapboxgl.LngLatBounds();
    straight.coordinates.forEach(c => b.extend(c));
    map.fitBounds(b, { padding: getFitPadding('line'), duration: 800, maxZoom: 14 });
  }

  document.getElementById('legend-ligne-dot').style.background = ligne.couleur;
  document.getElementById('legend-ligne-label').textContent = `${L.stop} — ${ligne.nom}`;
  document.getElementById('legend-ligne').style.display = 'flex';

  renderLignePanel(numero);
  document.getElementById('btn-lignes-fixes').classList.add('active');
  renderHoraires(numero);

  if (!isRouted) {
    const reqId = ++lineFetchReqId;
    const routed = await fetchRouteGeometry(stops);
    if (reqId !== lineFetchReqId) return;
    if (currentLineNumero !== numero || currentLineDirection !== (direction || 'aller')) return;
    if (routed) {
      ROUTE_CACHE[cacheKey] = routed;
      const src = map.getSource('ligne-trace-src');
      if (src) src.setData({ type: 'Feature', geometry: routed, properties: {} });
      if (map.getLayer('ligne-trace')) {
        map.setPaintProperty('ligne-trace', 'line-opacity', 0.95);
        map.setPaintProperty('ligne-trace', 'line-dasharray', [1, 0]);
      }
    }
  }
}

function changerDirection(d) { if (currentLineNumero) seleccionarLigne(currentLineNumero, d); }

function renderHoraires(numero) {
  const ligne = LIGNES_FIXES[numero];
  const dir = ligne.directions[currentLineDirection];
  const horaires = (LIGNES_HORAIRES[numero] || {})[currentLineDirection] || {};
  const stops = resolveStops(dir.stops);
  const first = stops[0], last = stops[stops.length - 1];
  const dep = horaires[currentHoraireDayType] || [];
  const semaineN = (horaires.semaine || []).length, weekendN = (horaires.weekend || []).length;

  const tabs = `<div class="horaires-tabs">
    <button class="horaires-tab ${currentHoraireDayType === 'semaine' ? 'active' : ''} ${!semaineN ? 'disabled' : ''}" type="button"
      style="${currentHoraireDayType === 'semaine' ? `background:${ligne.couleur};border-color:${ligne.couleur};` : ''}"
      ${!semaineN ? 'disabled' : `onclick="setHoraireDayType('semaine')"`}>${L.weekdays}${semaineN ? ` <span style="opacity:.7;">(${semaineN})</span>` : ''}</button>
    <button class="horaires-tab ${currentHoraireDayType === 'weekend' ? 'active' : ''} ${!weekendN ? 'disabled' : ''}" type="button"
      style="${currentHoraireDayType === 'weekend' ? `background:${ligne.couleur};border-color:${ligne.couleur};` : ''}"
      ${!weekendN ? 'disabled' : `onclick="setHoraireDayType('weekend')"`}>${L.weekend}${weekendN ? ` <span style="opacity:.7;">(${weekendN})</span>` : ''}</button>
  </div>`;

  let body;
  if (dep.length === 0) {
    body = `<div class="horaires-empty">${L.noService}</div>`;
  } else {
    body = `<div class="horaires-summary">
        <div class="horaires-stat"><div class="horaires-stat-label">${L.firstDep}</div><div class="horaires-stat-value">${dep[0]}</div></div>
        <div class="horaires-stat"><div class="horaires-stat-label">${L.lastDep}</div><div class="horaires-stat-value">${dep[dep.length - 1]}</div></div>
        <div class="horaires-stat"><div class="horaires-stat-label">${L.tripCount}</div><div class="horaires-stat-value">${dep.length}</div></div>
      </div>
      <div style="font-size:11px;color:#777;margin:8px 0 6px;">${L.depFrom} <strong>${first ? first.nom : ''}</strong>${last && last !== first ? ` · ${L.arrivalAt} <strong>${last.nom}</strong>` : ''}</div>
      <div class="horaires-departures">${dep.map(t => `<div class="horaires-time">${t}</div>`).join('')}</div>`;
  }

  document.getElementById('horaires-inner').innerHTML = `
    <div class="horaires-header">
      <div class="ligne-badge" style="background:${ligne.couleur};">${ligne.numero}</div>
      <div class="horaires-title"><h3>${L.schedules} — ${ligne.nom} · ${dir.label}</h3><small>${ligne.description}</small></div>
      ${tabs}
    </div>
    ${ligne.note ? `<div class="horaires-note">⚠ ${ligne.note}</div>` : ''}
    ${body}`;
  document.getElementById('horaires-section').style.display = 'block';
}
function setHoraireDayType(t) { currentHoraireDayType = t; if (currentLineNumero !== null) renderHoraires(currentLineNumero); }
function hideHoraires() {
  document.getElementById('horaires-section').style.display = 'none';
  document.getElementById('horaires-inner').innerHTML = '';
}

function renderLignePanel(numero) {
  const ligne = LIGNES_FIXES[numero];
  const dir = ligne.directions[currentLineDirection];
  const stops = resolveStops(dir.stops);
  const box = document.getElementById('result-box');
  const content = document.getElementById('result-content');
  const mob = isMobileViewport();

  box.classList.add('ligne-mode');
  box.classList.toggle('ligne-details-open', mob && lignePanelDetailsOpen);
  box.style.borderLeftColor = ligne.couleur;
  box.style.borderTopColor = ligne.couleur;

  const dirTabs = Object.keys(ligne.directions).map(key => {
    const d = ligne.directions[key], on = key === currentLineDirection;
    return `<button class="ligne-dir-tab" type="button" onclick="changerDirection('${key}')"
      style="background:${on ? ligne.couleur : '#fff'};color:${on ? '#fff' : '#444'};border-color:${on ? ligne.couleur : '#ddd'};">
      ${key === 'aller' ? '→' : '←'} ${d.court || d.label}</button>`;
  }).join('');

  const stopsList = stops.map((s, i) => {
    const tag = i === 0 ? `<em style="color:#999;font-weight:normal;font-size:10px;">${L.start}</em>`
              : i === stops.length - 1 ? `<em style="color:#999;font-weight:normal;font-size:10px;">${L.end}</em>` : '';
    const p = getPassagesArret(numero, currentLineDirection, s.id);
    return `<div class="poi-option-item" onclick="zoomLigneStop(${numero},${i})">
      <strong>${i + 1}. ${s.nom} ${tag}</strong>
      ${p ? `<div style="margin-top:3px;">${formatPassagesHtml(p, ligne.couleur)}</div>` : ''}
      ${mob ? '' : `<span>${L.stopN} #${s.id}</span>`}</div>`;
  }).join('');

  const noteHtml = ligne.note ? `<div style="background:#FFF8E1;border-left:3px solid #FFC107;padding:8px 10px;border-radius:4px;font-size:11px;color:#5D4037;margin-bottom:10px;">⚠ ${ligne.note}</div>` : '';
  const dirNotes = (dir.notes || []).map(n => `<div style="font-size:10px;color:#999;font-style:italic;margin-top:4px;">ⓘ ${n}</div>`).join('');

  const stopsBlock = lignePanelStopsOpen
    ? `<div style="margin-top:10px;${mob ? '' : ' border-top:1px solid #eee;padding-top:10px;'}">
         <button class="stops-toggle open" type="button" onclick="toggleStopsList()" style="display:${mob ? 'flex' : 'none'};">
           <span>${L.stopsOrder} (${stops.length})</span><span class="stops-toggle-arrow">▼</span></button>
         <strong style="font-size:12px;color:#333;display:${mob ? 'none' : 'block'};">${L.stopsOrder}</strong>
         <div style="max-height:${mob ? '180px' : '200px'};overflow-y:auto;margin-top:8px;">${stopsList}</div></div>`
    : `<button class="stops-toggle" type="button" onclick="toggleStopsList()">
         <span>${L.seeOrder} (${stops.length})</span><span class="stops-toggle-arrow">▼</span></button>`;

  const detailsContent = `${mob ? '' : `${noteHtml}${dirNotes}`}${stopsBlock}`;
  const details = mob ? (lignePanelDetailsOpen ? `<div class="ligne-mobile-details">${detailsContent}</div>` : '') : detailsContent;

  const actions = mob
    ? `<button class="ligne-clear-btn" type="button" onclick="toggleLigneDetails()">${lignePanelDetailsOpen ? L.reduce : L.details}</button>
       <button class="ligne-clear-btn ligne-map-toggle" type="button" onclick="collapseLignePanelToMap()">${L.seeMap}</button>`
    : `<button class="ligne-clear-btn" type="button" onclick="limpiarLigne()">${L.hideLine}</button>`;

  content.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:7px;">
      <div class="ligne-badge" style="background:${ligne.couleur};width:36px;height:36px;font-size:13px;flex-shrink:0;">${ligne.numero}</div>
      <div style="min-width:0;"><h4 style="color:${ligne.couleur};font-size:14px;margin:0;line-height:1.2;">${ligne.nom} — ${ligne.sousNom}</h4></div>
    </div>
    <div class="ligne-dir-tabs">${dirTabs}</div>
    <div style="background:#f7faff;padding:10px;border-radius:8px;font-size:12px;margin-top:8px;"><strong>${dir.label}</strong> — ${stops.length} ${L.stop.toLowerCase()}s</div>
    <div class="ligne-actions">${actions}</div>
    ${details}`;
  showResultPanel(box);
}
function toggleLigneDetails() { lignePanelDetailsOpen = !lignePanelDetailsOpen; if (currentLineNumero !== null) renderLignePanel(currentLineNumero); }
function toggleStopsList() { lignePanelStopsOpen = !lignePanelStopsOpen; if (currentLineNumero !== null) renderLignePanel(currentLineNumero); }
function zoomLigneStop(numero, idx) {
  const dir = LIGNES_FIXES[numero].directions[currentLineDirection];
  const stop = STOPS_CATALOG[dir.stops[idx]];
  if (!stop) return;
  if (isMobileViewport()) { lignePanelDetailsOpen = false; lignePanelStopsOpen = false; renderLignePanel(numero); }
  map.flyTo({ center: [stop.lon, stop.lat], zoom: 16 });
}

function onLigneStopClick(e) {
  const p = e.features[0].properties;
  const ligne = LIGNES_FIXES[currentLineNumero];
  const dir = ligne.directions[currentLineDirection];
  const box = document.getElementById('result-box');
  const mob = isMobileViewport();
  const passages = getPassagesArret(currentLineNumero, currentLineDirection, Number(p.id));

  const actions = mob
    ? `<button class="ligne-clear-btn" type="button" onclick="renderLignePanel(${currentLineNumero})">${L.backList}</button>
       <button class="ligne-clear-btn ligne-map-toggle" type="button" onclick="collapseLignePanelToMap()">${L.seeMap}</button>`
    : `<button class="ligne-clear-btn" type="button" onclick="renderLignePanel(${currentLineNumero})">${L.backList}</button>
       <button class="ligne-clear-btn" type="button" onclick="limpiarLigne()">${L.hide}</button>`;

  box.style.borderLeftColor = ligne.couleur;
  box.style.borderTopColor = ligne.couleur;
  document.getElementById('result-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div class="ligne-badge" style="background:${ligne.couleur};width:36px;height:36px;font-size:13px;">${ligne.numero}</div>
      <div><h4 style="color:${ligne.couleur};font-size:14px;margin:0;">${ligne.nom} · ${dir.label}</h4>
      ${mob ? '' : `<span style="font-size:11px;color:#777;">${L.stopN} ${p.ordre} ${L.ofStops} ${dir.stops.length} · #${p.id}</span>`}</div>
    </div>
    <p style="color:#444;font-size:13px;margin:6px 0 10px;">${p.nom}</p>
    ${passages ? `<div style="background:#fafafa;border:1px solid #eee;border-radius:6px;padding:8px 10px;margin-bottom:10px;">
      <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">${L.passages} · ${dir.label}</div>
      <div>${formatPassagesHtml(passages, ligne.couleur)}</div>
      ${passages.some(t => !t) ? `<div style="font-size:10px;color:#999;font-style:italic;margin-top:5px;">${L.express}</div>` : ''}</div>` : ''}
    <div class="ligne-actions">${actions}</div>`;
  showResultPanel(box);
}

function limpiarLigne(restoreUI = true) {
  if (currentLineNumero === null) {
    if (restoreUI) document.getElementById('btn-lignes-fixes').classList.remove('active');
    return;
  }
  detachLigneLayerHandlers();
  LIGNE_LAYER_IDS.forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
  LIGNE_SOURCE_IDS.forEach(id => { if (map.getSource(id)) map.removeSource(id); });
  if (sourceLoaded) {
    map.setPaintProperty('paradas-individuales', 'circle-opacity', 1);
    map.setPaintProperty('paradas-individuales', 'circle-stroke-opacity', 1);
    map.setPaintProperty('clusters', 'circle-opacity', 1);
    map.setLayoutProperty('cluster-count', 'visibility', 'visible');
  }
  document.getElementById('legend-ligne').style.display = 'none';
  currentLineNumero = null;
  currentLineDirection = 'aller';
  currentHoraireDayType = 'semaine';
  lignePanelDetailsOpen = false;
  setLineReopenVisible(false);
  hideHoraires();
  if (restoreUI) {
    const box = document.getElementById('result-box');
    box.classList.remove('ligne-mode', 'ligne-details-open');
    hideResultPanel(box);
    box.style.borderLeftColor = ''; box.style.borderTopColor = '';
    document.getElementById('btn-lignes-fixes').classList.remove('active');
  }
}

function agregarParadasOptimizado() {
  map.addSource('paradas', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: PARADAS.map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, properties: { ...p } })) },
    cluster: true, clusterMaxZoom: 14, clusterRadius: 50
  });
  map.addLayer({ id: 'clusters', type: 'circle', source: 'paradas', filter: ['has', 'point_count'],
    paint: { 'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 30, '#f28cb1'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40] } });
  map.addLayer({ id: 'cluster-count', type: 'symbol', source: 'paradas', filter: ['has', 'point_count'],
    layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-size': 12 } });
  map.addLayer({ id: 'paradas-individuales', type: 'circle', source: 'paradas', filter: ['!', ['has', 'point_count']],
    paint: { 'circle-color': '#FFC107', 'circle-radius': 8, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } });
  sourceLoaded = true;

  map.on('click', 'clusters', e => {
    const f = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    map.getSource('paradas').getClusterExpansionZoom(f[0].properties.cluster_id, (err, zoom) => {
      if (err) return;
      map.easeTo({ center: f[0].geometry.coordinates, zoom, duration: 500 });
    });
  });
  map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });

  map.on('click', 'paradas-individuales', e => {
    if (currentLineNumero !== null) limpiarLigne(true);
    const props = e.features[0].properties;
    const coords = e.features[0].geometry.coordinates;
    actualizarSeleccionVisual(props.id);
    let dist = 0;
    if (userMarker) {
      const u = userMarker.getLngLat();
      dist = calcularDistancia(u.lat, u.lng, coords[1], coords[0]);
    }
    mostrarResultadoFinal(props, dist);
  });
  map.on('mouseenter', 'paradas-individuales', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'paradas-individuales', () => { map.getCanvas().style.cursor = ''; });
}

function actualizarSeleccionVisual(id) {
  map.setPaintProperty('paradas-individuales', 'circle-color', ['case', ['==', ['get', 'id'], id], '#D50000', '#FFC107']);
  map.setPaintProperty('paradas-individuales', 'circle-radius', ['case', ['==', ['get', 'id'], id], 14, 8]);
}

function mostrarUbicacionUsuario(lng, lat) {
  if (userMarker) userMarker.remove();
  const el = document.createElement('div');
  el.innerHTML = '<div style="background:#135EEF;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.4);"></div>';
  userMarker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
  encontrarParadaMasCercana(lat, lng);
}

function encontrarParadaMasCercana(userLat, userLng) {
  let min = Infinity, best = null;
  PARADAS.forEach(p => {
    const d = calcularDistancia(userLat, userLng, p.lat, p.lng);
    if (d < min) { min = d; best = p; }
  });
  if (!best) return;
  actualizarSeleccionVisual(best.id);
  mostrarResultadoFinal(best, min);
  const b = new mapboxgl.LngLatBounds();
  b.extend([userLng, userLat]); b.extend([best.lng, best.lat]);
  map.fitBounds(b, { padding: getFitPadding('search'), maxZoom: 16 });
}

function mostrarResultadoFinal(parada, distancia) {
  const box = document.getElementById('result-box');
  box.classList.remove('ligne-mode', 'ligne-details-open');
  box.style.borderLeftColor = '#D50000';
  box.style.borderTopColor = '#D50000';
  let dist = '';
  if (distancia > 0) {
    const txt = distancia < 1 ? `${(distancia * 1000).toFixed(0)} m` : `${distancia.toFixed(2)} km`;
    dist = `<div style="background:#f0f7ff;padding:10px;border-radius:8px;margin-top:10px;"><span style="color:#17794A;font-weight:600;font-size:14px;">📍 ${L.at} ${txt}</span></div>`;
  }
  document.getElementById('result-content').innerHTML = `
    <h4 style="color:#D50000;margin-bottom:8px;font-size:14px;">${L.stopInfo}</h4>
    <p style="font-size:16px;"><strong>${L.stopNum} #${parada.numero}</strong></p>
    <p style="color:#666;font-size:12px;margin:4px 0;">${parada.nombre}</p>${dist}`;
  showResultPanel(box);
}

function limpiarBusqueda() {
  if (currentLineNumero !== null) limpiarLigne();
  const box = document.getElementById('result-box');
  box.classList.remove('ligne-mode', 'ligne-details-open');
  hideResultPanel(box);
  box.style.borderLeftColor = ''; box.style.borderTopColor = '';
  clearUserSelection(true);
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMap);
else initMap();
