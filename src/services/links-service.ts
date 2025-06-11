import { IRow } from "@/components/Table"
import { EquipmentData } from "./equipments-service"

export interface BuildData {
  id: number,
  nome: string,
}
interface FindBuildsRowsReply {
  success: boolean,
  data: BuildData[]
}
export interface LinkUserData {
  id: number,
  nome: string,
  email: string,
}
export interface LinkEquipmentData {
  equipamento: string,
  numero_patrimonio: number,
  identificacao: string,
}
export interface RoomData {
  buildId: number,
  id: number,
  nome: string,
  equipments: EquipmentData[],
  users: LinkUserData[]
}
interface FindRoomsRowsReply {
  success: boolean,
  data: RoomData[]
}

export async function FindBuildsRows(): Promise<FindBuildsRowsReply> {
  const builds = [
    { id: 1, nome: 'Prédio 01' },
    { id: 2, nome: 'Prédio 02' },
    { id: 3, nome: 'Prédio 03' },
    { id: 4, nome: 'Prédio 04' },
    { id: 5, nome: 'Prédio 05' },
    { id: 6, nome: 'Prédio 06' },
   ] as BuildData[]

  return {
    success: true,
    data: builds
  }
} 

export async function FindRoomsRows(buildId: number):Promise<FindRoomsRowsReply> {
  const rooms = [
    { 
      buildId: 1, 
      id: 1, 
      nome: 'Sala 01', 
      equipments: [
        { equipamento: 'Computador 01', identificacao: '1', numero_patrimonio: 1 },
        { equipamento: 'Computador 02', identificacao: '2', numero_patrimonio: 2 },
      ],
      users: [
        { id: 1, nome: 'Usuário 01', email: 'usuqrio01@email.com'},
        { id: 2, nome: 'Usuário 02', email: 'usuqrio02@email.com'},
        { id: 3, nome: 'Usuário 03', email: 'usuqrio03@email.com'},
        { id: 4, nome: 'Usuário 04', email: 'usuqrio04@email.com'},
        { id: 5, nome: 'Usuário 05', email: 'usuqrio05@email.com'}
      ]
    }, 
    { buildId: 1, id: 2, nome: 'Laboratório 01', equipments: [], users: [] },
    { buildId: 1, id: 3, nome: 'Sala 02' , equipments: [], users: []}, 
    { buildId: 1, id: 4, nome: 'Laboratório 03', equipments: [], users: [] },
    { buildId: 2, id: 1, nome: 'Sala 01' , equipments: [], users: []}, 
    { buildId: 2, id: 2, nome: 'Laboratório 01', equipments: [], users: [] },
    { buildId: 3, id: 1, nome: 'Sala 01' , equipments: [], users: []}, 
    { buildId: 3, id: 2, nome: 'Laboratório 01', equipments: [], users: [] },
    { buildId: 4, id: 1, nome: 'Sala 01' , equipments: [], users: []}, 
    { buildId: 4, id: 2, nome: 'Laboratório 01', equipments: [], users: [] },
    { buildId: 6, id: 1, nome: 'Sala 01' , equipments: [], users: []}, 
    { buildId: 6, id: 2, nome: 'Laboratório 01', equipments: [], users: [] },
  ] as RoomData[]

  return {
    success: true,
    data: rooms.filter(x => x.buildId === buildId)
  }
}

export function ParseToBuildIRow(data: BuildData[]): IRow[] {
  return data.map(x => { 
    return { 
      data: [x.id, x.nome], 
    } as IRow});
}

export function ParseToRoomIRow(data: RoomData[]): IRow[] {
  return data.map(x => { 
    return { 
      data: [x.id, x.nome], 
      subList: {
        title: 'Usuários',
        headers: ['ID', 'Nome'],
        rows: x.users.map(x => [ x.id, x.nome ])
      }
    } as IRow});
}

export function ParseToUserIRow(data: LinkUserData[]): IRow[] {
  return data.map(x => {
    return {
      data: [ x.id, x.nome ]
    } as IRow
  })
}