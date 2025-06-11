<template>
  <div>
    <AuditModuleForm
      v-if="mostrarFormulario"
      :modulo="modulo"
      @guardado="onFormularioGuardado"
      @cerrar="onFormularioCerrado"
    />
    <div v-else class="p-6">
      <h2 class="text-xl font-bold mb-4">Auditoría en curso</h2>
      <div
        @click="mostrarFormulario = true"
        class="bg-white shadow rounded p-4 space-y-2 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      >
        <p><strong>Tienda:</strong> {{ modulo.tienda }}</p>
        <p><strong>Jefe de Tienda:</strong> {{ modulo.jefeTienda }}</p>
        <p><strong>Auditor:</strong> {{ modulo.auditor }}</p>
        <p><strong>Fecha de Auditoría:</strong> {{ modulo.fechaAuditoria }}</p>
        <p><strong>Estado:</strong> {{ modulo.estado }}</p>
        <p><strong>Observaciones:</strong> {{ modulo.observacionesGenerales }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuditModuleForm from '@/components/forms/AuditModuleForm.vue'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { decodeJWT } from '@/utils/jwt'

const mostrarFormulario = ref(true)

const modulo = ref({
  tienda: '',
  jefeTienda: '',
  auditor: '',
  fechaAuditoria: dayjs().format('DD/MM/YYYY'),
  estado: 'incompleta',
  observacionesGenerales: '',
})

// Cargar datos desde localStorage
const cargarDesdeLocalStorage = () => {
  const hoy = dayjs().format('DD/MM/YYYY')
  const hoyISO = dayjs().format('YYYY-MM-DD')
  const draft = localStorage.getItem('auditDraft')

  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      const [day, month, year] = parsed.fechaAuditoria.split('/')
      const draftISODate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

      if (draftISODate === hoyISO) {
        modulo.value = parsed
        mostrarFormulario.value = false
        return
      } else {
        localStorage.removeItem('auditDraft')
      }
    } catch (e) {
      console.error('Error parsing draft:', e)
      localStorage.removeItem('auditDraft')
    }
  }

  iniciarNuevoFormulario()
}

const iniciarNuevoFormulario = () => {
  const token = localStorage.getItem('access_token')
  let auditor = ''

  if (token) {
    const decoded = decodeJWT(token)
    auditor = decoded.preferred_username || decoded.name || 'Desconocido'
  }

  modulo.value = {
    tienda: '',
    jefeTienda: '',
    auditor,
    fechaAuditoria: dayjs().format('DD/MM/YYYY'),
    estado: 'incompleta',
    observacionesGenerales: '',
  }
  mostrarFormulario.value = true
}

const onFormularioGuardado = () => {
  // Cuando se guarda definitivamente, limpiamos el draft
  localStorage.removeItem('auditDraft')
  mostrarFormulario.value = false
}

const onFormularioCerrado = () => {
  // Al cerrar sin guardar, mantenemos los datos en localStorage
  mostrarFormulario.value = false
}

onMounted(cargarDesdeLocalStorage)
</script>
