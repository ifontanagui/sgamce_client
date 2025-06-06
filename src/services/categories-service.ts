import { IRow } from "@/components/Table";
import { BaseGetRowsReply, BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-servcice";

export async function FindCategoriesRows(): Promise<BaseGetRowsReply> {
  const reply = await BaseGetRowsRequest('/categorias');
  console.log('reply: ', reply);

  if (!reply.success) return reply;
  
  const data = reply.data.map((x: { id: number, nome: string }) => {
    return {
      data: [x.id, x.nome]
    } as IRow
  })

  return {
    success: true,
    data
  }
} 

export async function CreateCategory(nome: string): Promise<BasePostReply> {
  return BasePostRequest('/categoria', { nome })
}

export async function EditCategory(id: number, nome: string): Promise<BasePostReply> {
  return BasePostRequest('/categoria/atualizar', { id, nome })
}