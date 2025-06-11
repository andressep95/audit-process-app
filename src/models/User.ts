// src/types/User.ts

//fetch users
export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  enabled: boolean
  roles?: string[]
}

//save/edit users
export interface UserInput {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  enabled: boolean
  roles: string[]
  // otros campos requeridos
}
