import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
  // Lista de tipos de notificación
  tiposNotificacion: string[] = ['info', 'success', 'warning', 'error', 'promotion'];

  // Tipo seleccionado, se recibe desde el componente padre o ngModel
  @Input() tipoSeleccionado: string = 'info';
  @Output() tipoSeleccionadoChange = new EventEmitter<string>();

  // Métodos de ControlValueAccessor para permitir que el componente funcione con ngModel
  writeValue(value: string): void {
    this.tipoSeleccionado = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Puedes implementar esto si quieres manejar el estado de deshabilitado
  }

  // Propiedades internas para el ControlValueAccessor
  onChange = (value: string) => {};
  onTouched = () => {};

  // Método para manejar el cambio de tipo de notificación
  onTipoChange(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.onChange(tipo); // Actualizamos el valor para ngModel
    this.tipoSeleccionadoChange.emit(tipo); // Emitimos el valor al componente padre si es necesario
  }
}
