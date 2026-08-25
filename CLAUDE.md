# Instrucciones para trabajar en este repositorio

Sitio de la **STSV** (Société de transport de Salaberry-de-Valleyfield), sociedad
de transporte público de Quebec que da servicio a nueve municipios. Está en
producción en **stsv.ca** y lo usa gente real para consultar horarios y reservar
su transporte. No es un proyecto de escaparate: si algo se rompe, alguien se
queda sin saber a qué hora pasa su autobús.

## Puesta en marcha

```bash
npm install
npm run dev                      # http://localhost:4321
npm run build                    # salida en dist/ y .vercel/output/
python3 scripts/qa.py dist/client
```

El QA es obligatorio antes de cada commit. Analiza el sitio construido y revisa
enlaces rotos, PDFs ausentes, coherencia entre los tres idiomas, etiquetas SEO
y accesibilidad. Devuelve código de salida 1 si hay errores. **Cero errores o no
se sube.**

## Cómo está montado

Astro 5 con el adaptador de Vercel. Casi todo es estático; solo los dos
endpoints de formulario se ejecutan en servidor.

```
src/
  data/site.ts        avisos, líneas, tarifas, documentos, contacto
  data/content.ts     texto editorial de las 10 páginas, en FR · EN · ES
  i18n/ui.ts          etiquetas de interfaz, slugs por idioma, helper path()
  components/         Header, Footer, PageHero, FareTable, Form, y una página por componente
  layouts/Base.astro  head, hreflang, canonical, Open Graph, JSON-LD
  pages/              FR en la raíz, EN bajo /en, ES bajo /es
  pages/api/          endpoints de formulario (funciones de Vercel)
  assets/images/      fuentes de imagen; Astro genera WebP responsive al construir
public/
  documents/          21 PDFs
  carte/              mini-sitio del mapa Mapbox, autónomo, fuera del sistema i18n
  brand/, fonts/
scripts/qa.py         control de calidad sobre el sitio construido
```

## Reglas que no se negocian

**Trilingüe siempre.** Cada cambio de contenido toca las tres versiones: FR, EN,
ES. Si añades una cadena en francés y no en las otras dos, has dejado el sitio a
medias. El francés manda: se redacta primero en FR y se adapta, no se traduce
literal.

**Toponimia intacta.** «Salaberry-de-Valleyfield», «Coteau-du-Lac», «Communobus»,
«carte ACCÈS» no se traducen en ningún idioma.

**Claves técnicas en inglés.** Identificadores de avisos, categorías de
documentos, valores de formulario — todo en inglés. El francés y el español solo
aparecen en las etiquetas que ve el usuario. Ejemplo: el `<select>` de asunto del
formulario envía `sales` o `support` en los tres idiomas; solo cambia el texto
visible.

**Comentarios y mensajes de commit en francés.** El cliente es francófono y el
código puede acabar en sus manos. Los comentarios explican *por qué*, no *qué*.

**Nunca inventes datos operativos.** Horarios, números de línea, tarifas, paradas,
teléfonos: si el dato no está en `src/data/`, no existe. Se pregunta, no se
supone. Es una entidad pública y un horario inventado manda a alguien a esperar
un autobús que no viene.

**Nunca prometas fiabilidad absoluta.** Nada de «siempre a tiempo» ni «sin
retrasos».

## Voz de marca

La misión de la STSV es «éliminer le stress des déplacements». Todo lo que se
escribe sirve a eso: que alguien encuentre su horario y se vaya tranquilo.

**Cálido sin ser almibarado.** Se dice lo esencial, no se halaga.
**Claro sin ser simplista.** Vocabulario corriente, nunca infantilizante.
**Inclusivo sin ser paternalista.** El usuario decide; nosotros informamos.
**Local, no genérico.** Topónimos reales, horarios reales, paradas reales.

El tono cambia según el contexto. En servicio cotidiano: práctico y rápido. Ante
una perturbación: transparente y orientado a la solución — primero se nombra el
problema, después se da la alternativa. En campaña: más humano, sin perder
precisión.

**Regla de oro:** si el mensaje no cabe en una frase clara en los tres idiomas,
es demasiado largo.

Fuera: anglicismos innecesarios en francés («on board» → «à bord»), frases
corporativas vacías del tipo «solution multicanale» o «expérience utilisateur de
premier plan», y emojis en cualquier texto del sitio.

## El sitio anterior

El sitio antiguo, alojado en GoHighLevel, está archivado íntegro en
**`eNovoOs/STSV`** — HTML, imágenes y PDFs tal como se servían. Sirve para
comprobar cómo era algo antes de la migración. Es archivo: se consulta, no se
modifica.

