import { IRow } from "@/components/Table";
import {  BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-service";

export interface CategoryData {
  id: number,
  nome: string,
  ativo: boolean
}
interface FindCategoriesRowsReply {
  success: boolean,
  data: CategoryData[]
}

export async function FindCategoriesRows(): Promise<FindCategoriesRowsReply> {
  const reply = await BaseGetRowsRequest('/categorias');

  if (!reply.success) return reply;

  return {
    success: true,
    data: reply.data.map(x => {
      return {
        id: x.id,
        nome: x.nome,
        ativo: x.ativo
      }
    }) as CategoryData[]
  }
} 

export async function CreateCategory(nome: string): Promise<BasePostReply> {
  return BasePostRequest('/categoria', { nome })
}

export async function EditCategory(id: number, nome: string): Promise<BasePostReply> {
  return BasePostRequest('/categoria/atualizar', { id, nome })
}

export async function ActivateDeactivateCategory(id: number): Promise<BasePostReply>  {
  return  BasePostRequest('/categoria/atualizar/status', { id });
}

export function ParseToIRow(data: CategoryData[]): IRow[] {
  return data.map(x => {  return {data: [x.id, x.nome], active: x.ativo} as IRow})
}