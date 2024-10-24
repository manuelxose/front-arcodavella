// src/app/domain/dtos/email.ts

export interface SendEmailDTO {
  to: string | string[]; // Un solo destinatario o múltiples destinatarios
  subject: string; // Asunto del correo
  bodyText: string; // Cuerpo del mensaje en texto plano
  bodyHtml?: string; // Cuerpo del mensaje en HTML (opcional)
  attachments?: Attachment[]; // Adjuntos (opcional)
  memberNumber?: string;
  numSocio?: string;
  nombre?: string;
  dni?: string;
}

export interface SendBulkEmailDTO {
  emails: SendEmailDTO[]; // Arreglo de correos electrónicos para envío masivo
}

export interface Attachment {
  filename: string; // Nombre del archivo
  content?: string | Buffer; // Contenido del archivo, puede ser un Buffer o cadena Base64
  path?: string; // Ruta al archivo en el sistema de archivos
  contentType?: string; // Tipo MIME del archivo
  encoding?: string; // Codificación, por ejemplo, 'base64'
  cid?: string;
}

export interface Buffer {
  toString(): string;
}
