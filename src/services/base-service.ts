import { IRow } from "@/components/Table";
import axios from "axios";
import { getCookie } from "cookies-next";

interface BaseInternalGetRowsReply {
  success: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
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
  const token = getCookie('token');
  try {
    const { data } = await axios.get(`http://127.0.0.1:8000/api${path}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    
    return {
      success: true,
      data: data.DATA
    }
}
  catch(err) {
    console.log(err);
    return { success: false, data: [] }
  }
}

export async function BasePostRequest(path: string, body: object): Promise<BasePostReply> {
  const token = getCookie('token');
  try {
    const { data } = await axios.post(
      `http://127.0.0.1:8000/api${path}`, 
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      }
    );

    console.log('data: ', data);
    return !!data.success
      ? { success: true, }
      : { success: false, message: data.message || "" }
  }
  catch(err) {
    console.log(err);
    return { success: false, message: "" }
  }
}