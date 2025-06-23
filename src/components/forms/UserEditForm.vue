<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <Transition name="modal-fade">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" @click.self="closeModal"></div>
          </div>
        </Transition>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Editar Usuario</h3>
                <form @submit.prevent="submitForm" class="space-y-4">
                  <div class="space-y-2">
                    <label for="username" class="text-sm font-medium">Usuario</label>
                    <div class="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <input
                        id="username"
                        v-model="form.username"
                        type="text"
                        disabled
                        placeholder="Nombre de usuario"
                        class="pl-10 h-12 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label for="email" class="text-sm font-medium">Email</label>
                    <div class="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                      >
                        <path
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        ></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        disabled
                        class="pl-10 h-12 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label for="firstName" class="text-sm font-medium">Nombre</label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      placeholder="Nombre"
                      class="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <label for="lastName" class="text-sm font-medium">Apellido</label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      placeholder="Apellido"
                      class="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-black focus:ring-black focus:outline-none"
                      required
                    />
                  </div>

                  <div class="flex flex-wrap gap-6 items-start">
                    <div class="space-y-2 flex-1 min-w-[120px]">
                      <label class="text-sm font-medium flex items-center">
                        <input
                          type="checkbox"
                          v-model="form.enabled"
                          class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mr-2"
                        />
                        Usuario activo
                      </label>
                    </div>

                    <div class="space-y-2 flex-1 min-w-[160px]">
                      <label class="text-sm font-medium block mb-2">Roles</label>
                      <div class="flex flex-wrap gap-x-4 gap-y-2">
                        <label v-for="role in availableRoles" :key="role" class="flex items-center">
                          <input
                            type="radio"
                            v-model="form.roles"
                            :value="role"
                            name="userEditRole"
                            class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded-full mr-2"
                            required
                          />
                          <span class="text-sm">{{ role }}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      :disabled="loading"
                    >
                      <span v-if="!loading">Actualizar Usuario</span>
                      <span v-else class="flex items-center justify-center space-x-2">
                        <div
                          class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                        ></div>
                        <span>Procesando...</span>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  userData: Object, // userData contiene los datos del usuario a editar
})

const emit = defineEmits(['submit', 'close'])

// Formulario reactivo
const form = ref({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  enabled: true,
  roles: '', // <--- Cambiado a un string para v-model de radios
})

const loading = ref(false)
const availableRoles = ['AUDITOR', 'JEFE_TIENDA'] // Asegúrate de que esta lista sea correcta para tus roles

// Observador para la prop userData
watch(
  () => props.userData,
  (newVal) => {
    if (newVal) {
      form.value = {
        username: newVal.username,
        email: newVal.email,
        firstName: newVal.firstName,
        lastName: newVal.lastName,
        enabled: newVal.enabled,
        // CLAVE: Toma el primer rol del array y asignarlo al string 'roles'
        roles: newVal.roles && newVal.roles.length > 0 ? newVal.roles[0] : '',
      }
    } else {
      // Opcional: Reiniciar el formulario si userData se vuelve nulo (al cerrar el modal, por ejemplo)
      form.value = {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        enabled: true,
        roles: '',
      }
    }
  },
  { immediate: true }, // Esto asegura que el watch se ejecute una vez al inicio si userData ya está presente
)

const submitForm = () => {
  loading.value = true
  // CLAVE: Envuelve el rol seleccionado (que es un string) en un array antes de emitirlo
  emit('submit', { ...form.value, roles: [form.value.roles] })
  loading.value = false
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* Estilos igual que en UserCreateForm.vue */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
