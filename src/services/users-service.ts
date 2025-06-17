import { IRow } from "@/components/Table";
import { BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-service";

export interface UserData {
  id: number,
  nome: string,
  email: string,
  senha: string,
  admin: boolean,
  ativo: boolean
}

interface FindUsersRowsReply {
  success: boolean,
  data: UserData[]
}

export async function FindUsersRows(): Promise<FindUsersRowsReply> {
  const reply = await BaseGetRowsRequest('/usuarios');

  if (!reply.success) return reply;

  return {
    success: true,
    data: reply.data.map(x => { 
      return { 
        id: x.id,
        nome: x.nome,
        email: x.email,
        senha: x.senha,
        admin: !!x.admin,
        ativo: !!x.ativo
      } as UserData 
    })
  }
}

export async function CreateUser(nome: string, email: string, senha: string, admin: boolean): Promise<BasePostReply> {
  return BasePostRequest('/usuario', { nome, email, senha, admin });
}

export async function EditUser(id: number, nome: string, email: string, admin: boolean, senha: string | null = null): Promise<BasePostReply> {
  const userReply = BasePostRequest('/usuario/atualizar', { id, nome, email, admin, senha });

  if (!!senha) {
    return await BasePostRequest('/usuario/atualizar/senha', { 
      id,
      senha  
    });
  }

  return userReply;
}

export async function ActivateDeactivateUser(id: number): Promise<BasePostReply>  {
  return  BasePostRequest('/usuario/atualizar/status', { id });
}

export function ParseToIRow(data: UserData[]): IRow[] {
  return data.map(x => { return { data: [ x.id, x.nome, x.email, x.admin ], active: x.ativo} as IRow})
}