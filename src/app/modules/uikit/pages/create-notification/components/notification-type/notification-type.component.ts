// src/app/modules/uikit/components/notification-type/notification-type.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NotificationTypes } from 'src/app/core/enums/notification.enums';

@Component({
  selector: 'app-notification-type',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notification-type.component.html',
  styleUrls: ['./notification-type.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationTypeComponent),
      multi: true,
    },
  ],
})
export class NotificationTypeComponent implements ControlValueAccessor {
  // Lista de tipos de notificación utilizando el enum NotificationTypes
  tiposNotificacion: NotificationTypes[] = Object.values(NotificationTypes);

  // Tipo seleccionado, se recibe desde el componente padre o ngModel
  @Input() tipoSeleccionado: NotificationTypes = NotificationTypes.ADMIN_MESSAGE;
  @Output() tipoSeleccionadoChange = new EventEmitter<NotificationTypes>();

  // Métodos de ControlValueAccessor para permitir que el componente funcione con ngModel
  writeValue(value: NotificationTypes): void {
    this.tipoSeleccionado = value;
  }

  registerOnChange(fn: (tipo: NotificationTypes) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementa si deseas manejar el estado de deshabilitado
  }

  // Propiedades internas para el ControlValueAccessor
  private onChange: (tipo: NotificationTypes) => void = () => {};
  private onTouched: () => void = () => {};

  // Método para manejar el cambio de tipo de notificación
  onTipoChange(tipo: NotificationTypes) {
    this.tipoSeleccionado = tipo;
    this.onChange(tipo); // Actualizamos el valor para ngModel
    this.tipoSeleccionadoChange.emit(tipo); // Emitimos el valor al componente padre si es necesario
  }
}
