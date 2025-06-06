import { IRow } from "@/components/Table";
import api from "@/resources/api";

interface BaseInternalGetRowsReply {
  success: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
}
interface BaseInternalGetRowReply {
  success: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export interface BaseGetRowsReply {
  success: boolean,
  data: IRow[]
}

export interface BasePostReply {
  success: boolean,
  message?: string
}

export async function BaseGetRowsRequest(path: string): Promise<BaseInternalGetRowsReply> {
  try {
    const { data } = await api.get(path);
    
    return {
      success: true,
      data: data.DATA
    }
  }
  catch(err) {    
    console.error(err);    
    return { success: false, data: [] }
  }
}

export async function BaseGetRowRequest(path: string): Promise<BaseInternalGetRowReply> {
  try {
    const { data } = await api.get(path);

    return {
      success: true,
      data: data.DATA
    }
}
catch(err) {
    console.error(err);
    return { success: false, data: [] }
  }
}

export async function BasePostRequest(path: string, body: object): Promise<BasePostReply> {
  try {
    const { data } = await api.post(path, body);

    return !!data.success
      ? { success: true, }
      : { success: false, message: data.message || "" }
  }
  catch(err) {
    console.error(err);    
    return { success: false, message: "" }
  }
}