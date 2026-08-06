# Sustain — Estado del dashboard

## Qué se hizo

Partimos de tres pantallas de demo y las convertimos en **un sistema de 11 módulos
navegables**, manteniendo el diseño que ya tenías. No se tocó la estética: se agregó
estructura.

Los 11 módulos: Home · Mis Acciones · Data Room · Timeline · Impact Dashboard · Reportes ·
Auditoría · Instituciones · Environmental Identity · Integraciones · Configuración.

**El centro es la trazabilidad.** Cualquier acción se puede abrir y ver su cadena completa:
Factura → Consumo → Línea base → Resultado → SES → MRV → Hash → CID → Blockchain → Reportes.
Es lo que separa al producto de un dashboard de métricas.

**Está armado sobre los datos reales del piloto**, no sobre relleno: las 8 facturas EDESUR
verificadas de Montessori, con sus consumos, líneas base y puntajes.

**Y está preparado para escalar.** El mismo sistema sirve para una empresa, una escuela, un
municipio, una universidad o una ONG sin duplicar nada: cambia la configuración, no el código.

## En qué situación está

Es una **demo navegable completa**. Corre en el navegador sin servidor: los datos viajan
dentro del propio sitio.

**Lo que funciona de verdad, no simulado:**

- La verificación de integridad. El navegador calcula el SHA-256 de cada archivo del Data Room
  en vivo — no es un hash de adorno.
- La descarga de reportes en CSV y JSON, armados con los datos reales del nodo.
- Toda la navegación, en escritorio y en celular.

**Lo que todavía no hace:**

- No hay login ni usuarios: nadie inicia sesión.
- La carga de facturas nuevas la hacemos nosotros; no hay pantalla de carga.
- Las integraciones son un catálogo con su estado, no conectores funcionando.

**Un criterio que aplicamos en todo:** donde el piloto no tiene un dato, la pantalla lo dice.
No completamos con estimaciones. Por ejemplo, Auditoría muestra que 0 de 8 acciones están
ancladas en blockchain, porque es el estado real. En un producto que vende trazabilidad
verificable, mostrar un dato inventado sería el peor error posible — y se nota cuando alguien
lo audita.

## Cómo seguiríamos

Hay dos caminos y conviene elegir uno antes de avanzar:

**A · Dejarlo como demo.** Ya está listo para mostrar y para cerrar la escuela. No requiere
más trabajo.

**B · Convertirlo en el sistema que la escuela usa.** Implica login, usuarios y permisos, base
de datos, y una pantalla para que cargues vos las facturas. Es un proyecto aparte, con su
propio presupuesto y plazo. La buena noticia: lo construido está pensado para eso, así que no
se tira nada.

## Preguntas para vos

1. **"Mantenimiento Sostenible"** aparece en el piloto pero no está entre las 13 categorías del
   brief. ¿Es una categoría más, o va dentro de Compras Sostenibles?

2. **Indicadores por área.** El brief pide KPIs por sede y departamento, pero la medición viene
   de la factura de la distribuidora, que cubre todo el edificio con un solo medidor. Para
   desagregar hace falta submedición por sector o una regla de reparto acordada con la escuela
   (por superficie, por matrícula, por horas de uso). ¿Cómo lo encaramos?

3. **Dos facturas sin puntaje.** Las de diciembre 2025 y enero 2026 no tienen SES cargado. Si
   el puntaje es la suma histórica, entre las dos tienen que sumar −30. ¿Nos pasás esos valores?

4. **Anclaje en blockchain.** Hoy figura pendiente en las 8 acciones. ¿Está previsto ejecutarlo
   durante el piloto o queda para más adelante?

5. **Estructura de la escuela.** Cargamos una de ejemplo (sede, niveles, cursos). ¿Nos pasás la
   real con sus responsables?

6. **Integraciones.** De las 18 del listado, proponemos dejar Google Drive andando de verdad y
   el resto como catálogo. Dos no son viables tal como están planteadas: Apple Photos no ofrece
   forma de leer desde un servidor, y las distribuidoras no publican datos de consumo — es
   justamente por eso que hoy se trabaja con PDFs. ¿Te parece bien ese recorte?
