# Campagne Cégep — code QR et affiche

| Fichier | Contenu |
|---|---|
| `qr-stsv-cegep.svg` | Code QR vectoriel, modules noirs sur blanc, zone de silence de 4 modules |
| `qr-stsv-cegep.png` | Même code, 2640 × 2640 px (600 ppp) |
| `affiche-cegep.pdf` | Affiche A4 prête à imprimer |
| `affiche-cegep.html` | Source de l'affiche |
| `build-poster.cjs` | Régénère le PDF : `node print/cegep/build-poster.cjs` |

Le code encode exactement `https://stsv.ca/cegep` : une adresse permanente du
site, sans raccourcisseur ni service tiers. Décodage vérifié (OpenCV et
zxing-cpp) sur le PNG, sur le SVG rendu, et sur l'affiche à 300 et à 60 ppp.

**Ne pas imprimer avant que https://stsv.ca/cegep réponde en production.**
La page n'existe que sur la branche tant qu'elle n'est pas fusionnée dans
`main`.

Rien ne doit recouvrir le code (ni logo, ni texte) : le liseré lime reste à
l'extérieur de la zone blanche.
