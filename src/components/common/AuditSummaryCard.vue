<template>
  <div v-if="auditData" class="px-6 py-2">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 2 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold tracking-tight text-gray-800">
            {{ auditData.storeName || 'Proceso de Auditoría' }}
          </h2>
          <span
            class="px-1 py-0.5 border border-gray-200 text-gray-600 bg-white shadow-sm rounded text-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 mr-1 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ auditData.isCompleted ? 'Completada' : 'En progreso' }}
          </span>
        </div>
        <p class="text-gray-500 text-sm">
          Auditoría en curso • {{ formatDate(auditData.auditDate) }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-gray-800">
          <svg
            v-if="auditData.isCompleted"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-semibold text-sm">{{
            auditData.isCompleted ? 'Completada' : 'En progreso'
          }}</span>
        </div>
        <div v-if="showActionsSlot" class="flex items-center gap-2">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-2">
        <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">País</p>
          <p class="font-medium text-gray-800 text-sm">
            {{ auditData.country || 'No especificado' }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">Jefe de Tienda</p>
          <p class="font-medium text-gray-800 text-sm">
            {{ auditData.storeManager || 'No especificado' }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">Auditor</p>
          <p class="font-medium text-gray-800 text-sm">
            {{ auditData.auditorName || 'No especificado' }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">Fecha</p>
          <p class="font-medium text-gray-800 text-sm">
            {{ formatDate(auditData.auditDate) }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-2">
        <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zm-4 0V9a2 2 0 00-2-2H3c-1.105 0-2 .895-2 2v10c0 1.105 1.79 2 4 2s4-.895 4-2z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">
            Cumplimiento General
          </p>
          <p class="font-medium text-gray-800 text-sm">
            {{ auditData.compliancePercentage.toFixed(2) }}%
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">
            Calificación General
          </p>
          <p
            :class="getRatingClass(auditData.overallRating)"
            class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full"
          >
            {{ auditData.overallRating || 'N/A' }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-start gap-2">
        <div class="p-1 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5 leading-tight">
            Observaciones
          </p>
          <p class="font-medium text-gray-800 text-sm">
            {{ auditData.observations || 'No hay observaciones registradas' }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center text-gray-500 py-10">Cargando datos de auditoría...</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { AuditHeaders } from '@/models/models'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')

const props = defineProps<{
  auditData: AuditHeaders | null
  showActionsSlot?: boolean
}>()

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = dayjs(dateString, 'DD/MM/YYYY')

  if (!date.isValid()) {
    console.warn('Fecha recibida en formato inesperado o inválido:', dateString)
    return 'Fecha inválida'
  }
  return date.format('DD/MM/YYYY')
}

const getRatingClass = (rating: string) => {
  switch (rating) {
    case 'EFECTIVA':
      return 'text-green-700 bg-green-100 border-green-200'
    case 'OPORTUNIDAD DE MEJORA':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'INEFECTIVA':
      return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'DEFICIENTE':
      return 'text-red-700 bg-red-100 border-red-200'
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}
</script>
