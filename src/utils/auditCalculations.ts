// src/utils/auditCalculations.ts
import type { AuditModules, Task, AuditSubTask, AuditHeaders } from '@/models/models'

// Función para calcular el cumplimiento de un módulo individual
export function calculateModuleCompliance(module: AuditModules): AuditModules {
  let totalTasksComplianceSum = 0
  let completedTasksCount = 0

  module.tasks.forEach((task) => {
    let totalSamplesTask = 0
    let totalErrorsTask = 0
    let completedSubtasksInTask = 0

    task.subtasks.forEach((subtask) => {
      if (subtask.auditedSamples < 0) subtask.auditedSamples = 0
      if (subtask.errorsFound < 0) subtask.errorsFound = 0
      if (subtask.errorsFound > subtask.auditedSamples) subtask.errorsFound = subtask.auditedSamples

      const isActuallyAudited = subtask.auditedSamples >= 1

      if (isActuallyAudited) {
        subtask.errorPercentage = Math.round((subtask.errorsFound / subtask.auditedSamples) * 100)
        subtask.compliancePercentage = Math.round(100 - subtask.errorPercentage)
        subtask.isCompleted = true
      } else {
        subtask.errorPercentage = 0
        subtask.compliancePercentage = 0
        subtask.isCompleted = false
      }

      if (subtask.isCompleted) {
        completedSubtasksInTask++
      }

      totalSamplesTask += subtask.auditedSamples
      totalErrorsTask += subtask.errorsFound
    })

    if (totalSamplesTask > 0) {
      task.compliancePercentage = Math.round(100 - (totalErrorsTask / totalSamplesTask) * 100)
    } else if (task.subtasks.length > 0 && completedSubtasksInTask === 0) {
      task.compliancePercentage = 0
    } else {
      const completedSubtasksComplianceSum = task.subtasks
        .filter((st) => st.isCompleted)
        .reduce((sum, st) => sum + st.compliancePercentage, 0)

      if (completedSubtasksInTask > 0) {
        task.compliancePercentage = Math.round(
          completedSubtasksComplianceSum / completedSubtasksInTask,
        )
      } else {
        task.compliancePercentage = 0
      }
    }

    if (task.compliancePercentage >= 90) {
      task.taskRating = 'EFECTIVA'
    } else if (task.compliancePercentage >= 80 && task.compliancePercentage < 90) {
      task.taskRating = 'OPORTUNIDAD DE MEJORA'
    } else if (task.compliancePercentage >= 70 && task.compliancePercentage < 80) {
      task.taskRating = 'INEFECTIVA'
    } else {
      task.taskRating = 'DEFICIENTE'
    }

    task.isCompleted = task.subtasks.length > 0 && completedSubtasksInTask === task.subtasks.length

    if (task.isCompleted) {
      completedTasksCount++
    }
    totalTasksComplianceSum += task.compliancePercentage
  })

  if (module.tasks.length > 0) {
    module.compliancePercentage = Math.round(totalTasksComplianceSum / module.tasks.length)
  } else {
    module.compliancePercentage = 100
  }

  if (module.compliancePercentage >= 90) {
    module.overallRating = 'EFECTIVA'
  } else if (module.compliancePercentage >= 80 && module.compliancePercentage < 90) {
    module.overallRating = 'OPORTUNIDAD DE MEJORA'
  } else if (module.compliancePercentage >= 70 && module.compliancePercentage < 80) {
    module.overallRating = 'INEFECTIVA'
  } else {
    module.overallRating = 'DEFICIENTE'
  }

  module.isCompleted = module.tasks.length > 0 && completedTasksCount === module.tasks.length

  return module
}

// Nueva función para calcular el cumplimiento y la calificación total de la auditoría
export function calculateAuditTotalCompliance(auditModules: AuditModules[]): {
  compliancePercentage: number
  overallRating: string
} {
  if (!auditModules || auditModules.length === 0) {
    return { compliancePercentage: 0, overallRating: 'Sin Datos' }
  }

  const completedModules = auditModules.filter((m) => m.isCompleted)
  if (completedModules.length === 0) {
    return { compliancePercentage: 0, overallRating: 'Pendiente' }
  }

  const totalComplianceSum = completedModules.reduce(
    (sum, module) => sum + module.compliancePercentage,
    0,
  )
  const averageCompliance = Math.round(totalComplianceSum / completedModules.length)

  let overallRating = ''
  if (averageCompliance >= 90) {
    overallRating = 'EFECTIVA'
  } else if (averageCompliance >= 80 && averageCompliance < 90) {
    overallRating = 'OPORTUNIDAD DE MEJORA'
  } else if (averageCompliance >= 70 && averageCompliance < 80) {
    overallRating = 'INEFECTIVA'
  } else {
    overallRating = 'DEFICIENTE'
  }

  return { compliancePercentage: averageCompliance, overallRating }
}
