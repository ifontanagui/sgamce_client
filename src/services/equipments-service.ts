import { IRow } from "@/components/Table";
import { BaseGetRowRequest, BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-service";

export interface EquipmentData {
  id: number,
  numero_patrimonio: number,
  identificacao: string,
  equipamento: string,
  marca: string,
  criterio_aceitacao_calibracao: string,
  periodicidade_calibracao: number,
  periodicidade_manutencao: number,
  tipo: string,
  id_categoria: number | null
}
interface FindEquipmentsRowsReply {
  success: boolean,
  data: EquipmentData[]
}

export async function FindEquipmentsRows(): Promise<FindEquipmentsRowsReply> {
  const reply = await BaseGetRowsRequest('/modelos');
  
    if (!reply.success) return reply;
  
    return {
      success: true,
      data: reply.data as EquipmentData[]
    }
} 

export async function FindEquipment(id: number): Promise<EquipmentData | null> {
  const reply = await BaseGetRowRequest(`/modelo/${id}`);
  
  if (!reply.success) return null;

  return reply.data as EquipmentData
}

export async function CreateEquipment(
  equipamento: string, 
  identificacao: string,
  marca: string,
  id_categoria: number, 
  periodicidade_calibracao: number,
  periodicidade_manutencao: number,
  criterio_aceitacao_calibracao: string,
  tipo: string
): Promise<BasePostReply> {
  const rand =  Math.trunc(Math.random() * 2000000000)

  return BasePostRequest('/modelo', { 
    equipamento, 
    marca, 
    id_categoria, 
    periodicidade_calibracao, 
    periodicidade_manutencao,
    criterio_aceitacao_calibracao,
    tipo,    
    identificacao,
    numero_patrimonio: rand
   })
}

export async function EditEquipment(
  id: number,
  equipamento: string,
  identificacao: string,
  marca: string,
  id_categoria: number, 
  periodicidade_calibracao: number,
  periodicidade_manutencao: number,
  criterio_aceitacao_calibracao: string,
  tipo: string,
  numero_patrimonio?: number
): Promise<BasePostReply> {
  return BasePostRequest('/modelo/atualizar', { 
    id,
    equipamento, 
    marca, 
    id_categoria, 
    periodicidade_calibracao, 
    periodicidade_manutencao,
    criterio_aceitacao_calibracao,
    tipo,
    identificacao,
    numero_patrimonio: numero_patrimonio || Math.trunc(Math.random() * 2000000000)
   })
}

export function ParseToIRow(data: EquipmentData[]): IRow[] {
  return data.map(x =>{ return {data: [x.id, x.equipamento, x.id_categoria, x.marca, x.periodicidade_calibracao, x.periodicidade_manutencao]} as IRow});
}