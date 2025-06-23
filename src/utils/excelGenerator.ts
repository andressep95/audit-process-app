import ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// *** IMPORTAR DESDE EL NUEVO ARCHIVO DE TIPOS DE RESPUESTA ***
import type {
  AuditReadHeaders,
  AuditReadModule,
  AuditReadTask,
  AuditReadSubTask,
  AuditReadObservation,
} from '@/models/audit-read-models'

function columnLetterToNumber(letter: string): number {
  let column = 0
  let length = letter.length
  for (let i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1)
  }
  return column
}

function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) {
    return ''
  }
  const date = dayjs(dateString)
  return date.isValid() ? date.format('DD/MM/YYYY') : ''
}

export async function generateAuditsExcel(audits: AuditReadHeaders[]) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Sistema de Auditorías'
  workbook.lastModifiedBy = 'Sistema de Auditorías'
  workbook.created = new Date()
  workbook.modified = new Date()
  workbook.properties.date1904 = true

  // --- Pestaña de Resumen General ---
  const summarySheet = workbook.addWorksheet('Resumen Auditorías')
  summarySheet.columns = [
    { header: 'País', key: 'country', width: 15 },
    { header: 'Tienda', key: 'storeName', width: 25 },
    { header: 'Gerente de Tienda', key: 'storeManager', width: 25 },
    { header: 'Auditor', key: 'auditorName', width: 25 },
    { header: 'Fecha Auditoría', key: 'auditDate', width: 15 },
    { header: '% Cumplimiento General', key: 'compliancePercentage', width: 20 },
    { header: 'Calificación General', key: 'overallRating', width: 20 },
    { header: 'Observaciones Generales', key: 'observations', width: 40 },
  ]

  // Estilos para la cabecera de la tabla de resumen
  summarySheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }, // Un azul claro
    }
    cell.font = {
      bold: true,
      color: { argb: 'FF000000' }, // Negro
      size: 11,
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
  })

  audits.forEach((audit) => {
    const row = summarySheet.addRow({
      auditId: audit.country + '-' + audit.storeName + '-' + formatDate(audit.auditDate), // Genera un ID simple
      country: audit.country,
      storeName: audit.storeName,
      storeManager: audit.storeManager,
      auditorName: audit.auditorName,
      auditDate: formatDate(audit.auditDate),
      isCompleted: audit.isCompleted ? 'Sí' : 'No',
      compliancePercentage: audit.compliancePercentage + '%',
      overallRating: audit.overallRating,
      observations: audit.observations || 'N/A',
    })

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    })
  })

  summarySheet.eachRow((row) => {
    row.height = 20 // Altura mínima

    row.eachCell((cell) => {
      if (cell.alignment?.wrapText && cell.value) {
        let columnWidth = 10

        if (typeof cell.col === 'object' && cell.col !== null && 'width' in cell.col) {
          columnWidth = (cell.col as ExcelJS.Column).width || 10
        }

        const textLength = String(cell.value).length
        const charsPerLine = Math.floor(columnWidth / 0.7)
        const lines = Math.ceil(textLength / charsPerLine)
        row.height = Math.min(60, Math.max(20, lines * 15)) // Limitar altura máxima de fila
      }
    })
  })

  // --- Pestañas Individuales por Auditoría ---
  for (const audit of audits) {
    // Generar un nombre de hoja válido y único
    const sheetName = `${audit.storeName.substring(0, 15)}-${formatDate(audit.auditDate)}`
    const sheet = workbook.addWorksheet(sheetName.replace(/[/\?*\[\]]/g, ''))

    let currentRow = 1
    sheet.getCell(`A${currentRow}`).value = 'País:'
    sheet.getCell(`B${currentRow}`).value = audit.country
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Tienda:'
    sheet.getCell(`B${currentRow}`).value = audit.storeName
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Gerente de Tienda:'
    sheet.getCell(`B${currentRow}`).value = audit.storeManager
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Auditor:'
    sheet.getCell(`B${currentRow}`).value = audit.auditorName
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Fecha de Auditoría:'
    sheet.getCell(`B${currentRow}`).value = formatDate(audit.auditDate)
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Estado Completado:'
    sheet.getCell(`B${currentRow}`).value = audit.isCompleted ? 'Sí' : 'No'
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Observaciones Generales:'
    sheet.getCell(`B${currentRow}`).value = audit.observations || 'N/A'
    sheet.getCell(`B${currentRow}`).alignment = { wrapText: true, vertical: 'top' }
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Porcentaje de Cumplimiento General:'
    sheet.getCell(`B${currentRow}`).value = audit.compliancePercentage + '%'
    currentRow++
    sheet.getCell(`A${currentRow}`).value = 'Calificación General:'
    sheet.getCell(`B${currentRow}`).value = audit.overallRating
    currentRow += 2 // Espacio antes de la sección de detalles de módulos/tareas

    // Definición de columnas para la tabla de detalles (UNA SOLA VEZ por hoja)
    const detailColumns = [
      { header: 'Tarea', key: 'taskDescription', width: 30 },
      { header: 'Código', key: 'combinedCode', width: 15 },
      { header: 'Requerimiento', key: 'subtaskDescription', width: 40 },
      { header: 'Riesgo', key: 'riskLevel', width: 10 },
      { header: 'Muestras', key: 'auditedSamples', width: 10 },
      { header: 'Errores', key: 'errorsFound', width: 10 },
      { header: '% Error', key: 'errorPercentage', width: 10 },
      { header: '% Cumplimiento', key: 'taskCompliance', width: 15 },
      { header: 'Calificación', key: 'taskRating', width: 12 },
      { header: 'Observaciones', key: 'observationText', width: 30 },
    ]
    // Asignar ancho de columnas manualmente SIN generar encabezado automático
    detailColumns.forEach((col, index) => {
      const columnLetter = String.fromCharCode('A'.charCodeAt(0) + index)
      const column = sheet.getColumn(columnLetter)
      column.width = col.width
    })

    // Llenar datos de módulos, tareas, subtareas y observaciones
    audit.auditModules?.forEach((module: AuditReadModule) => {
      // Obtener la última letra de columna para fusionar
      const lastColumnLetter = String.fromCharCode('A'.charCodeAt(0) + detailColumns.length - 1)

      // Agregar fila para el módulo (fusionando celdas para el título del módulo)
      sheet.mergeCells(`A${currentRow}:${lastColumnLetter}${currentRow}`)
      const moduleCell = sheet.getCell(`A${currentRow}`)
      moduleCell.value = `Módulo: ${module.moduleName} - Cumplimiento: ${module.compliancePercentage}% - Calificación: ${module.overallRating}`

      // Aplicar estilo a la fila del módulo (negrita y un color de fondo diferente)
      moduleCell.font = { bold: true, size: 11 }
      moduleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' }, // Un gris claro
      }
      moduleCell.alignment = { vertical: 'middle', horizontal: 'center' }
      moduleCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      currentRow++ // Mover a la siguiente fila después del título del módulo

      // Aplicar estilos a la cabecera de la tabla de detalles (para este módulo)
      // Esta es la fila de encabezados que SÍ quieres que aparezca por cada módulo.
      const headerRow = sheet.addRow(detailColumns.map((col) => col.header))
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9E1F2' },
        }
        cell.font = {
          bold: true,
          color: { argb: 'FF000000' },
          size: 10,
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      })
      currentRow++ // Incrementar después de añadir la fila de encabezados

      for (const task of module.auditTasks) {
        if (task.auditSubtasks.length === 0) {
          // Modificado para pasar un array de valores
          const row = sheet.addRow([
            task.procedureDescription, // Tarea
            task.taskCode, // Código
            'N/A', // Requerimiento
            'N/A', // Riesgo
            'N/A', // Muestras
            'N/A', // Errores
            'N/A', // % Error
            task.compliancePercentage + '%', // % Cumplimiento (de la tarea)
            task.taskRating, // Calificación (de la tarea)
            'N/A', // % Cumplimiento Req.
            '', // Observaciones
          ])
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            }
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
          })
          currentRow++
        } else {
          for (const subtask of task.auditSubtasks) {
            // Modificado para pasar un array de valores
            const row = sheet.addRow([
              task.procedureDescription, // Tarea
              task.taskCode + '.' + subtask.requerimentCode, // Código
              subtask.procedureDescription, // Requerimiento
              subtask.riskLevel, // Riesgo
              subtask.auditedSamples, // Muestras
              subtask.errorsFound, // Errores
              subtask.errorPercentage + '%', // % Error
              subtask.compliancePercentage + '%', // % Cumplimiento (de la tarea)
              task.taskRating, // Calificación (de la tarea)              ,
              subtask.auditObservations?.map((obs) => obs.observationText).join('; ') || '', // Observaciones
            ])

            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            })
            currentRow++
          }
        }
      }
      currentRow++ // Añadir una fila vacía para separar visualmente los módulos
    })

    // Ajustar altura de fila y limitar la altura máxima para esta hoja
    sheet.eachRow((row) => {
      row.height = 20 // Altura mínima
      row.eachCell((cell) => {
        if (cell.alignment?.wrapText && cell.value) {
          let columnWidth = 10
          if (typeof cell.col === 'object' && cell.col !== null && 'width' in cell.col) {
            columnWidth = (cell.col as ExcelJS.Column).width || 10
          }
          const textLength = String(cell.value).length
          const charsPerLine = Math.floor(columnWidth / 0.7)
          const lines = Math.ceil(textLength / charsPerLine)
          row.height = Math.max(20, lines * 15) // Limitar la altura máxima a 60
        }
      })
    })
  }

  // Guardar y descargar el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Auditorias_Completas_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`
  a.click()
  window.URL.revokeObjectURL(url)
}
