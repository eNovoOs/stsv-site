/* Carte interne des arrêts — STSV.
   Outil d'équipe : tous les arrêts visibles d'un coup, numéro lisible sur la
   pastille, et une recherche qui accepte aussi bien une adresse qu'un numéro
   d'arrêt ou le nom d'un lieu.

   Les données viennent de /carte/data.js (PARADAS, POIS_DATABASE,
   MAPBOX_TOKEN) : la carte publique et celle-ci partagent la même source,
   pour qu'un arrêt corrigé une fois le soit partout. */

const LANG = (new URLSearchParams(location.search).get('lang') || 'fr').slice(0, 2);
document.documentElement.lang = LANG;

const I18N = {
  fr: {
    title: 'Carte interne des arrêts — STSV',
    search: 'Adresse, numéro d’arrêt ou lieu…',
    hint: 'Cherchez une <strong>adresse</strong>, un <strong>numéro d’arrêt</strong> (<span class="num">2142</span>) ou un <strong>lieu</strong> (Manoir des Îles).',
    count: 'arrêts',
    labels: 'Numéros',
    stop: 'Arrêt de bus',
    selected: 'Arrêt sélectionné',
    place: 'Lieu recherché',
    eyebrow: 'Numéro d’arrêt',
    copy: 'Copier le numéro',
    copied: 'Numéro copié',
    close: 'Fermer',
    noSector: 'Secteur non précisé',
    stopWord: 'Arrêt',
    dataFail: 'Les données des arrêts ne se sont pas chargées. Rechargez la page ; si cela persiste, prévenez RevUp CMO.',
  },
  en: {
    title: 'Internal stop map — STSV',
    search: 'Address, stop number or place…',
    hint: 'Search an <strong>address</strong>, a <strong>stop number</strong> (<span class="num">2142</span>) or a <strong>place</strong> (Manoir des Îles).',
    count: 'stops',
    labels: 'Numbers',
    stop: 'Bus stop',
    selected: 'Selected stop',
    place: 'Searched place',
    eyebrow: 'Stop number',
    copy: 'Copy the number',
    copied: 'Number copied',
    close: 'Close',
    noSector: 'Sector not specified',
    stopWord: 'Stop',
    dataFail: 'The stop data did not load. Reload the page; if it persists, tell RevUp CMO.',
  },
  es: {
    title: 'Mapa interno de paradas — STSV',
    search: 'Dirección, número de parada o lugar…',
    hint: 'Busca una <strong>dirección</strong>, un <strong>número de parada</strong> (<span class="num">2142</span>) o un <strong>lugar</strong> (Manoir des Îles).',
    count: 'paradas',
    labels: 'Números',
    stop: 'Parada de autobús',
    selected: 'Parada seleccionada',
    place: 'Lugar buscado',
    eyebrow: 'Número de parada',
    copy: 'Copiar el número',
    copied: 'Número copiado',
    close: 'Cerrar',
    noSector: 'Sector no especificado',
    stopWord: 'Parada',
    dataFail: 'Los datos de las paradas no se cargaron. Recarga la página; si persiste, avisa a RevUp CMO.',
  },
};
const L = I18N[LANG] || I18N.fr;

/* Si data.js n'a pas ete charge, tout ce qui suit echoue en silence et la page
   n'est qu'un rectangle gris. Mieux vaut le dire que laisser deviner. */
if (typeof PARADAS === 'undefined') {
  document.getElementById('map').innerHTML =
    `<p style="max-width:34ch;margin:22vh auto 0;text-align:center;font:500 15px/1.6 Poppins,sans-serif;color:#4B5563">${L.dataFail}</p>`;
  throw new Error('PARADAS introuvable : /carte/data.js ne s\'est pas charge');
}

document.title = L.title;
document.getElementById('page-title').textContent = L.title;
document.getElementById('hint').innerHTML = L.hint;
document.getElementById('count').innerHTML = `<b>${PARADAS.length}</b> ${L.count}`;
document.getElementById('lg-stop').textContent = L.stop;
document.getElementById('lg-sel').textContent = L.selected;
document.getElementById('lg-ref').textContent = L.place;
document.getElementById('panel-eyebrow').textContent = L.eyebrow;
document.getElementById('panel-copy').textContent = L.copy;
document.getElementById('panel-close').setAttribute('aria-label', L.close);

const btnLabels = document.getElementById('toggle-labels');
btnLabels.textContent = L.labels;

