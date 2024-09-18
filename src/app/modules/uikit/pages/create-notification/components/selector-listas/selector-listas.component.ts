// src/app/selector-listas/selector-listas.component.ts

import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalEdicionComponent, Miembro } from '../modal-edicion/modal-edicion.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-selector-listas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ModalEdicionComponent,
    MatCheckboxModule,
  ],
  templateUrl: './selector-listas.component.html',
  styleUrls: ['./selector-listas.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorListasComponent),
      multi: true,
    },
  ],
})
export class SelectorListasComponent implements ControlValueAccessor {
  listasSeleccionadas: string[] = [];
  dropdownOpen: boolean = false;
  isDisabled: boolean = false;

  // Listas de ejemplo
  listas: { nombre: string; destinatarios: number; miembros: Miembro[] }[] = [
    {
      nombre: 'Lista de Marketing',
      destinatarios: 3,
      miembros: [
        { nombre: 'Juan Pérez', correo: 'juan.perez@example.com' },
        { nombre: 'María López', correo: 'maria.lopez@example.com' },
        { nombre: 'Carlos Sánchez', correo: 'carlos.sanchez@example.com' },
      ],
    },
    {
      nombre: 'Lista de Soporte',
      destinatarios: 2,
      miembros: [
        { nombre: 'Ana Gómez', correo: 'ana.gomez@example.com' },
        { nombre: 'Luis Fernández', correo: 'luis.fernandez@example.com' },
      ],
    },
    {
      nombre: 'Lista de Ventas',
      destinatarios: 4,
      miembros: [
        { nombre: 'Pedro Martínez', correo: 'pedro.martinez@example.com' },
        { nombre: 'Lucía Ruiz', correo: 'lucia.ruiz@example.com' },
        { nombre: 'Sofía Díaz', correo: 'sofia.diaz@example.com' },
        { nombre: 'Miguel Torres', correo: 'miguel.torres@example.com' },
      ],
    },
  ];

  constructor(private eRef: ElementRef, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  // Implementación de ControlValueAccessor
  writeValue(value: string[]): void {
    if (value) {
      this.listasSeleccionadas = value;
    } else {
      this.listasSeleccionadas = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  // Método para alternar el dropdown
  toggleDropdown(): void {
    if (this.isDisabled) return;
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Método para manejar clics fuera del componente y cerrar el dropdown
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.dropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.onTouched();
    }
  }

  /**
   * Abre el modal de edición para una lista específica.
   * @param lista La lista que se va a editar.
   */
  abrirModal(lista: { nombre: string; destinatarios: number; miembros: Miembro[] } | undefined): void {
    if (!lista) {
      this.snackBar.open('La lista seleccionada no existe.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const dialogRef = this.dialog.open(ModalEdicionComponent, {
      width: '900px', // Aumenta el ancho según tus necesidades
      maxWidth: '95vw', // Opcional: limita el ancho máximo al 95% del viewport
      data: { miembros: lista.miembros },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Actualizar los miembros de la lista con los datos modificados del modal
        lista.miembros = result;
        lista.destinatarios = lista.miembros.length;
        this.onChange(this.listasSeleccionadas); // Propagar los cambios
      }
    });
  }
  /**
   * Obtiene una lista por su nombre.
   * @param nombre El nombre de la lista.
   * @returns La lista correspondiente o undefined si no se encuentra.
   */
  getListaPorNombre(nombre: string): { nombre: string; destinatarios: number; miembros: Miembro[] } | undefined {
    return this.listas.find((lista) => lista.nombre === nombre);
  }

  /**
   * Método para manejar la selección de listas de manera inmutable.
   * @param nombre El nombre de la lista.
   */
  toggleListaSeleccionada(nombre: string): void {
    if (this.listasSeleccionadas.includes(nombre)) {
      this.listasSeleccionadas = this.listasSeleccionadas.filter((l) => l !== nombre);
    } else {
      this.listasSeleccionadas = [...this.listasSeleccionadas, nombre];
    }
    this.onChange(this.listasSeleccionadas);
  }

  /**
   * Elimina una lista de las listas seleccionadas.
   * @param nombre El nombre de la lista a eliminar.
   */
  eliminarListaSeleccionada(nombre: string): void {
    this.listasSeleccionadas = this.listasSeleccionadas.filter((l) => l !== nombre);
    this.onChange(this.listasSeleccionadas);
  }
}
