# Sustain — Propuesta de desarrollo de plataforma

**Documento de trabajo interno.** Base para armar la propuesta al cliente.
Fecha: 29 jul 2026 · Cliente: Martín (Sustain) · Piloto: Montessori School

> Las horas son estimaciones con margen de error. Los bloques marcados ⚠ son los de
> mayor incertidumbre y conviene revisarlos antes de comprometer un número cerrado.

---

## 1. De dónde viene esto

El cliente entregó un brief de 11 módulos (`drive-files/txt.txt`) y un audio del 22/07
(`drive-files/transcripcion-audio-2026-07-22.md`). El brief se cierra con:

> "No estamos diseñando un dashboard. Estamos diseñando el sistema operativo de la
> sostenibilidad verificable."

El audio agrega: el diseño actual no se toca, no hay apuro, hay una ventana de **3 meses**
atada al piloto con la escuela, y el producto tiene que ser **escalable a cualquier empresa,
escuela o municipio**.

**Lectura:** el brief describe una plataforma SaaS multi-tenant, no un sitio. Esta propuesta
separa lo ya entregado (prototipo visual) de lo que haría falta para que sea un sistema real.

---

## 2. Lo ya entregado

| Ítem | Estado | Horas aprox. (valor de mercado) |
|---|---|---:|
| Sitio institucional + demos por tipo de cliente | Entregado | — (facturado: USD 250) |
| **Fase 0** — modelo de datos: entidad Acción con 10 pasos de trazabilidad, taxonomía de 13 categorías, configuración por tipo de nodo | Entregado | 12–16 |
| **Fase 1** — navegación real: rutas anidadas, shell único configurable, 11 módulos navegables, andamios con datos reales | Entregado | 18–24 |

**Sugerencia comercial:** que figure en la propuesta como *"Fase 0 — ya entregada"* con su
valor real y bonificada al 100%. No para recobrarlo, sino para que el número de las fases
siguientes tenga contexto.

**Importante:** este trabajo no se pierde en ningún escenario. El modelo de la Acción y el
shell configurable son lo primero que se construye tanto si el proyecto sigue como demo
como si se convierte en plataforma.

---

## 3. Alcance completo según brief

| Bloque | Detalle | Horas |
|---|---|---:|
| **Frontend** | 11 módulos con datos reales, estados (carga / vacío / error), responsive, componentes transversales (tabla, primitivas de gráfico) | 400–430 |
| **Backend** ⚠ | Arquitectura, autenticación, multi-tenant, API, motor de baseline y cálculo SES, pipeline de ingesta con OCR, storage, generación de reportes, anclaje blockchain + IPFS | 440–480 |
| **Integraciones** | Framework OAuth genérico + 14 conectores viables | 290–330 |
| **Panel de administrador** | Alta de empresas/nodos, gestión de usuarios, roles y permisos | 55–65 |
| **QA, accesibilidad, performance** | ~15% | 180–190 |
| **Gestión, reuniones, iteración** | ~10% | 120–130 |
| | **Total** | **1.500–1.600 h** |

### Referencia de precio

| Tarifa | Rango |
|---:|---:|
| USD 35/h | USD 52.500 – 56.000 |
| USD 40/h | USD 60.000 – 64.000 |
| USD 45/h | USD 67.500 – 72.000 |

⚠ **Dónde puedo estar quedándome corto:** el motor de baseline/SES y el pipeline MRV no son
CRUD — son lógica de negocio con implicancias de certificación. Si hay un estándar contra el
cual certificar (y el brief menciona "MRV Report" y "Validation Report"), ese bloque puede
crecer bastante.

---

## 4. Escenario recomendado: por fases

Cotizar los 1.500 h de una es poco realista y difícil de vender. Propuesta:

### Fase A — Plataforma mínima usable

Lo necesario para que **la escuela use el sistema de verdad**, no una demo.

- Autenticación, multi-tenant, roles (admin / organización / usuario final)
- Panel de administrador: alta de organizaciones y usuarios
- Carga manual de facturas y evidencia (sin OCR)
- Motor de línea base y cálculo de SES
- Mis Acciones + ficha de trazabilidad
- Data Room básico (subida, descarga, hash, permisos)
- Home + Auditoría
- 1 integración real (Google Drive) como prueba de concepto
- Reportes en PDF

