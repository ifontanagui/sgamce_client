import axios from "axios";

interface LoginReply {
  success: boolean,
  message?: string,
  token?: string,
  payload?: {
    id: number,
    name: string,
    admin: number,
  }
}

export async function Login(email: string, password: string): Promise<LoginReply> {
  const { data } = await axios.post(`http://127.0.0.1:8000/api/login`, {
    email,
    senha: password
  },
  {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  if (!data.success) 
    return {
      success: false,
      message: data.message
    } as LoginReply
  
  return {
    success: true,
    token: data.token,
    payload: data.payload
  } as LoginReply
}