/* Comparaison insensible aux accents et à la casse : « ile » doit trouver
   « Manoir des Îles », sinon la recherche ne sert à rien sur ce territoire. */
const sansAccents = (s) =>
  (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

let map;
let arretChoisi = null;
let epingleLieu = null;

mapboxgl.accessToken = MAPBOX_TOKEN;

map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-74.1331, 45.2501],
  zoom: 12.5,
  attributionControl: false,
});
map.addControl(new mapboxgl.AttributionControl({ compact: true }));
map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
map.addControl(
  new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, showUserLocation: true }),
  'bottom-right',
);

/* ------------------------------------------------------------------
   Les arrêts : une pastille par arrêt, le numéro écrit dedans.
   Pas de regroupement (clustering) : l'équipe veut voir chaque arrêt
   tout de suite, pas une bulle qu'il faut ouvrir.
   ------------------------------------------------------------------ */
function ajouterArrets() {
  map.addSource('arrets', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: PARADAS.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: { id: p.id, numero: p.numero, nom: p.nombre, secteur: p.secteur },
      })),
    },
  });

  /* La pastille grandit avec le zoom : assez petite pour que le réseau reste
     lisible de loin, assez grande pour contenir quatre chiffres de près. */
  map.addLayer({
    id: 'arrets-pastille',
    type: 'circle',
    source: 'arrets',
    paint: {
      'circle-color': '#FFC107',
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 4, 12, 9, 13.5, 14, 16, 19, 18, 23],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff',
    },
  });

  /* Le numéro n'apparaît qu'à partir du zoom où la pastille peut le contenir.
     « allow-overlap » garantit qu'aucun numéro ne disparaît : deux arrêts
     voisins se chevauchent plutôt que l'un des deux ne s'efface. */
  map.addLayer({
    id: 'arrets-numero',
    type: 'symbol',
    source: 'arrets',
    minzoom: 12,
    layout: {
      'text-field': ['get', 'numero'],
      'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 12, 8, 13.5, 10, 16, 13, 18, 15],
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: { 'text-color': '#111827' },
  });

  /* L'arrêt choisi passe en rouge, dans une couche à part : le filtre vide
     par défaut évite de dupliquer les données des 393 arrêts. */
  map.addSource('arret-choisi', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({
    id: 'arret-choisi-pastille',
    type: 'circle',
    source: 'arret-choisi',
    paint: {
      'circle-color': '#D50000',
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 7, 13.5, 17, 16, 22, 18, 26],
      'circle-stroke-width': 3,
      'circle-stroke-color': '#fff',
    },
  });
  map.addLayer({
    id: 'arret-choisi-numero',
    type: 'symbol',
    source: 'arret-choisi',
    layout: {
      'text-field': ['get', 'numero'],
      'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 10, 9, 13.5, 12, 16, 15, 18, 17],
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: { 'text-color': '#fff' },
  });

  map.on('click', 'arrets-pastille', (e) => ouvrirArret(e.features[0].properties));
  map.on('mouseenter', 'arrets-pastille', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'arrets-pastille', () => { map.getCanvas().style.cursor = ''; });
}

/* ------------------------------------------------------------------
   Panneau d'information
   ------------------------------------------------------------------ */
const panneau = document.getElementById('panel');
const btnCopier = document.getElementById('panel-copy');

function ouvrirArret(props, recentrer = false) {
  arretChoisi = props;
  /* Un arret et un lieu recherche ne coexistent pas : sans cela, cliquer une
     pastille apres une recherche laissait le point bleu sous l'anneau rouge,
     et le repere semblait pointer deux choses a la fois. */
  if (epingleLieu) { epingleLieu.remove(); epingleLieu = null; }
  document.getElementById('panel-num').textContent = props.numero;
  document.getElementById('panel-name').textContent = props.nom;
  document.getElementById('panel-sector').textContent = props.secteur || L.noSector;
  btnCopier.textContent = L.copy;
  btnCopier.removeAttribute('data-done');
  panneau.setAttribute('data-open', '');

  const arret = PARADAS.find((p) => String(p.numero) === String(props.numero));
  if (arret) {
    map.getSource('arret-choisi').setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [arret.lng, arret.lat] },
        properties: { numero: arret.numero },
      }],
    });
    if (recentrer) map.flyTo({ center: [arret.lng, arret.lat], zoom: 16, duration: 700 });
  }
}

