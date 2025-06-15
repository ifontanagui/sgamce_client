import { IRow } from "@/components/Table"
import { BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-service"

export interface AddressData {
  id: number,
  nome: string,
  ativo: number
  rooms: RoomData[]
}
interface RoomData {
  id: number,
  nome: string
  sigla: string,
  sala: string
  ativo: number
}
interface FindAddressRowsReply {
  success: boolean,
  data: AddressData[]
}

export async function FindBuildAddressRows(): Promise<FindAddressRowsReply> {
  const [replyBuilds, replyRooms] = await Promise.all([
    BaseGetRowsRequest('/blocos'),
    BaseGetRowsRequest('/laboratorios'),
  ])
  
  if (!replyBuilds.success || !replyRooms.success ) {
    return {
      success: false,
      data: []
    }
  };

  let data = replyBuilds.data.map(x => { return { ...x, rooms: [] } })

  replyRooms.data.forEach(room => {
    const build = data.find(x => x.id === room.id_bloco.id);

    if (build) {
      build.rooms.push(room);
      
      data = [
        ...data.filter(x => x.id !== build.id),
        build
      ]
    }
  });

  return {
    success: true,
    data: data as AddressData[]
  }
}

export async function CreateBuild(nome: string): Promise<BasePostReply> {
  return BasePostRequest('/bloco', { nome })
}

export async function EditBuild(id: number, nome: string): Promise<BasePostReply> {
  return BasePostRequest('/bloco/atualizar', { id, nome })
}

export async function CreateRoom(nome: string, sigla: string, id_bloco: number, sala: number): Promise<BasePostReply> {
  return BasePostRequest('/laboratorio', { id_bloco, nome, sigla, sala })
}

export function ParseToIRow(data: AddressData[]): IRow[] {
  const builds = [] as IRow[];

  data.forEach(x => {
    if (!builds.find(y => y.data.length && y.data[0] === x.id))
    
      builds.push({ 
        data: [x.id, x.nome], 
        subList: {
          title: "Laboratórios",
          headers: ["ID", "Sigla", "Nome", "Sala"],
          rows: x.rooms ? x.rooms.map(z =>  [ z.id, z.sigla, z.nome, z.sala ]) : []
        }
      })
  })
   
  return builds;
}

export function ParseToRoomIRow(data: RoomData[]): IRow[] {
  return data.map(x => { return { data: [ x.id, x.sigla, x.nome, x.sala ] } })
}