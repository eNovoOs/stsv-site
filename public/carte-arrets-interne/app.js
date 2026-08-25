/* Carte interne des arrêts — STSV.
   Outil d'équipe : tous les arrêts visibles d'un coup, numéro lisible sur la
   pastille, et une recherche qui accepte une adresse, un numéro d'arrêt ou le
   nom d'un lieu.

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
    stopEyebrow: 'Numéro d’arrêt',
    placeEyebrow: 'Lieu de référence',
    nearLabel: 'Arrêt le plus proche',
    onSite: 'sur place',
    via: (n) => `Position reprise de l’arrêt ${n} : le repère est au trottoir, pas à la porte.`,
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
    stopEyebrow: 'Stop number',
    placeEyebrow: 'Reference place',
    nearLabel: 'Nearest stop',
    onSite: 'on site',
    via: (n) => `Position taken from stop ${n}: the marker is at the curb, not at the door.`,
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
    stopEyebrow: 'Número de parada',
    placeEyebrow: 'Lugar de referencia',
    nearLabel: 'Parada más cercana',
    onSite: 'en el sitio',
    via: (n) => `Posición tomada de la parada ${n}: el punto está en la acera, no en la puerta.`,
    copy: 'Copiar el número',
    copied: 'Número copiado',
    close: 'Cerrar',
    noSector: 'Sector no especificado',
    stopWord: 'Parada',
    dataFail: 'Los datos de las paradas no se cargaron. Recarga la página; si persiste, avisa a RevUp CMO.',
  },
};
const L = I18N[LANG] || I18N.fr;

/* Si data.js n'a pas été chargé, tout ce qui suit échoue en silence et la page
   n'est qu'un rectangle gris. Mieux vaut le dire que laisser deviner. */
if (typeof PARADAS === 'undefined') {
  document.getElementById('map').innerHTML =
    `<p style="max-width:34ch;margin:22vh auto 0;text-align:center;font:500 15px/1.6 Poppins,sans-serif;color:#4B5563">${L.dataFail}</p>`;
  throw new Error('PARADAS introuvable : /carte/data.js ne s\'est pas chargé');
}

const $ = (id) => document.getElementById(id);

document.title = L.title;
$('page-title').textContent = L.title;
$('hint').innerHTML = L.hint;
$('count').innerHTML = `<b>${PARADAS.length}</b> ${L.count}`;
$('lg-stop').textContent = L.stop;
$('lg-sel').textContent = L.selected;
$('lg-ref').textContent = L.place;
$('stop-eyebrow').textContent = L.stopEyebrow;
$('place-eyebrow').textContent = L.placeEyebrow;
$('near-label').textContent = L.nearLabel;
$('panel-copy').textContent = L.copy;
$('panel-close').setAttribute('aria-label', L.close);

const btnLabels = $('toggle-labels');
btnLabels.textContent = L.labels;

/* Comparaison insensible aux accents et à la casse : « ile » doit trouver
   « Manoir des Îles », sinon la recherche ne sert à rien sur ce territoire. */
