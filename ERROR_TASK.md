Claro, aquí tienes todos los errores listados en formato **Markdown**, agrupados por tipo para que los puedas abordar de forma ordenada:

---

## 🧠 **Errores de Tipado (TypeScript)**

### ❌ Tipos `unknown` no compatibles **(ATENDIDO)**

* **Archivo:** `src/components/common/ConfirmationModal.vue`
  **Línea:** 100

  ```ts
  validator: (value) => ['primary', 'danger'].includes(value)
                                                 ~~~~~
  ```

  **Error:** `Argument of type 'unknown' is not assignable to parameter of type 'string'.`
  ✅ **Solución sugerida:** Añadir tipo explícito:

  ```ts
  validator: (value: string) => ['primary', 'danger'].includes(value)
  ```

---

### ❌ Parámetros sin tipo (`implicit any`)

Archivos y líneas con parámetros sin tipo declarado:

* `src/components/common/ConfirmationModal.vue:143`

  ```ts
  const handleKeydown = (event) => { // 🔧 Agrega: (event: KeyboardEvent)
  ```

* `src/components/common/Pagination.vue:140`

  ```ts
  const goToPage = (page) => { // 🔧 Agrega: (page: number)
  ```

* `src/components/layout/AppSidebar.vue:77`

  ```ts
  const createIcon = (pathData) => { // 🔧 Agrega: (pathData: string)
  ```

* `src/router/guards.ts`

  * Línea 4:

    ```ts
    export const authGuard = (to, from, next) => { // 🔧 Usa tipos: RouteLocationNormalized, NavigationGuardNext
    ```
  * Línea 15:

    ```ts
    export const guestGuard = (to, from, next) => {
    ```
  * Línea 26:

    ```ts
    export const adminGuard = (to, from, next) => {
    ```
  * Línea 45:

    ```ts
    export const roleGuard = (allowedRoles) => { // 🔧 allowedRoles: string[]
    ```

    Y dentro:

    ```ts
    return (to, from, next) => { // 🔧 usa tipos para to, from, next
    ```

---

## 🔁 **Errores por nombres de archivo con distinta capitalización (case-sensitive)**

### ❌ `Api.ts` vs `api.ts`

* **Archivos involucrados:**

  * `src/services/AuditService.ts`
  * `src/services/userService.ts`
  * `src/stores/auth.ts`

  ⚠️ **Error:**

  ```ts
  File name differs only in casing: 'Api.ts' vs 'api.ts'
  ```

  ✅ **Solución:** Unifica el nombre **exactamente igual en todas partes** (idealmente `api.ts`, todo en minúsculas), y asegúrate de que **sólo exista un archivo con ese nombre** en el sistema de archivos (Windows es case-insensitive, pero Vite no lo es).

---

## 🧩 **Errores por tipos incompatibles entre objetos y modelos**

### ❌ `auditModules` no tiene `auditTasks`

* **Archivo:** `src/views/audits/AuditView.vue`
  **Línea:** 9

  ```ts
  <AuditSummaryCard :auditData="auditHeaders" />
  ```

* **Archivo:** `src/views/dashboard/DashboardView.vue`
  **Línea:** 181

  ```ts
  :auditData="selectedAuditDetail"
  ```

  ⚠️ **Error:**

  ```ts
  Type is not assignable to 'AuditReadHeaders'
  Property 'auditTasks' is missing...
  ```

  ✅ **Solución:** Asegúrate que en cada objeto `auditModules`, las tareas estén bajo la propiedad `auditTasks` y no `tasks`. Alternativamente, adapta los modelos o haz un mapeo de transformación antes de usar el dato.

---

¿Te gustaría que te prepare una corrección por bloque de código, comenzando por los errores más simples (como los `implicit any`)?
