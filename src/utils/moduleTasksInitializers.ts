// src/utils/moduleTasksInitializers.ts
import type { AuditModules, Task } from '@/models/models'

export function getInitialTasksForModule(moduleId: number): Task[] {
  switch (moduleId) {
    case 1: // Existencia
      return [
        {
          id: 1,
          taskCode: 'A',
          procedureDescription: 'Realizar inventario Selectivo a una muestra de Sku',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 101,
              requerimentCode: 1,
              procedureDescription:
                'Tomar una muestra sobre la línea que presento mayor diferencia en Inventario General, verificar si están cuadrados los sku´s, evaluar según escala determinada (perdida sobre % que representa el costo de la venta, no debería sobrepasar 1%)',
              riskLevel: 'Muy Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 102,
              requerimentCode: 2,
              procedureDescription:
                'Se debe realizar inspección visual de todos los espacios de la tienda, si se detecta productos en zonas no permitidas, esto debe afectar negativamente a la puntuación',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
        {
          id: 2,
          taskCode: 'B',
          procedureDescription: 'Mermas',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 201,
              requerimentCode: 1,
              procedureDescription:
                'Identificar el espacio físico asignado para el almacenamiento de la Merma',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 202,
              requerimentCode: 2,
              procedureDescription:
                'Revisar en el panel web de control de existencias que se esté registrando la merma operacional, calidad y E-Commerce, y que los respaldos estén anexados en cada registro',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 203,
              requerimentCode: 3,
              procedureDescription: 'Revisar almacén destinado para la segunda selección en tienda',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
        {
          id: 3,
          taskCode: 'C',
          procedureDescription: 'Revision en el monitor WEB de Existencias',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 301,
              requerimentCode: 1,
              procedureDescription:
                'Recepción de Camión: Se debe revisar que no existan entregas abiertas y todas deben estar contabilizadas con su respectivo documento SAP de contabilización',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 302,
              requerimentCode: 2,
              procedureDescription:
                'Mermas: Se debe revisar que estén registradas las mermas con su respectivo respaldo (Foto, correo con la autorización para las mermas de calidad, Nota de Crédito para las Mermas ecommerce)',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 303,
              requerimentCode: 3,
              procedureDescription:
                'Inventarios Selectivos: Revisar que los inventarios selectivos estén registrados y contabilizados',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 304,
              requerimentCode: 4,
              procedureDescription:
                'Traslados, Retiros y Cambios de Almacén: Revisar que los traslados, Retiros y cambios de almacén estén correctamente registrados',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
        {
          id: 4,
          taskCode: 'D',
          procedureDescription: 'Productos para la venta',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 401,
              requerimentCode: 1,
              procedureDescription:
                'Existen productos de venta en uso en el Back office/ trastienda',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 402,
              requerimentCode: 2,
              procedureDescription:
                'Verificar que las bodegas se encuentran ordenadas y los productos bien almacenados',
              riskLevel: 'Medio',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
        {
          id: 5,
          taskCode: 'E',
          procedureDescription: 'Seguimiento Visita Anterior',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 501,
              requerimentCode: 1,
              procedureDescription:
                'Cuando aplique, valide si se repiten las mismas observaciones que la auditoría anterior',
              riskLevel: 'Muy Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
      ]
    case 2: // Administracion - Replicar estructura similar
      return [
        // Tareas para el módulo de Administracion
        {
          id: 1,
          taskCode: 'A',
          procedureDescription: 'Fiscalizacion',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 101,
              requerimentCode: 1,
              procedureDescription:
                'Patente comercial se encuentra vigente y a la vista de los clientes',
              riskLevel: 'Muy Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 102,
              requerimentCode: 2,
              procedureDescription:
                'El Jefe de Tienda y Encargado de Zona sabe dónde se encuentra la declaración de IVA de los meses anteriores',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
        {
          id: 2,
          taskCode: 'B',
          procedureDescription: 'Temas Varios',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 201,
              requerimentCode: 1,
              procedureDescription:
                'Los colaboradores conocen los procedimientos o instructivos que rigen la forma de operar de la tienda',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
            {
              id: 202,
              requerimentCode: 2,
              procedureDescription:
                'El libro de sugerencias, Felicitaciones y reclamos cumple con las normas y requisitos establecidos',
              riskLevel: 'Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
        {
          id: 2,
          taskCode: 'C',
          procedureDescription: 'Seguimiento Visita Anterior',
          compliancePercentage: 0,
          taskRating: '',
          isCompleted: false,
          subtasks: [
            {
              id: 201,
              requerimentCode: 1,
              procedureDescription:
                'Cuando aplique, valide si se repiten las mismas observaciones que la auditoría anterior',
              riskLevel: 'Muy Alto',
              auditedSamples: 0,
              errorsFound: 0,
              errorPercentage: 0,
              compliancePercentage: 0,
              isCompleted: false,
              observations: [],
            },
          ],
        },
      ]
    case 3: // TI Mantencion - Replicar estructura similar
      return [
        // Tareas para el módulo de TI Mantencion
        // ...
      ]
    case 4: // RR.HH - SSO - Replicar estructura similar
      return [
        // Tareas para el módulo de RR.HH - SSO
        // ...
      ]
    case 5: // Recaudacion - Replicar estructura similar
      return [
        // Tareas para el módulo de Recaudacion
        // ...
      ]
    default:
      return []
  }
}
