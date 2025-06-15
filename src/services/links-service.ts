import { IRow } from "@/components/Table"
import { BaseGetRowsRequest, BasePostReply, BasePostRequest } from "./base-service"
import { APIToView, ViewToAPI } from "@/utils/date-parse"
import { UserData } from "./users-service"

export interface LinkAddressData {
  id: number,
  nome: string,
  rooms: RoomData[]
}

export interface RoomData {
  id: number,
  nome: string
  sigla: string,
  sala: string
  users: LinkUserData[]
  equipments: EquipmentData[]
}

export interface EquipmentData {
  id: number
  modelo: {
    id: number,
    equipamento: string
  }
  tag: number,
  numero_patrimonio: number,
  data_implantacao: string
  ativo: number
}

export interface LinkUserData {
  id: number,
  nome: string,
  email: string,
  admin: number
}

interface FindBuildsRowsReply {
  success: boolean,
  data: LinkAddressData[]
}

export async function FindRows(): Promise<FindBuildsRowsReply> {
  const [replyRooms, replyEquipments, replyUsers] = await Promise.all([
      BaseGetRowsRequest('/laboratorios'),
      BaseGetRowsRequest('/equipamentos'),
      BaseGetRowsRequest('/usuarios'),
    ])

  if (!replyRooms.success || !replyEquipments.success || !replyUsers.success ) {
    return {
      success: false,
      data: []
    }
  }
  
  let data = [] as LinkAddressData[]  

  replyRooms.data.forEach(x => {
    const build = data.find(b => b.id === x.id_bloco.id)
    if (build) {
      build.rooms.push({
        id: x.id,
        nome: x.nome,
        sala: x.sala,
        sigla: x.sigla,
        equipments: [],
        users: []
      })

      data = [
        ...data.filter(b => b.id !== build.id),
        build
      ]
    }
    else {
      data.push({
        id: x.id_bloco.id,
        nome: x.id_bloco.nome,
        rooms: [{
          id: x.id,
          nome: x.nome,
          sala: x.sala,
          sigla: x.sigla,
          equipments: [],
          users: []
        }]
      })
    }
  });

  replyUsers.data.forEach(u => {
    let build = null as LinkAddressData | null;
    let room = null as RoomData | null;

    for(const x of data) {
      if (room) continue;
      
      const r = x.rooms.find(y => u.id_laboratorio && y.id === u.id_laboratorio.id) || null
      if (r) {
        build = x;        
        room = r;
      }
    }

    if (room && build?.rooms && room?.users) {

      room.users.push({
        id: u.id,
        email: u.email,
        nome: u.nome,
        admin: u.admin
      })

      build.rooms = [
        ...build?.rooms.filter(x => x.id !== room?.id),
        room
      ]
      
      data = [
        ...data.filter(x => x.id !== build?.id),
        build
      ]
    }
  })
  
  replyEquipments.data.forEach(e => {
    let build = null as LinkAddressData | null;
    let room = null as RoomData | null;
    
    for(const x of data) {
      if (room) continue;
      
      const r = x.rooms.find(y => e.id_laboratorio && y.id === e.id_laboratorio.id) || null
      if (r) {
        build = x;
        room = r;
      }
    }

    if (room && build?.rooms && room?.equipments) {
      room.equipments.push({
        id: e.id,
        tag: e.tag,
        numero_patrimonio: e.numero_patrimonio,
        data_implantacao: APIToView(e.data_implantacao),
        ativo: e.ativo,
        modelo: {
          id: e.id_modelo.id,
          equipamento: e.id_modelo.equipamento,
        }
      })

      build.rooms = [
        ...build?.rooms.filter(x => x.id !== room?.id),
        room
      ]

      data = [
        ...data.filter(x => x.id !== build?.id),
        build
      ]
    }
  })

  return {
    success: true,
    data
  }
} 

export async function AddRoomMachine(tag: string, numero_patrimonio: string, id_modelo: number, data_implantacao: string, id_laboratorio: number): Promise<BasePostReply> {
  return BasePostRequest('/equipamento', { 
    tag, 
    numero_patrimonio, 
    id_modelo, 
    data_implantacao: ViewToAPI(data_implantacao), 
    id_laboratorio 
  })
}

export async function AddRoomUser(user: UserData, id_laboratorio: number) {
  return BasePostRequest('/usuario/atualizar', { 
    ...user,
    id_laboratorio
  });
}

export function ParseToBuildIRow(data: LinkAddressData[]): IRow[] {
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

export function ParseToEquipmentIRow(data: EquipmentData[]): IRow[] {
  return data.map(x => {
    return {
      data: [ x.id, x.modelo.equipamento, x.numero_patrimonio, x.tag, x.data_implantacao ]
    } as IRow
  })
}