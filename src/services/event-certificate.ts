import { IRow } from "@/components/Table"

export interface EquipmentEventData {
  id: number,
  equipamento: string,
  numero_patrimonio: number,
  identificacao: string,
}
export interface EventData {
  evento: {
    id: number,
    id_equipamento: number,
    tipo: string,
    data_agendada: string,
    descricao: string,
    custo: number
  }
  certificado: {
    id: number,
    numero: number,
    data: string,
    orgao_expedidor: string
  } | null
}
interface FindEquipmentsRowsReply {
  success: boolean,
  data: EquipmentEventData[]
}
interface FindEventsRowsReply {
  success: boolean,
  data: EventData[]
}

export async function FindEquipmentsRows():Promise<FindEquipmentsRowsReply> {
  const equipments = [
    { id: 1, equipamento: 'Computador 01', identificacao: '1', numero_patrimonio: 1 },
    { id: 2, equipamento: 'Computador 02', identificacao: '2', numero_patrimonio: 2 },
    { id: 3, equipamento: 'Computador 03', identificacao: '3', numero_patrimonio: 3 }
  ] as EquipmentEventData[]

  return {
    success: true,
    data: equipments
  }
}

export async function FindEventsRows(equipmentId: number):Promise<FindEventsRowsReply> {
  console.log('equipmentId: ', equipmentId);
  const data = [
    {
      evento: { id: 1, id_equipamento: 1, custo: 10.1, data_agendada: "01/01/2025", descricao: "Foi muito legal", tipo: 'Calibracao' },
      certificado: { id: 1, data: "01/01/2024", numero: 123, orgao_expedidor: "CETEC" }
    },
    {
      evento: { id: 2, id_equipamento: 1, custo: 90, data_agendada: "31/01/2025", descricao: "Não gostei", tipo: 'Calibracao' },
      certificado: null
    }
    

  ] as EventData[];

  return {
    success: true,
    data
  }
}

export function ParseToEventIRow(data: EventData[]): IRow[] {

  return data.map(x => {
    return {
      data: [ x.evento.id, x.evento.tipo, x.evento.data_agendada, , x.evento.descricao, `R$ ${x.evento.custo}` ],
      subList: {
        title: 'Evento',
        headers: [ 'ID', 'Número', 'Data', 'Og. Expedidor' ],
        rows: x.certificado 
          ? [[ x.certificado.id, x.certificado.numero, x.certificado.data, x.certificado.orgao_expedidor ]] 
          : []
      }
    } as IRow
  })
}