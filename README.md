markdown

# Checkout Payment — Frontend

Aplicación de checkout de pago con tarjeta de crédito, construida como una SPA con **React + TypeScript + Redux Toolkit + Tailwind CSS**.

## Stack

- **Framework:** React 19 + Vite
- **Lenguaje:** TypeScript
- **Estado global:** Redux Toolkit
- **Estilos:** Tailwind CSS v4
- **Testing:** Jest + React Testing Library

## Flujo de checkout

La aplicación implementa un flujo de compra en 5 pasos, manejado como un wizard sobre una sola pantalla (sin rutas separadas), reflejado en un único
slice de Redux (`checkoutSlice`):

1. **Catálogo de productos** — lista los productos disponibles con su stock.
2. **Modal de datos de pago y entrega** — captura tarjeta, contacto y dirección de envío, con validación en tiempo real (algoritmo de Luhn, detección
   de marca de tarjeta, expiración, formato de campos).
3. **Resumen de pago** — desglose de producto + tarifa base + tarifa de envío, sobre un backdrop.
4. **Procesamiento** — pantalla de carga mientras se confirma el pago con el backend.
5. **Resultado** — confirmación de éxito o fallo; al volver, se refresca el catálogo con el stock actualizado.

## Arquitectura del estado

src/ app/ store.ts → configuración de Redux + persistencia persistence.ts → guarda/recupera el estado en localStorage hooks.ts → hooks tipados de
Redux features/checkout/ checkoutSlice.ts → estado del flujo (paso actual, producto, datos de cliente/entrega, resultado) pages/ ProductPage.tsx →
catálogo de productos components/ CardModal.tsx → formulario de pago y entrega PaymentSummary.tsx → resumen y confirmación de pago
ProcessingScreen.tsx → estado de carga ResultScreen.tsx → resultado final services/ api.ts → cliente HTTP hacia el backend utils/ cardValidation.ts →
validación de tarjeta (Luhn, marca, expiración)

### Persistencia y resiliencia

El estado del checkout se persiste en `localStorage`, de forma que el flujo sobrevive a un refresh de página en cualquier paso.

**Excepción de seguridad importante:** los datos de la tarjeta (`cardData`) **nunca se persisten** en `localStorage`. Viven únicamente en memoria
durante la sesión de Redux, y se descartan automáticamente en cuanto el pago se resuelve (aprobado o rechazado). Si el usuario recarga la página
estando en el paso de resumen o procesamiento, se le regresa al formulario de tarjeta para volver a ingresar los datos — evita exponer información
sensible de pago en almacenamiento del navegador.

## Instalación

```bash
pnpm install
```



## Correr el proyecto

```bash
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Testing

```bash
pnpm test           # correr todos los tests
pnpm run test:cov   # correr tests con reporte de cobertura
```

### Resultados de cobertura

Test Suites: 7 passed, 7 total Tests: 39 passed, 39 total

File % Stmts % Branch % Funcs % Lines All files 90.1 88.13 86.53 91.81 app 100 100 100 100 components 97.82 93.24 96.15 98.85 CardModal.tsx 96.61
95.91 93.75 98.21 PaymentSummary.tsx 100 90 100 100 ProcessingScreen.tsx 100 100 100 100 ResultScreen.tsx 100 86.66 100 100 features/checkout 100 100
100 100 pages 100 100 100 100 services 6.66 25 0 7.14 utils 94.44 88.46 100 100

> Cobertura total: **90.1%** de statements (supera el umbral requerido del 80%).
>
> `services/api.ts` se mockea en todos los tests de componentes para aislar la lógica de UI de las llamadas de red reales; su cobertura baja es
> esperada, ya que es una capa delgada sin lógica propia (validado con pruebas manuales end-to-end contra el backend real).

Se testearon con React Testing Library, simulando interacción real de usuario (`@testing-library/user-event`):

- **`checkoutSlice`** — todas las transiciones de estado del wizard.
- **`ProductPage`** — carga de productos, manejo de error, selección de producto, stock agotado.
- **`CardModal`** — detección de marca de tarjeta en vivo, validación de todos los campos, envío exitoso.
- **`PaymentSummary`** — cálculo de totales, flujo de pago exitoso y fallido.
- **`ProcessingScreen`** / **`ResultScreen`** — estados de éxito, rechazo y error.
- **`cardValidation`** — algoritmo de Luhn, detección de marca, validación de expiración y CVC.

## Validación de tarjeta

- **Número de tarjeta:** validado con el algoritmo de Luhn.
- **Marca:** detectada por rango de BIN (Visa: prefijo `4`; Mastercard: rangos `51–55` y `2221–2720`).
- **Expiración:** rechaza fechas ya vencidas.
- **CVC:** 3 o 4 dígitos.

## Diseño

- **Mobile-first**, responsive en todos los breakpoints.
- Tipografía monoespaciada (`JetBrains Mono`) para cifras (precios, referencias de transacción), reforzando la sensación de comprobante de pago.
- Overlays con `backdrop-blur` para el modal de pago y las pantallas de resumen/resultado.
