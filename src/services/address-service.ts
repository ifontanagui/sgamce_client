import { IRow } from "@/components/Table"

interface RoomData {
  id: number,
  nome: string,
}
export interface AddressData {
  id: number,
  nome: string
  rooms: RoomData[]
}
interface FindAddresssRowsReply {
  success: boolean,
  data: AddressData[]
}

export async function FindAddressRows(): Promise<FindAddresssRowsReply> {
  const builds = [
    { id: 1, nome: 'Prédio 01', rooms: [ { id: 1, nome: 'Sala 01' }, { id: 2, nome: 'Laboratório 01' },{ id: 3, nome: 'Sala 02' }, { id: 4, nome: 'Laboratório 02' } ] },
    { id: 2, nome: 'Prédio 02', rooms: [ { id: 1, nome: 'Sala 01' }, { id: 2, nome: 'Laboratório 01' } ] },
    { id: 3, nome: 'Prédio 03', rooms: [ { id: 1, nome: 'Sala 01' }, { id: 2, nome: 'Laboratório 01' } ] },
    { id: 4, nome: 'Prédio 04', rooms: [ { id: 1, nome: 'Sala 01' }, { id: 2, nome: 'Laboratório 01' } ] },
    { id: 5, nome: 'Prédio 05', rooms: [ ] },
    { id: 6, nome: 'Prédio 06', rooms: [ { id: 1, nome: 'Sala 01' }, { id: 2, nome: 'Laboratório 01' } ] },
   ] as AddressData[]

  return {
    success: true,
    data: builds
  }
} 

export function ParseToIRow(data: AddressData[]): IRow[] {
  return data.map(x => { 
    return { 
      data: [x.id, x.nome], 
      subList: { 
        title: 'Salas e Laboratórios',  
        headers: ['ID', 'Nome'],
        rows: x.rooms.map(r => [ r.id, r.nome ])
      }
    } as IRow});
}