const sansAccents = (s) =>
  (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/* Distance orthodromique, en mètres. Aux distances en jeu ici (moins de
   quelques kilomètres) la formule est exacte à mieux qu'un mètre. */
const RAYON_TERRE = 6371000;
const rad = (d) => (d * Math.PI) / 180;
function distance(lat1, lng1, lat2, lng2) {
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * RAYON_TERRE * Math.asin(Math.sqrt(h));
}

/* Sous 25 m, un chiffre donnerait une fausse précision : le repère et l'arrêt
   sont au même endroit à la largeur d'un trottoir près. */
function formatDistance(m) {
  if (m < 25) return L.onSite;
  if (m < 1000) return `${Math.round(m / 5) * 5} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

function arretLePlusProche(lat, lng) {
  let meilleur = null;
  let min = Infinity;
  for (const p of PARADAS) {
    const d = distance(lat, lng, p.lat, p.lng);
    if (d < min) { min = d; meilleur = p; }
  }
  return { arret: meilleur, metres: min };
}

let map;
let numeroACopier = null;
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
   Pas de regroupement : l'équipe veut voir chaque arrêt tout de suite,
   pas une bulle qu'il faut ouvrir.
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

  /* L'arrêt mis en avant passe en rouge, dans une couche à part : le jeu de
     données vide par défaut évite de dupliquer les 393 arrêts. */
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

  map.on('click', 'arrets-pastille', (e) => afficherArret(e.features[0].properties));
  map.on('mouseenter', 'arrets-pastille', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'arrets-pastille', () => { map.getCanvas().style.cursor = ''; });
}

/* ------------------------------------------------------------------
   Repères sur la carte
   ------------------------------------------------------------------ */
function marquerArret(arret) {
  map.getSource('arret-choisi').setData({
    type: 'FeatureCollection',
    features: arret
      ? [{
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [arret.lng, arret.lat] },
          properties: { numero: arret.numero },
        }]
      : [],
  });
}

function marquerLieu(lng, lat) {
  if (epingleLieu) epingleLieu.remove();
  const el = document.createElement('div');
  el.style.cssText =
    'width:20px;height:20px;border-radius:50%;background:#135EEF;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)';
  epingleLieu = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
}

function effacerLieu() {
  if (epingleLieu) { epingleLieu.remove(); epingleLieu = null; }
}

/* ------------------------------------------------------------------
   Panneau — deux états, arrêt ou lieu
   ------------------------------------------------------------------ */
const panneau = $('panel');
const btnCopier = $('panel-copy');

function reinitialiserCopie() {
  btnCopier.textContent = L.copy;
  btnCopier.removeAttribute('data-done');
}

/** Un arrêt : cliqué sur la carte, ou trouvé par son numéro ou son nom. */
function afficherArret(props, recentrer = false) {
  const arret = PARADAS.find((p) => String(p.numero) === String(props.numero));
  numeroACopier = props.numero;

  $('stop-num').textContent = props.numero;
  $('stop-name').textContent = props.nom;
  $('stop-sector').textContent = props.secteur || L.noSector;
  panneau.dataset.mode = 'arret';
  reinitialiserCopie();

  /* Un arrêt et un lieu recherché ne coexistent pas : sinon le point bleu
     restait sous l'anneau rouge et le repère semblait désigner deux choses. */
  effacerLieu();
  marquerArret(arret);
  if (recentrer && arret) map.flyTo({ center: [arret.lng, arret.lat], zoom: 16, duration: 700 });
}

/**
 * Un lieu de référence. On montre le lieu ET l'arrêt qui le dessert, avec la
 * distance entre les deux : c'est la question que se pose l'équipe, et cela
 * rend lisible le cas où le repère est lui-même posé sur un arrêt.
 */
function afficherLieu(lieu) {
  const { arret, metres } = arretLePlusProche(lieu.lat, lieu.lng);
  numeroACopier = arret ? arret.numero : null;

  $('place-name').textContent = lieu.nombre;
  $('place-addr').textContent = lieu.desc || '';
  $('near-num').textContent = arret ? arret.numero : '—';
  $('near-dist').textContent = arret ? formatDistance(metres) : '';
  $('near-name').textContent = arret ? arret.nombre : '';
  /* Les six repères corrigés depuis un arrêt portent « viaArret » : on le dit,
     pour que personne ne s'étonne de voir le repère au bord de la rue. */
  $('near-via').textContent = lieu.viaArret ? L.via(lieu.viaArret) : '';

  panneau.dataset.mode = 'lieu';
  reinitialiserCopie();

  marquerLieu(lieu.lng, lieu.lat);
  marquerArret(arret);
  map.flyTo({ center: [lieu.lng, lieu.lat], zoom: 16, duration: 700 });
}

/** Une adresse trouvée par Mapbox : pas de fiche, juste le repère et l'arrêt. */
function afficherAdresse(lng, lat, nom) {
  afficherLieu({ nombre: nom, desc: '', lat, lng });
}

function fermerPanneau() {
  delete panneau.dataset.mode;
  numeroACopier = null;
  effacerLieu();
  marquerArret(null);
}

$('panel-close').addEventListener('click', fermerPanneau);

btnCopier.addEventListener('click', async () => {
  if (!numeroACopier) return;
  try {
    await navigator.clipboard.writeText(String(numeroACopier));
    btnCopier.textContent = L.copied;
    btnCopier.setAttribute('data-done', '');
  } catch {
    /* Presse-papiers refusé (contexte non sécurisé, permission) : on
       sélectionne le numéro pour que l'agent puisse le copier à la main. */
    const cible = panneau.dataset.mode === 'lieu' ? $('near-num') : $('stop-num');
    const plage = document.createRange();
    plage.selectNodeContents(cible);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(plage);
  }
});

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
    place_name: `${l.nombre}${l.desc ? ' — ' + l.desc : ''}`,
    center: [l.lng, l.lat],
    geometry: { type: 'Point', coordinates: [l.lng, l.lat] },
    place_type: ['poi'],
    stsvLieu: l,
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
  const r = e.result;
  const [lng, lat] = r.geometry.coordinates;
  if (r.stsvArret) afficherArret(r.stsvArret, true);
  else if (r.stsvLieu) afficherLieu(r.stsvLieu);
  else afficherAdresse(lng, lat, r.text || r.place_name || '');
});

geocodeur.on('clear', fermerPanneau);

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