function fermerPanneau() {
  panneau.removeAttribute('data-open');
  arretChoisi = null;
  map.getSource('arret-choisi').setData({ type: 'FeatureCollection', features: [] });
}

document.getElementById('panel-close').addEventListener('click', fermerPanneau);

btnCopier.addEventListener('click', async () => {
  if (!arretChoisi) return;
  try {
    await navigator.clipboard.writeText(String(arretChoisi.numero));
    btnCopier.textContent = L.copied;
    btnCopier.setAttribute('data-done', '');
  } catch {
    /* Presse-papiers refusé (contexte non sécurisé, permission) : on
       sélectionne le numéro pour que l'agent puisse le copier à la main. */
    const plage = document.createRange();
    plage.selectNodeContents(document.getElementById('panel-num'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(plage);
  }
});

/* Repère bleu pour une adresse ou un lieu trouvé — à distinguer d'un arrêt. */
function marquerLieu(lng, lat) {
  if (epingleLieu) epingleLieu.remove();
  const el = document.createElement('div');
  el.style.cssText =
    'width:20px;height:20px;border-radius:50%;background:#135EEF;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)';
  epingleLieu = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
}

/* ------------------------------------------------------------------
   Recherche locale : numéro d'arrêt, nom d'arrêt, lieu de référence.
   Elle complète le géocodeur Mapbox, qui continue de traiter les adresses.
   ------------------------------------------------------------------ */
function rechercheLocale(requete) {
  const q = sansAccents(requete);
  if (!q) return [];

  const exact = [];
  const debutNumero = [];
  const parNom = [];

  PARADAS.forEach((p) => {
    const num = String(p.numero);
    if (num === q) exact.push(p);
    else if (num.startsWith(q) && /^\d+$/.test(q)) debutNumero.push(p);
    else if (sansAccents(p.nombre).includes(q) || sansAccents(p.secteur).includes(q)) parNom.push(p);
  });

  const lieux = POIS_DATABASE.filter(
    (l) => sansAccents(l.nombre).includes(q) || sansAccents(l.desc).includes(q) || sansAccents(l.cat).includes(q),
  );

  const versArret = (p) => ({
    place_name: `${L.stopWord} ${p.numero} — ${p.nombre}`,
    center: [p.lng, p.lat],
    geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    place_type: ['poi'],
    stsvArret: { numero: p.numero, nom: p.nombre, secteur: p.secteur },
  });

  const versLieu = (l) => ({
    place_name: `${l.nombre} — ${l.desc}`,
    center: [l.lng, l.lat],
    geometry: { type: 'Point', coordinates: [l.lng, l.lat] },
    place_type: ['poi'],
  });

  /* Ordre voulu : le numéro exact d'abord — c'est la recherche d'un agent au
     téléphone —, puis les numéros qui commencent pareil, puis les lieux, puis
     les arrêts trouvés par leur nom. */
  return [
    ...exact.map(versArret),
    ...debutNumero.slice(0, 5).map(versArret),
    ...lieux.slice(0, 5).map(versLieu),
    ...parNom.slice(0, 6).map(versArret),
  ].slice(0, 12);
}

const geocodeur = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl,
  localGeocoder: rechercheLocale,
  placeholder: L.search,
  marker: false,
  countries: 'ca',
  proximity: { longitude: -74.1331, latitude: 45.2501 },
  limit: 6,
});
document.getElementById('geocoder').appendChild(geocodeur.onAdd(map));

geocodeur.on('result', (e) => {
  const [lng, lat] = e.result.geometry.coordinates;
  if (e.result.stsvArret) {
    ouvrirArret(e.result.stsvArret, true);
  } else {
    fermerPanneau();
    marquerLieu(lng, lat);
    map.flyTo({ center: [lng, lat], zoom: 16, duration: 700 });
  }
});

geocodeur.on('clear', () => {
  fermerPanneau();
  if (epingleLieu) { epingleLieu.remove(); epingleLieu = null; }
});

/* ------------------------------------------------------------------
   Bascule des numéros : une vue sans chiffres reste utile pour lire le
   réseau d'ensemble sur un secteur dense.
   ------------------------------------------------------------------ */
btnLabels.addEventListener('click', () => {
  const affiche = btnLabels.getAttribute('aria-pressed') === 'true';
  btnLabels.setAttribute('aria-pressed', String(!affiche));
  map.setLayoutProperty('arrets-numero', 'visibility', affiche ? 'none' : 'visible');
});

map.on('load', () => {
  ajouterArrets();
  map.resize();
});