## Secretos

Ningún secreto entra en el repositorio. Las URLs de los webhooks viven como
variables de entorno en Vercel:

| Variable | Uso |
|---|---|
| `STSV_WEBHOOK_CONTACT` | formulario «Nous joindre» |
| `STSV_WEBHOOK_NEWSLETTER` | formulario de la infolettre |
| `STSV_WEBHOOK_SECRET` | opcional, cabecera `X-STSV-Signature` |

`.env.example` solo contiene marcadores. El token de Mapbox de `public/carte/`
es público por naturaleza, pero está restringido por dominio en el panel de
Mapbox: si lo cambias, actualiza también esa restricción.

Un cambio de variable en Vercel **exige un redespliegue**; los valores quedan
fijados al deployment.

## Sistema visual

Poppins para todo, JetBrains Mono para datos técnicos — horarios, números de
línea, precios, teléfonos.

```
Azul Royal    #135EEF   principal, CTA, cabeceras
Royal oscuro  #0B3FB4   hover, títulos
Cian          #45C3CF   acento
Verde lima    #BDD100   acento
Gris Air      #F5F9FC   fondos suaves
Cian sobre azul #CFF2F6 obligatorio: #45C3CF sobre #135EEF da 2.57:1 y no pasa WCAG
```

**Cabeceras de página.** `PageHero` impone la forma: `2.6/1` en escritorio,
`2/1` en tableta, `3/2` en móvil. Las fotos originales van de 0.89:1 a 2.59:1,
así que el marco recorta con `object-fit: cover` y nunca al revés. La prop
`focus` (porcentaje desde arriba, 42 por defecto) decide qué parte sobrevive al
recorte — súbela o bájala hasta que las caras queden dentro.

Las páginas sin foto usan la variante de banda de color, con el símbolo de la
marca en filigrana. Misma forma, mismo alto.

## Verificar de verdad

Este repositorio tiene un historial de arreglos visuales que parecían correctos
razonando y no lo eran. Si tocas maquetación, **míralo renderizado** antes de
darlo por bueno: navegador headless, captura, y medir las cajas. Un `1fr` que
parece resolver un centrado puede no hacerlo, porque `1fr` es `minmax(auto, 1fr)`
y ese mínimo deja que una imagen imponga su alto natural.

Para contenido y enlaces basta con `scripts/qa.py`.

## Despliegue

`git push` a `main` y Vercel construye solo. La producción es **stsv.ca**; la URL
`stsv-eight.vercel.app` sigue viva pero cada página declara su canónico en el
dominio real.

Si Vercel no reacciona a un push, suele ser una caída de la integración con
GitHub. Un commit vacío destraba la cola:

```bash
git commit --allow-empty -m "Relance du deploiement" && git push
```

**Cuidado con `git log origin/main..HEAD`** en este repositorio: el ref remoto ha
dado lecturas engañosas. Para saber qué tiene GitHub de verdad:

```bash
git ls-remote origin main | cut -c1-7
```

## A quién preguntar

Cuando falte un dato operativo — un horario, una tarifa, un número de parada, el
teléfono de una línea — la respuesta la tiene la STSV, no el repositorio.

**Pregunta a RevUp CMO** (`media@revupcmo.com`), que es quien lleva la relación
con el cliente y traslada la consulta. **No escribas directamente a la STSV.**
Una entidad pública necesita un único interlocutor, y las respuestas quedan
registradas en un sitio.

Esto vale también para las decisiones de diseño que afecten a lo que ve el
usuario. Un cambio de copy o de imagen en una web institucional se aprueba, no
se improvisa.

## Fuera de alcance

No toques nada de esto sin hablarlo antes:

- **DNS de stsv.ca**, alojado en OVH. La zona lleva once registros de Microsoft
  365 — correo, Teams, registro de dispositivos. Un borrado deja a la STSV sin
  correo. Solo dos registros apuntan a la web.
- **Configuración de Vercel**, dominios, variables de entorno.
- **El workflow de eNovoOs** que recibe los formularios.

## Pendiente

- Horarios en HTML: hoy solo existen dentro de PDFs, invisibles para buscadores
  y asistentes. Bloqueado hasta que la STSV confirme cuál de las dos versiones
  de horarios manda, `_v1` o `_v2`.
- Títulos de página con localidad — diez de once no mencionan el territorio.
- `FAQPage` en más páginas; `/tutoriels` ya tiene cinco preguntas escritas sin
  marcar.
- Fotos propias para tutoriels, carte-des-arrêts e infolettre.
- Las cinco validaciones con la STSV que enumera el `README.md`.
