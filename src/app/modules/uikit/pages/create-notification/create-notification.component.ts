// src/app/modules/uikit/pages/create-notification/create-notification/create-notification.component.ts

import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuillModule } from 'ngx-quill';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription, lastValueFrom } from 'rxjs';

import { NotificationTypes } from 'src/app/core/enums/notification.enums';
import { RecipientTypes } from 'src/app/core/enums/recipient.enum';
import { StatusCodes } from 'src/app/core/enums/status.enum';
import { NotificationI } from 'src/app/core/models/notification.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PdfService } from 'src/app/core/services/pdf.service';

import { BusquedaUsuariosComponent } from './components/busqueda-usuarios/busqueda-usuarios.component';
import { SelectorListasComponent } from './components/selector-listas/selector-listas.component';
import { PreviewMensajeComponent, SendEmailContent } from './components/preview-mensaje/preview-mensaje.component';
import { EditorMensajeComponent } from './components/editor-mensaje/editor-mensaje.component';
import { NotificationTypeComponent } from './components/notification-type/notification-type.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

import { SendEmailDTO, SendBulkEmailDTO } from './models/send-email';
import { OnInit, OnDestroy, NgZone, Component } from '@angular/core';
import { PdfData } from './models/pdf.interface';

interface User {
  id: string;
  name: string;
  email: string;
  memberNumber?: string;
  dni?: string;
  // Remove or keep num_socio if it's used elsewhere
  // num_socio?: string;
  // Add other properties if necessary
}

interface Lista {
  name: string;
  miembros: User[];
}

@Component({
  selector: 'app-create-notification',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    QuillModule,
    CommonModule,
    AngularSvgIconModule,
    BusquedaUsuariosComponent,
    SelectorListasComponent,
    PreviewMensajeComponent,
    EditorMensajeComponent,
    NotificationTypeComponent,
    MatCheckboxModule,
    ConfirmationDialogComponent,
    MatDialogModule,
    MatProgressBarModule,
  ],
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss'],
})
export class CreateNotificationComponent implements OnInit, OnDestroy {
  // Campos del formulario
  message: string = '';
  title: string = '';
  type: NotificationTypes = NotificationTypes.ADMIN_MESSAGE;
  previewImage: string | null = null;
  isSingleRecipient: boolean = false;

  // Destinatarios seleccionados
  usuariosSeleccionados: User[] = [];
  listasSeleccionadas: Lista[] = [];

  // Estado de carga y progreso
  isLoading: boolean = false;
  isGeneratingPdf: boolean = false;
  progressPercentage: number = 0;

  // Suscripciones
  private pdfProgressSubscription: Subscription | undefined;
  private pdfErrorSubscription: Subscription | undefined;

  // Fechas
  assemblyDate: string = new Date().toISOString(); // Fecha de la Asamblea como ISO string
  currentDate: string = new Date().toISOString(); // Fecha actual como ISO string

  // Contenido del Email
  emailHtmlContent: string = ''; // HTML del email recibido desde el componente hijo
  emailPlainTextContent: string = ''; // Texto plano del email recibido desde el componente hijo

