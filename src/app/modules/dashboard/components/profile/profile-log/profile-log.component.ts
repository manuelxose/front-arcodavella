import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// Define the AdminAction interface within the component
interface AdminAction {
  createdAt: string; // ISO date string
  id: string;
  message: string;
  recipientId: string;
  recipientType: string;
  status: string;
  summary: string;
  title: string;
  type: string;
  updatedAt: string; // ISO date string
}

@Component({
  selector: 'app-profile-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-log.component.html',
  styleUrls: ['./profile-log.component.scss'],
})
export class ProfileLogComponent implements OnChanges {
  @Input() adminActions: AdminAction[] = [];

  // Mapping of internal type identifiers to user-friendly names
  private typeDisplayMap: { [key: string]: string } = {
    user_request: 'Solicitud usuario',
    password_change: 'Cambio de contraseña',
    role_update: 'Actualización de rol',
    // Add more mappings as needed
    // Example:
    // 'account_deletion': 'Eliminación de cuenta',
    // 'email_verification': 'Verificación de correo electrónico',
  };

  // Processed actions with user-friendly type names
  processedAdminActions: ProcessedAdminAction[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adminActions']) {
      console.log('adminActions updated:', this.adminActions);
      this.processAdminActions();
    }
  }

  /**
   * Processes the incoming adminActions by mapping types and extracting necessary information.
   */
  private processAdminActions(): void {
    this.processedAdminActions = this.adminActions.map((action) => ({
      ...action,
      displayType: this.getDisplayType(action.type),
      formattedCreatedAt: this.getFormattedDate(action.createdAt),
      formattedUpdatedAt: this.getFormattedDate(action.updatedAt),
      affectedEmail: this.extractEmail(action.message),
    }));
  }

  /**
   * Returns the user-friendly display name for a given action type.
   * If the type is not found in the mapping, returns the original type.
   * @param type The internal action type
   * @returns The user-friendly display name
   */
  private getDisplayType(type: string): string {
    return this.typeDisplayMap[type] || type;
  }

  /**
   * Formats an ISO date string into a more readable format.
   * @param dateString The ISO date string
   * @returns The formatted date string
   */
  private getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust formatting as desired
  }

  /**
   * Extracts the email from the message string.
   * Assumes the email is always in the format 'email user@example.com'
   * @param message The message string
   * @returns The extracted email or 'Desconocido' if not found
   */
  private extractEmail(message: string): string {
    const match = message.match(/email (\S+@\S+\.\S+)/);
    return match ? match[1] : 'Desconocido';
  }
}

// Define a processed admin action interface to include additional fields
interface ProcessedAdminAction extends AdminAction {
  displayType: string;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  affectedEmail: string;
}
