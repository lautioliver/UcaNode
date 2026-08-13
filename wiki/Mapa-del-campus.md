# Mapa del campus

Módulo que ubica las clases del estudiante dentro del Campus Castañares y permite explorar el predio y sus servicios.

## Piezas

| Capa | Ubicación | Rol |
|---|---|---|
| Asset | `public/images/mapa-ucasal-castanares.webp` | Mapa oficial de UCASAL recortado a la zona del predio (2111 × 1123) |
| Diccionario | `src/lib/campus/edificios.ts` | 21 edificios numerados, puntos de servicio y referencias, con coordenadas |
| Componente | `src/components/campus-map.tsx` | Mapa interactivo con overlay de marcadores y ficha del punto elegido |
| Vista | `src/app/campus/page.tsx` + `src/components/campus-workspace.tsx` | Ruta `/campus` con filtros y listado de edificios |
| Widget | `src/components/proxima-clase-card.tsx` | Tarjeta de próxima clase del dashboard con acceso al mapa |
| Horario | `src/lib/horario-utils.ts` | Cálculo de la clase en curso o siguiente en la zona del campus |
| Persistencia | `Horario.edificioId` y `Horario.aula` | Ubicación de cada bloque de cursada, ver [Modelo de datos](Modelo-de-datos.md) |

## Coordenadas

El mapa oficial ya trae los 21 marcadores numerados dibujados sobre la foto aérea. El componente **no** dibuja pines propios: superpone botones transparentes sobre cada marcador existente y solo agrega un anillo animado en el que está seleccionado. Así no se duplica información ni se desalinea nada al cambiar el asset por una versión nueva del mapa.

Cada edificio guarda `x` e `y` como **porcentaje** de la imagen (no píxeles), apuntando al centro de la cabeza del marcador. El overlay usa `left: x%` / `top: y%`, por lo que sigue alineado en cualquier ancho de pantalla y en cualquier nivel de zoom.

```ts
3: {
  id: 3,
  nombre: "Facultad de Ingeniería",
  unidadAcademica: "Ingeniería",
  categoria: "ACADEMICA",
  x: 64.28,
  y: 21.55,
},
```

Los ids 1 a 11 son unidades académicas y 12 a 21 dependencias institucionales, siguiendo la leyenda del mapa oficial.

### Si cambia el mapa oficial

Al reemplazar el asset hay que recalcular las coordenadas: los porcentajes son relativos a esa imagen puntual. El procedimiento usado fue detectar los marcadores blancos por color, tomar el centro de cada cabeza y dividir por el ancho y alto del recorte. `MAPA_CAMPUS.width` / `height` deben coincidir con las dimensiones reales del archivo (hay un test que lo verifica).

## Puntos de servicio y CampuStatus

Además de los edificios, `PUNTOS_CAMPUS` describe servicios (enfermería, confitería, fotocopias, cajeros, gimnasio, librería) y referencias (Biblioteca, Aula Magna, Rectorado, Capilla, Salón Ícaro). Se muestran u ocultan con los filtros de `/campus`.

Cada punto lleva `alias` normalizados. `buscarPuntoPorZona()` cruza el nombre de zona que devuelve CampuStatus con esos alias, y `/campus` pinta un círculo de color con el estado de ocupación sobre el punto que matchee. Si el nombre no coincide con ninguno, o si CampuStatus no responde, la capa simplemente no se dibuja: la vista del mapa nunca depende del servicio externo.

## Próxima clase

`claseDestacada()` devuelve la clase de hoy que está en curso o, si no hay ninguna, la siguiente que arranca. Ignora las que ya terminaron y las de otros días.

El cálculo usa `momentoCampus()`, que resuelve día y hora en `America/Argentina/Buenos_Aires` en lugar de la zona del proceso. Sin eso, un servidor en UTC adelanta tres horas y a la noche llega a cambiar de día.

Si la clase tiene `edificioId`, la tarjeta ofrece el botón **Ver Edificio #N**, que abre el mapa enfocado en ese punto con el aula de la cursada. Si es virtual y tiene link, ofrece entrar a la clase.

## Zoom

El zoom (1x, 1.5x, 2x, 3x) ensancha el contenedor interno dentro de un área con `overflow-auto`, en lugar de aplicar `transform: scale`. El scroll nativo resuelve el paneo —incluido el táctil en mobile— sin sumar una dependencia de pinch-zoom, y los marcadores en porcentaje siguen alineados porque escalan junto con la imagen.

## Atribución

El mapa es material oficial de UCASAL, publicado en [ucasal.edu.ar/mapa-campus](https://www.ucasal.edu.ar/mapa-campus). El componente muestra el crédito con enlace a la fuente.
