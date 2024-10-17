export interface PdfData {
  numSocio: string;
  nombre: string;
  dni: string;
  email: string | string[];
  logoImageUrl?: string | null; // Data URL del logo (opcional)
  assemblyDate: string; // Fecha de la Asamblea
  currentDate: string; // Fecha actual
}
