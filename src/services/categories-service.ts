import { IRow } from "@/components/Table";
import axios from "axios";
import { getCookie } from "cookies-next";

export async function FindCategoriesRows(): Promise<IRow[]> {
  const token = getCookie('token');
  const { data } = await axios.get(`http://127.0.0.1:8000/api/categorias`,
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    withCredentials: true
  });
  
  return data.DATA.map((x: { id: number, nome: string }) => {
    return {
      data: [x.id, x.nome]
    } as IRow
  })
} 

export async function CreateCategory(nome: string) {
  const token = getCookie('token');
  await axios.post(`http://127.0.0.1:8000/api/categoria`, {
    nome
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    withCredentials: true
  });
}

export async function EditCategory(id: number, nome: string) {
  const token = getCookie('token');
  await axios.post(`http://127.0.0.1:8000/api/categoria/atualizar`, {
    id,
    nome
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    withCredentials: true
  });
}