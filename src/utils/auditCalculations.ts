import type { AuditModules, Task, AuditSubTask } from '@/models/models'

export function calculateModuleCompliance(module: AuditModules): AuditModules {
  let totalModuleCompliance = 0
  let completedTasksCount = 0

  module.tasks.forEach((task) => {
    let totalSamplesTask = 0
    let totalErrorsTask = 0
    let completedSubtasksInTask = 0

    task.subtasks.forEach((subtask) => {
      if (subtask.auditedSamples < 0) subtask.auditedSamples = 0
      if (subtask.errorsFound < 0) subtask.errorsFound = 0
      if (subtask.errorsFound > subtask.auditedSamples) subtask.errorsFound = subtask.auditedSamples

      const isActuallyAudited = subtask.auditedSamples >= 1 // Muestras auditadas >= 1

      if (isActuallyAudited) {
        subtask.errorPercentage = Math.round((subtask.errorsFound / subtask.auditedSamples) * 100)
        subtask.compliancePercentage = Math.round(100 - subtask.errorPercentage)
        subtask.isCompleted = true
      } else {
        subtask.errorPercentage = 0
        subtask.compliancePercentage = 0 // 0% de cumplimiento si no hay muestras auditadas
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
      task.taskRating = 'Excelente'
    } else if (task.compliancePercentage >= 70) {
      task.taskRating = 'Bueno'
    } else if (task.compliancePercentage >= 50) {
      task.taskRating = 'Regular'
    } else {
      task.taskRating = 'Deficiente'
    }

    task.isCompleted = task.subtasks.length > 0 && completedSubtasksInTask === task.subtasks.length

    if (task.isCompleted) {
      completedTasksCount++
    }
    totalModuleCompliance += task.compliancePercentage
  })

  if (module.tasks.length > 0) {
    module.compliancePercentage = Math.round(totalModuleCompliance / module.tasks.length)
  } else {
    module.compliancePercentage = 100 // O si un módulo sin tareas se considera completado por defecto.
  }

  if (module.compliancePercentage >= 90) {
    module.overallRating = 'Sobresaliente'
  } else if (module.compliancePercentage >= 70) {
    module.overallRating = 'Satisfactorio'
  } else if (module.compliancePercentage >= 50) {
    module.overallRating = 'Mejorable'
  } else {
    module.overallRating = 'Crítico'
  }

  module.isCompleted = module.tasks.length > 0 && completedTasksCount === module.tasks.length

  return module
}
