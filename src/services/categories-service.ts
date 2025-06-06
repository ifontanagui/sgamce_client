import {  BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-service";

export interface CategoryData {
  id: number,
  nome: string
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
    data: reply.data as CategoryData[]
  }
} 

export async function CreateCategory(nome: string): Promise<BasePostReply> {
  return BasePostRequest('/categoria', { nome })
}

export async function EditCategory(id: number, nome: string): Promise<BasePostReply> {
  return BasePostRequest('/categoria/atualizar', { id, nome })
}