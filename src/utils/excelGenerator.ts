// src/utils/excelGenerator.ts
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
    { header: 'Observaciobes', key: 'observations', width: 20 },
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
    summarySheet.addRow({
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
  })

  summarySheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Ignorar la fila de cabecera
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        }
      })
    }
  })

  summarySheet.eachRow((row) => {
    row.height = 20 // Altura mínima

    // Recorrer cada celda de la fila para ajustar la altura si es necesario
    row.eachCell((cell) => {
      // Solo ajustar si la celda tiene 'wrapText' activado y tiene un valor
      if (cell.alignment?.wrapText && cell.value) {
        let columnWidth = 10 // Valor por defecto si no se puede obtener el ancho de la columna

        if (typeof cell.col === 'object' && cell.col !== null && 'width' in cell.col) {
          columnWidth = (cell.col as ExcelJS.Column).width || 10
        }

        const textLength = String(cell.value).length
        const charsPerLine = Math.floor(columnWidth / 0.7) // Aproximación de caracteres por línea
        const lines = Math.ceil(textLength / charsPerLine)
        if (lines > 1) {
          row.height = Math.max(row.height, lines * 15) // Ajusta la altura de la fila
        }
      }
    })
  })

  // --- Pestañas Individuales por Auditoría ---
  for (const audit of audits) {
    // Generar un nombre de hoja válido y único
    const sheetName = `${audit.storeName.substring(0, 15)}-${formatDate(audit.auditDate)}`
    const sheet = workbook.addWorksheet(sheetName.replace(/[/\?*\[\]]/g, '')) // Limpiar caracteres no válidos para nombres de hoja

    // Encabezados de la auditoría
    sheet.mergeCells('A1:B1')
    sheet.getCell('A1').value = 'Detalles de Auditoría'
    sheet.getCell('A1').font = { bold: true, size: 14 }
    sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }

    let currentRow = 3
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
    currentRow += 2 // Espacio antes de la tabla de detalles

    // Definición de columnas para la tabla de detalles
    sheet.columns = [
      { header: 'Módulo', key: 'moduleName', width: 25 },
      { header: '% Cumplimiento Módulo', key: 'moduleCompliance', width: 20 },
      { header: 'Calificación Módulo', key: 'moduleRating', width: 18 },
      { header: 'Código Tarea', key: 'taskCode', width: 15 },
      { header: 'Descripción Tarea', key: 'taskDescription', width: 40 },
      { header: '% Cumplimiento Tarea', key: 'taskCompliance', width: 20 },
      { header: 'Calificación Tarea', key: 'taskRating', width: 18 },
      { header: 'Código Requerimiento', key: 'subtaskCode', width: 20 },
      { header: 'Descripción Requerimiento', key: 'subtaskDescription', width: 50 },
      { header: 'Nivel de Riesgo', key: 'riskLevel', width: 15 },
      { header: 'Muestras Auditadas', key: 'auditedSamples', width: 18 },
      { header: 'Errores Encontrados', key: 'errorsFound', width: 18 },
      { header: '% Error', key: 'errorPercentage', width: 12 },
      { header: '% Cumplimiento Requerimiento', key: 'subtaskCompliance', width: 25 },
      { header: 'Observación', key: 'observationText', width: 40 },
    ]

    // Aplicar estilos a la cabecera de la tabla de detalles
    sheet.getRow(currentRow).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }, // Un azul claro
      }
      cell.font = {
        bold: true,
        color: { argb: 'FF000000' }, // Negro
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
    currentRow++

    // Llenar datos de módulos, tareas, subtareas y observaciones
    audit.auditModules?.forEach((module: AuditReadModule) => {
      module.auditTasks.forEach((task: AuditReadTask) => {
        if (task.auditSubtasks.length === 0) {
          // Si una tarea no tiene subtareas, se añade como una fila con campos vacíos para la subtarea
          const row = sheet.addRow({
            moduleName: module.moduleName,
            moduleCompliance: module.compliancePercentage,
            moduleRating: module.overallRating,
            taskCode: task.taskCode,
            taskDescription: task.procedureDescription,
            taskCompliance: task.compliancePercentage,
            taskRating: task.taskRating,
            subtaskCode: '',
            subtaskDescription: '',
            riskLevel: '',
            auditedSamples: '',
            errorsFound: '',
            errorPercentage: '',
            subtaskCompliance: '',
            subtaskIsCompleted: task.isCompleted ? 'OK' : 'Pendiente',
            observationText: '',
            imageUrl: '',
          })
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            }
          })
          currentRow++
        } else {
          task.auditSubtasks.forEach((subtask: AuditReadSubTask) => {
            const rowData = {
              moduleName: module.moduleName,
              moduleCompliance: module.compliancePercentage,
              moduleRating: module.overallRating,
              taskCode: task.taskCode,
              taskDescription: task.procedureDescription,
              taskCompliance: task.compliancePercentage,
              taskRating: task.taskRating,
              subtaskCode: subtask.requerimentCode,
              subtaskDescription: subtask.procedureDescription,
              riskLevel: subtask.riskLevel,
              auditedSamples: subtask.auditedSamples,
              errorsFound: subtask.errorsFound,
              errorPercentage: subtask.errorPercentage,
              subtaskCompliance: subtask.compliancePercentage,
              subtaskIsCompleted: subtask.isCompleted ? 'OK' : 'Pendiente',
              observationText:
                subtask.auditObservations?.map((obs) => obs.observationText).join('; ') || '',
              imageUrl:
                subtask.auditObservations
                  ?.map((obs) => obs.imageUrl)
                  .filter(Boolean)
                  .join('; ') || '',
            }
            const row = sheet.addRow(rowData)

            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }
              // Ajustar alineación para celdas de texto largo
              const colLetterMatch = cell.address.match(/[A-Z]+/)
              if (colLetterMatch && colLetterMatch[0]) {
                const colNum = columnLetterToNumber(colLetterMatch[0])
                const colDef = sheet.columns[colNum - 1]

                if (
                  colDef &&
                  (colDef.key === 'observationText' ||
                    colDef.key === 'imageUrl' ||
                    colDef.key === 'taskDescription' ||
                    colDef.key === 'subtaskDescription')
                ) {
                  cell.alignment = { wrapText: true, vertical: 'top' }
                } else {
                  cell.alignment = { vertical: 'middle', horizontal: 'center' }
                }
              }
            })
            currentRow++
          })
        }
      })
    })

    // Ajustar altura de fila para las filas con texto envuelto
    sheet.eachRow((row) => {
      row.height = 20 // Altura mínima

      // Recorrer cada celda de la fila para ajustar la altura si es necesario
      row.eachCell((cell) => {
        // Solo ajustar si la celda tiene 'wrapText' activado y tiene un valor
        if (cell.alignment?.wrapText && cell.value) {
          let columnWidth = 10 // Valor por defecto si no se puede obtener el ancho de la columna

          // *** INICIO DE LA CORRECCIÓN ROBUSTA PARA EL ERROR 'width' ***
          // Verificamos explícitamente que cell.col es un objeto y tiene la propiedad 'width'.
          // Usamos 'in cell.col' para asegurarnos que la propiedad existe antes de acceder a ella,
          // y luego un type assertion (as ExcelJS.Column) para decirle a TypeScript lo que esperamos.
          if (typeof cell.col === 'object' && cell.col !== null && 'width' in cell.col) {
            columnWidth = (cell.col as ExcelJS.Column).width || 10
          }
          // *** FIN DE LA CORRECCIÓN ROBUSTA ***

          const textLength = String(cell.value).length
          const charsPerLine = Math.floor(columnWidth / 0.7) // Aproximación de caracteres por línea
          const lines = Math.ceil(textLength / charsPerLine)
          if (lines > 1) {
            row.height = Math.max(row.height, lines * 15) // Ajusta la altura de la fila
          }
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
