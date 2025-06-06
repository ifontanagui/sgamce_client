import api from "@/resources/api";

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
  const { data } = await api.post('/login', {
    email,
    senha: password
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