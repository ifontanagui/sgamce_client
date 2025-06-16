import { IRow } from "@/components/Table"
import { BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-service"
import { APIToView, ViewToAPI } from "@/utils/date-parse"

export interface EquipmentEventData {
  id: number,
  equipamento: string,
  numero_patrimonio: number,
  tag: string,
  events: EventData[]
}
export interface EventData {
  evento: {
    id: number,
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

export async function FindEquipmentsRows():Promise<FindEquipmentsRowsReply> {
  const [replyEvents, replyEquipments] = await  Promise.all([
    BaseGetRowsRequest('/eventos'),
    BaseGetRowsRequest('/equipamentos'),
  ])

  if (!replyEvents.success || !replyEquipments.success) return replyEvents;

  const data = replyEquipments.data.map(x => { 
    return {
      id: x.id,
      equipamento: x.id_modelo.equipamento,
      tag: x.tag,
      numero_patrimonio: x.numero_patrimonio,
      events: replyEvents.data
        .filter(e => e.id_equipamento.id === x.id)
        .map(e => { return { 
          evento: {...e, data_agendada: APIToView(e.data_agendada)}, 
          certificado: null 
        } })
    } as EquipmentEventData
  });

  return {
    success: true,
    data: data
  }
}

export async function CreateEvent(
  tipo: string, 
  data_agendada: string,
  descricao: string,
  custo: number, 
  id_equipamento: number
): Promise<BasePostReply> {
  return BasePostRequest('/evento', { 
    tipo,
    data_agendada: ViewToAPI(data_agendada),
    descricao,
    custo,
    id_equipamento,
    data_criacao: null
  })
}

export async function CreateCertificate(
  numero: number, 
  data: string,
  orgao_expedidor: string,
  id_evento: number
): Promise<BasePostReply> {
  return BasePostRequest('/certificado', { 
    numero,
    data: ViewToAPI(data),
    orgao_expedidor,
    id_evento,
    arquivo: null
  })
}

export function ParseToEquipmentIRow(data: EquipmentEventData[]): IRow[] {
  return data.map(x => {
    return {
      data: [ x.id, x.equipamento, x.tag, x.numero_patrimonio, x.events.length ]
    } as IRow
  })
}

export function ParseToEventIRow(data: EventData[]): IRow[] {
  return data.map(x => {
    return {
      data: [ x.evento.id, x.evento.tipo, x.evento.data_agendada, , x.evento.descricao, `R$ ${x.evento.custo}` ],
      subList: {
        title: 'Certificado',
        headers: [ 'ID', 'Número', 'Data', 'Og. Expedidor' ],
        rows: x.certificado 
          ? [[ x.certificado.id, x.certificado.numero, x.certificado.data, x.certificado.orgao_expedidor ]] 
          : []
      }
    } as IRow
  })
}