**550–650 h → USD 19.000–29.000** según tarifa.

### Fases siguientes

Se cotizan por módulo, cuando haya uso real y sepamos qué se usa de verdad:
OCR e ingesta automática · las 13 integraciones restantes · anclaje en blockchain e IPFS ·
Impact Dashboard completo (13 categorías) · Instituciones (jerarquía y KPIs por unidad) ·
Reportes en Excel/CSV/JSON/API · Environmental Identity

---

## 5. Exclusiones explícitas

Van en la propuesta para evitar malentendidos:

- **No incluye** los costos recurrentes de infraestructura (ver §7)
- **No incluye** desarrollo de smart contract auditado por terceros
- **No incluye** certificación MRV ante un organismo, ni asesoría legal/ambiental
- **No incluye** migración de datos históricos previos al piloto
- **No incluye** apps nativas iOS/Android
- **No incluye** integraciones ERP ni sensores IoT — ver §6

---

## 6. Ítems del brief que no son viables como están

Detectado al analizar el módulo 7. Conviene plantearlo **antes** de cotizar.

| Ítem | Problema |
|---|---|
| **Apple Photos** | No existe API de servidor para terceros. iCloud Photos no lo ofrece. Sólo se puede leer desde un dispositivo del usuario, no desde un backend. |
| **Medidores inteligentes / distribuidoras** | Las distribuidoras argentinas (EDESUR, EDENOR) no publican API de consumo. Es precisamente el motivo por el que hoy se trabaja con PDFs de facturas. Requeriría convenio con la distribuidora. |
| **ERP** | No es una integración: es una familia (SAP, Oracle, Odoo, Tango). No cotizable sin definir cuál. |
| **Sensores IoT** | Idem: depende del hardware y el protocolo. No cotizable sin especificar. |

El brief lista estos ítems bajo **"Ejemplos:"**, así que hay margen para acotar sin
contradecirlo. Son 14 servicios concretos + 4 categorías abiertas.

---

## 7. Costos recurrentes a cargo del cliente

No van dentro del precio de desarrollo:

- Hosting y base de datos
- Storage de archivos — crece con cada factura cargada
- Pinning de IPFS
- Gas de blockchain por anclaje
- API de OCR (se cobra por página procesada)
- **WhatsApp Business API** — requiere aprobación de Meta y cobra por conversación

---

## 8. Supuestos

- El diseño actual se mantiene; no hay rediseño visual.
- Los textos y el contenido los provee el cliente.
- Un solo idioma (español) en Fase A.
- El cliente define y valida la lógica de cálculo del SES y de la línea base.
- Las decisiones de §9 se resuelven antes de arrancar.

---

## 9. Preguntas abiertas — resolver en la meet

Ordenadas por impacto en el presupuesto.

1. **¿Demo o sistema?** ¿La escuela va a usar esto para cargar datos reales, o es para mostrar
   y vender? Es la pregunta que define si hay backend o no. Todo lo demás depende de ésta.
2. **¿Quién carga la información?** Hoy los datos de Montessori están escritos a mano en el
   código. Cada factura nueva la cargamos nosotros. ¿Sigue así, o él necesita cargar solo?
3. **Data Room: ¿archivos reales o de ejemplo?** Con archivos reales hace falta storage, y eso
   es costo mensual.
4. **Integraciones: ¿funcionan o se muestran?** Recomendación: vitrina con todas + una sola
   funcionando (Drive).
5. **Blockchain: ¿está andando?** En los datos reales del piloto las 8 facturas figuran como
   *"Pendiente de anclaje"*; sólo una tiene hash calculado. Si es aspiracional, las pantallas
   deben mostrarlo como pendiente y no inventar hashes — en un producto que vende
   trazabilidad verificable, simular ese dato sería el peor error posible.
6. **"Mantenimiento Sostenible"** aparece en el piloto pero no está entre las 13 categorías del
   brief. ¿Es una categoría más o va dentro de Compras Sostenibles?