  // Configuración del editor Quill
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ align: [] }],
    ],
  };

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private pdfService: PdfService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone, // Ensure NgZone is correctly imported and injected
  ) {}

  ngOnInit(): void {
    // Suscribirse a errores del PDF
    this.pdfErrorSubscription = this.pdfService.getPdfErrors().subscribe((errorMessage: string) => {
      this.snackBar.open(`Error en generación de PDF: ${errorMessage}`, 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
    });

    // Suscribirse al progreso del PDF
    this.pdfProgressSubscription = this.pdfService.getPdfProgress().subscribe((progressMessage: string) => {
      this.ngZone.run(() => {
        console.log('Progreso de generación de PDF:', progressMessage);
        this.snackBar.open(progressMessage, 'Cerrar', {
          duration: 2000,
          panelClass: ['snackbar-info'],
        });
      });
    });
  }

  /**
   * Agregar usuarios seleccionados.
   */
  agregarUsuario(usuarios: User[]): void {
    console.log('Usuarios seleccionados recibidos:', usuarios);
    this.usuariosSeleccionados = usuarios;
  }

  /**
   * Eliminar un usuario seleccionado.
   */
  eliminarUsuario(usuario: User): void {
    this.usuariosSeleccionados = this.usuariosSeleccionados.filter((u) => u.id !== usuario.id);
  }

  /**
   * Agregar listas seleccionadas.
   */
  agregarListas(listas: Lista[]): void {
    this.listasSeleccionadas = listas;
  }

  /**
   * Manejar la selección de archivos e imágenes.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Alternar el estado de destinatario único.
   */
  toggleSingleRecipient(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isSingleRecipient = input.checked;
    if (this.isSingleRecipient) {
      this.resetRecipients();
    }
  }

  /**
   * Confirmar el envío de la notificación.
   */
  async confirmSendNotification(): Promise<void> {
    if (!this.isValidRecipients()) {
      this.showError('Por favor, selecciona al menos un usuario o una lista para enviar la notificación.');
      return;
    }

    if (this.isInternalNotification()) {
      this.prepareAndSendInternalNotification();
    } else {
      await this.prepareAndSendEmail();
    }
  }

  /**
   * Validar que se ha seleccionado al menos un destinatario.
   */
  private isValidRecipients(): boolean {
    if (this.type === NotificationTypes.ADMIN_MESSAGE || this.type === NotificationTypes.SYSTEM_ALERT) {
      return true;
    }
    return this.usuariosSeleccionados.length > 0 || this.listasSeleccionadas.length > 0;
  }

  /**
   * Verificar si el tipo de notificación es interna.
   */
  private isInternalNotification(): boolean {
    return this.type === NotificationTypes.ADMIN_MESSAGE || this.type === NotificationTypes.SYSTEM_ALERT;
  }

  /**
   * Mostrar un mensaje de error.
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }

  /**
   * Preparar y enviar notificaciones internas.
   */
  private prepareAndSendInternalNotification(): void {
    const notificationData = this.createInternalNotification();
    if (notificationData) {
      this.notificationService.createNotification(notificationData);
      this.resetForm();
      this.snackBar.open('Notificación interna enviada correctamente.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
    }
  }

  /**
   * Crear los datos de la notificación interna.
   */
  private createInternalNotification(): NotificationI | null {
    if (!this.title.trim() || !this.message.trim()) {
      this.showError('El título y el mensaje son obligatorios para una notificación interna.');
      return null;
    }

    return {
      recipientId: '', // Define el destinatario adecuado
      recipientType: RecipientTypes.USER,
      type: this.type,
      message: this.message,
      title: this.title,
      status: StatusCodes.PENDING,
    };
  }

  /**
   * Preparar y enviar correos electrónicos.
   */
  private async prepareAndSendEmail(): Promise<void> {
    if (!this.title.trim() || !this.message.trim()) {
      this.showError('El título y el mensaje son obligatorios para enviar una notificación por correo.');
      return;
    }

    if (!this.emailHtmlContent) {
      this.showError('El contenido del email no está definido.');
      return;
    }

    try {
      this.isLoading = true;

      const emailsWithAttachments = await this.generateAllEmails();

      if (emailsWithAttachments.length === 0) {
        this.showError('No hay correos electrónicos para enviar.');
        return;
      }

      const bulkPayload: SendBulkEmailDTO = {
        emails: emailsWithAttachments,
      };

      const destinatariosDetalle = this.constructDestinatariosDetalle(bulkPayload.emails.length);

      const confirmation = await this.openConfirmationDialog(destinatariosDetalle);
      if (confirmation) {
        await this.generateAndSendBulkEmails(bulkPayload);
      }
    } catch (error: unknown) {
      let errorMessage = 'Error desconocido al preparar el envío de correos.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error('Error al preparar el envío de correos:', error);
      this.showError(`Error al preparar el envío de correos: ${errorMessage}`);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Generar todos los emails con sus adjuntos.
   */
  private async generateAllEmails(): Promise<SendEmailDTO[]> {
    const emailPromises: Promise<SendEmailDTO>[] = [];

    // Generar emails para usuarios seleccionados
    this.usuariosSeleccionados.forEach((user) => {
      emailPromises.push(this.generateEmailForUser(user));
    });

    // Generar emails para miembros de listas seleccionadas
    this.listasSeleccionadas.forEach((lista) => {
      lista.miembros.forEach((member) => {
        emailPromises.push(this.generateEmailForUser(member));
      });
    });

    return await Promise.all(emailPromises);
  }

  /**
   * Generar un email para un usuario específico.
   */
  private async generateEmailForUser(user: User): Promise<SendEmailDTO> {
    console.log('Usuario:', user);
    return {
      to: user.email,
      subject: this.title,
      bodyText: this.message,
      bodyHtml: this.emailHtmlContent, // Usar el contenido HTML emitido desde el componente hijo
      memberNumber: user.memberNumber || '',
      nombre: user.name,
      dni: user.dni || '',
      attachments: [], // Inicializar como arreglo vacío, se añadirán adjuntos más adelante
    };
  }

  /**
   * Construir el detalle de destinatarios.
   */
  private constructDestinatariosDetalle(total: number): string {
    const usuarios = this.usuariosSeleccionados.map((u) => u.name).join(', ') || 'Ninguno';
    const listas = this.listasSeleccionadas.map((l) => l.name).join(', ') || 'Ninguna';
    return `Usuarios: ${usuarios}. Listas: ${listas}. Total: ${total} destinatario${total !== 1 ? 's' : ''}.`;
  }

  /**
   * Abrir el modal de confirmación.
   */
  private openConfirmationDialog(detalle: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
      panelClass: 'custom-dialog',
      data: {
        title: this.title,
        destinatarios: {
          usuarios: this.usuariosSeleccionados.map((u) => u.name),
          listas: this.listasSeleccionadas.map((l) => ({
            name: l.name,
            membersCount: l.miembros.length,
          })),
          total: detalle.split('Total: ')[1].split(' destinatario')[0],
          detalle,
        },
        message: this.message,
      },
    });

    return lastValueFrom(dialogRef.afterClosed());
  }

  private async generateAndSendBulkEmails(payload: SendBulkEmailDTO): Promise<void> {
    const startTime = performance.now();
    this.snackBar.open('Generando PDFs, por favor espera...', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-info'],
    });
    this.isGeneratingPdf = true;
    this.progressPercentage = 0;

    const totalEmails = payload.emails.length;
    let processedEmails = 0;
    console.log(payload.emails[0]);
    try {
      // Convertir la imagen a base64 una sola vez si se va a reutilizar
      const imageDataUrl = await this.convertImageToBase64('../../../../../assets/icons/logo-arcodavella.png');
      const imageBase64 = this.extractBase64(imageDataUrl, 'image/png');

      // Limitar a los primeros 5 emails para la generación de PDFs en este ejemplo
      for (const email of payload.emails.slice(0, 5)) {
        // Validar que todos los campos necesarios estén definidos
        if (!email.memberNumber || !email.nombre || !email.dni || !email.to) {
          console.error('Datos incompletos para el PDF:', email);
          this.showError('Datos incompletos para la generación del PDF.');
          continue; // Saltar este email
        }

        const pdfData: PdfData = {
          numSocio: email.memberNumber,
          nombre: email.nombre,
          dni: email.dni,
          email: email.to,
          assemblyDate: this.assemblyDate, // Pasar fecha de asamblea
          currentDate: new Date().toISOString(), // Pasar fecha actual
        };
        // Verificar que los datos sean válidos
        if (!pdfData.numSocio || !pdfData.nombre || !pdfData.dni || !pdfData.email) {
          console.error('Datos inválidos para el PDF:', pdfData);
          this.showError('Datos inválidos para la generación del PDF.');
          continue; // Saltar este email
        }

        const pdfObservable = this.pdfService.generatePdf(pdfData, this.title, this.message, this.previewImage);
        const pdfResult = await lastValueFrom(pdfObservable);

        // ** Display the PDF for verification **
        this.displayPdfForVerification(pdfResult.pdfDataUrl);

        processedEmails++;
        this.updateProgress(processedEmails, totalEmails);

        // Añadir los adjuntos al email
        email.attachments = [
          ...email.attachments!, // Incluir adjuntos ya existentes (como el logo)
          {
            filename: 'qr_asamblea.pdf',
            content: this.extractBase64(pdfResult.pdfDataUrl, 'application/pdf'),
            encoding: 'base64',
            contentType: 'application/pdf',
          },
        ];

        // Añadir la imagen convertida a base64
        if (imageBase64) {
          email.attachments.push({
            filename: 'previewImage.png',
            content: imageBase64,
            encoding: 'base64',
            contentType: 'image/png',
            cid: 'logo@arcodavella', // Otro Content-ID para imágenes inline
          });
        }
      }

      const pdfEndTime = performance.now();
      const pdfDuration = pdfEndTime - startTime;

      this.snackBar.open(
        `PDFs generados en ${(pdfDuration / 1000).toFixed(2)} segundos. Enviando notificaciones...`,
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['snackbar-info'],
        },
      );

      // Enviar las notificaciones masivas
      await this.sendBulkNotifications(payload);

      const endTime = performance.now();
      const totalDuration = endTime - startTime;

      this.snackBar.open(`Notificaciones enviadas en ${(totalDuration / 1000).toFixed(2)} segundos.`, 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-success'],
      });

      this.resetForm();
    } catch (error) {
      console.error('Error en la generación y envío de PDFs:', error);
    } finally {
      this.isGeneratingPdf = false;
      this.progressPercentage = 0;
    }
  }

  /**
   * Actualizar el progreso de generación de PDFs.
   */
  private updateProgress(processed: number, total: number): void {
    this.ngZone.run(() => {
      this.progressPercentage = Math.round((processed / total) * 100);
    });
  }

  /**
   * Enviar notificaciones masivas.
   */
  private async sendBulkNotifications(payload: SendBulkEmailDTO): Promise<void> {
    try {
      console.log('Payload being sent to API:', payload);

      await lastValueFrom(this.notificationService.enviarNotificacionMasiva(payload));
    } catch (error) {
      console.error('Error al enviar notificaciones masivas:', error);
    }
  }

  /**
   * Convierte una ruta de imagen a una cadena base64.
   * @param imageUrl Ruta relativa o absoluta de la imagen.
   * @returns Una promesa que resuelve con el Data URL de la imagen.
   */
  private async convertImageToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al convertir la imagen a base64:', error);
      return '';
    }
  }

  /**
   * Extraer base64 del Data URL.
   */
  private extractBase64(dataUrl: string, expectedType: string): string {
    // Ajustar la expresión regular para capturar solo la parte base64, ignorando parámetros adicionales

    const regex = new RegExp(`^data:${expectedType}[^,]*,(.+)$`);
    const matches = dataUrl.match(regex);

    // Verificar si la expresión regular encontró coincidencias
    if (!matches || !matches[1]) {
      console.error(`El formato del Data URL no coincide con el tipo esperado: ${expectedType}`);
      console.error(`El formato del data: ${dataUrl}`);
      return '';
    }

    // Devolver la parte base64 extraída
    return matches[1];
  }

  /**
   * Reiniciar el formulario después del envío.
   */
  private resetForm(): void {
    this.message = '';
    this.title = '';
    this.type = NotificationTypes.ADMIN_MESSAGE;
    this.previewImage = null;
    this.isSingleRecipient = false;
    this.usuariosSeleccionados = [];
    this.listasSeleccionadas = [];
    this.emailHtmlContent = '';
    this.emailPlainTextContent = '';
    this.progressPercentage = 0;
    this.snackBar.open('Formulario reiniciado.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-info'],
    });
  }

  /**
   * Reiniciar las selecciones de destinatarios.
   */
  private resetRecipients(): void {
    this.usuariosSeleccionados = [];
    this.listasSeleccionadas = [];
    this.snackBar.open('Destinatarios reiniciados.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-info'],
    });
  }

  /**
   * Mostrar una vista previa del PDF en una nueva ventana para verificación.
   */
  private async displayPdfForVerification(pdfDataUrl: string): Promise<void> {
    try {
      const response = await fetch(pdfDataUrl);
      const pdfBlob = await response.blob();
      const blobUrl = URL.createObjectURL(pdfBlob);
      const newWindow = window.open(blobUrl, '_blank');
      if (!newWindow) {
        console.error('Failed to open the PDF window. Please check your browser settings.');
      }
      newWindow?.addEventListener('load', () => {
        URL.revokeObjectURL(blobUrl);
      });
    } catch (error) {
      console.error('Error displaying PDF:', error);
    }
  }

  /**
   * Manejar cambios de fecha emitidos desde el componente hijo.
   */
  onAssemblyDateChange(newDate: string): void {
    this.assemblyDate = newDate;
    console.log('Fecha de Asamblea actualizada en el padre:', this.assemblyDate);
  }

  /**
   * Recibir el contenido del email emitido por el componente hijo.
   */
  onEmailContentChanged(content: SendEmailContent): void {
    this.emailHtmlContent = content.htmlContent;
    this.emailPlainTextContent = content.plainTextContent;
    console.log('Contenido del email recibido:', content);
  }

  /**
   * Limpiar las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    if (this.pdfErrorSubscription) {
      this.pdfErrorSubscription.unsubscribe();
    }
    if (this.pdfProgressSubscription) {
      this.pdfProgressSubscription.unsubscribe();
    }
  }
}
