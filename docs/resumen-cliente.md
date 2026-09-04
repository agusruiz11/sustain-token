# Sustain — Estado del dashboard

*Actualizado: 24 ago 2026. Reemplaza la versión del 4 de agosto, que atribuía las
8 facturas EDESUR a Montessori.*

## Qué se hizo

Partimos de tres pantallas de demo y las convertimos en **un sistema de 11 módulos
navegables**, manteniendo el diseño que ya tenías. No se tocó la estética: se agregó
estructura.

Los 11 módulos: Home · Mis Acciones · Data Room · Timeline · Impact Dashboard · Reportes ·
Auditoría · Instituciones · Environmental Identity · Integraciones · Configuración.

**El centro es la trazabilidad.** Cualquier acción se puede abrir y ver su cadena completa:
Factura → Consumo → Línea base → Resultado → SES → MRV → Hash → CID → Blockchain → Reportes.
Es lo que separa al producto de un dashboard de métricas.

**Y está preparado para escalar.** El mismo sistema sirve para una empresa, una escuela, un
municipio, una universidad o una ONG sin duplicar nada: cambia la configuración, no el código.

## Dos dashboards, dos tipos de dato

Esta distinción es la corrección más importante respecto de la versión anterior de este
documento, y atraviesa todo el producto.

**El nodo de Martín** (`/demo/usuario`) tiene **13 acciones con paquete**: las 8 facturas
EDESUR y los 5 viajes en bici. Las 8 facturas son de él y de familiares, cargadas para
construir y probar el flujo — no son consumos de Montessori. Van marcadas como fixture de
demostración en pantalla y en cualquier exportación. Los 5 viajes sí son dato productivo del
nodo, con evidencia y hash verificable. El nodo declara 14 acciones: la que falta es una de
recuperación de plástico cuyo paquete todavía no llegó, y la pantalla lo dice en lugar de
mostrar un total que no cierra.

**Montessori** (`/demo/institucion/montessori`) entra al piloto con **histórico institucional
documentado**, no con acciones verificadas por Sustain. 168 mediciones, 13 hitos, 24
documentos, 22 partners. Ese histórico sirve para contexto, indicadores, Data Room, Timeline y
auditoría — **no genera SES, MRV ni anclaje**. Una acción figura como Sustain Verified sólo
cuando pasó por el pipeline, y hoy no hay ninguna.

Por eso el dashboard institucional aparece con cero acciones verificadas. No es un dato
faltante: es el estado real de la escuela al entrar.

## En qué situación está

Es una **demo navegable completa**. Corre en el navegador sin servidor: los datos viajan
dentro del propio sitio.

**Lo que funciona de verdad, no simulado:**

- La verificación de integridad. El navegador calcula el SHA-256 de cada archivo del Data Room
  en vivo — no es un hash de adorno.
- La descarga de reportes en CSV y JSON, armados con los datos reales del nodo, con
  procedencia y estado de verificación en cada fila.
- Toda la navegación, en escritorio y en celular.

**Lo que todavía no hace:**

- No hay login ni usuarios: nadie inicia sesión.
- La carga de facturas nuevas la hacemos nosotros; no hay pantalla de carga.
- Las integraciones son un catálogo con su estado, no conectores funcionando.

## Cómo se muestra lo que falta

**Donde el piloto no tiene un dato, la pantalla lo dice.** No completamos con estimaciones.
En un producto que vende trazabilidad verificable, mostrar un dato inventado sería el peor
error posible — y se nota cuando alguien lo audita.

Cada registro se muestra en uno de estos estados:

| Estado | Qué significa |
|---|---|
| **Sustain Verified** | Pasó por el pipeline: tiene MRV, SES y su cadena de trazabilidad. |
| **Histórico documentado** | Está respaldado por el expediente institucional, pero es anterior a Sustain. No genera SES ni anclaje. |
| **Pendiente de confirmación** | Existe y está documentado, pero falta que la institución precise qué se midió, cómo, en qué unidad o período. |
| **Fuera de alcance** | Queda explícitamente afuera del piloto. *Pendiente de definir de dónde sale este campo.* |

Hoy son **14 los registros en Pendiente de confirmación** — 12 de gas y 2 de energía
eléctrica inyectada. La lista completa, con qué falta confirmar en cada uno, está en
`docs/montessori-registros-pendientes-2026-08-24.md`, lista para enviarse a la escuela.

Sobre el anclaje: en el nodo de Martín, los 5 viajes tienen hash real de evidencia y siguen
sin CID ni transacción, porque así vienen en el paquete. Los 8 paquetes de energía con CID e
IPFS que Martín confirmó el 24 de agosto **todavía no llegaron a nuestra carpeta**; hasta que
lleguen, esas acciones se muestran como pendientes.

## Cómo seguiríamos

Hay dos caminos y conviene elegir uno antes de avanzar:

**A · Dejarlo como demo.** Ya está listo para mostrar y para cerrar la escuela. No requiere
más trabajo.

**B · Convertirlo en el sistema que la escuela usa.** Implica login, usuarios y permisos, base
de datos, y una pantalla para que cargues vos las facturas. Es un proyecto aparte, con su
propio presupuesto y plazo. La buena noticia: lo construido está pensado para eso, así que no
se tira nada.

## Preguntas abiertas

1. **Los 8 DASHBOARD_SYNC de energía.** Son el bloqueo principal: sin ellos no podemos mostrar
   CID ni transacción de las acciones de energía.

2. **La carpeta fuente del nodo** (RECYCLING, MOBILITY, CLEANUP, COMPOST) y el paquete de
   Botella de Amor. Sin archivo fuente no incorporamos la acción.

3. **"Fuera de alcance".** El paquete canónico no trae ningún campo que lo declare. ¿De dónde
   debería salir?

4. **"Mantenimiento Sostenible"** aparece en el piloto pero no está entre las 13 categorías del
   brief. ¿Es una categoría más, o va dentro de Compras Sostenibles?

5. **Indicadores por área.** El brief pide KPIs por sede y departamento, pero la medición viene
   de la factura de la distribuidora, que cubre todo el edificio con un solo medidor. Para
   desagregar hace falta submedición por sector o una regla de reparto acordada con la escuela
   (por superficie, por matrícula, por horas de uso). ¿Cómo lo encaramos?

6. **Dos facturas sin puntaje.** Las de diciembre 2025 y enero 2026 no tienen SES cargado.

7. **Estructura de la escuela.** Cargamos una de ejemplo (sede, niveles, cursos). ¿Nos pasás la
   real con sus responsables?

8. **Integraciones.** De las 18 del listado, proponemos dejar Google Drive andando de verdad y
   el resto como catálogo. Dos no son viables tal como están planteadas: Apple Photos no ofrece
   forma de leer desde un servidor, y las distribuidoras no publican datos de consumo — es
   justamente por eso que hoy se trabaja con PDFs. ¿Te parece bien ese recorte?
