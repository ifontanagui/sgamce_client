import { BaseGetRowsRequest } from "./base-service";

export interface AlertData {
  Sigla: string,
  Equipamento: string,
  TAG: number,
  Status: string,
  CertificadoExpiraEm: number
}

interface FindAlertRowsReply {
  success: boolean,
  data: AlertData[]
}

export async function FindAlertsRows(): Promise<FindAlertRowsReply> {
  const reply = await BaseGetRowsRequest('/aviso');

  if (!reply.success) return reply;

  return {
    success: true,
    data: reply.data as AlertData[]
  }
} 