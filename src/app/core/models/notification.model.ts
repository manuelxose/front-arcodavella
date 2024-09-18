import { RecipientTypes } from '../enums/recipient.enum';
import { NotificationTypes } from '../enums/notification.enums';
import { StatusCodes } from '../enums/status.enum';

export interface NotificationI {
  id?: string;
  recipientId: string;
  recipientType: RecipientTypes;
  type: NotificationTypes;
  message: string;
  title: string;
  summary?: string;
  status?: StatusCodes;
  fieldToUpdate?: string; // Campo opcional que representa el campo que se solicita modificar
  newValue?: any; // El nuevo valor propuesto para el campo solicitado
  createdAt?: string;
  updatedAt?: string;
}
