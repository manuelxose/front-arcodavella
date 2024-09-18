// src/app/modal-edicion/modal-edicion.component.ts

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface Miembro {
  nombre: string;
  correo: string;
}

@Component({
  selector: 'app-modal-edicion',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  templateUrl: './modal-edicion.component.html',
  styleUrls: ['./modal-edicion.component.scss'],
})
export class ModalEdicionComponent implements OnInit {
  // Definición de las columnas de la tabla
  displayedColumns: string[] = ['seleccion', 'nombre', 'correo', 'acciones'];

  // Datos originales y filtrados
  dataSource: Miembro[] = [];
  filteredData: Miembro[] = [];

  // Término de búsqueda
  searchTerm: string = '';

  // Array para almacenar los miembros seleccionados
  seleccionados: Miembro[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ModalEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { miembros: Miembro[] },
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Clonar los datos recibidos para evitar mutaciones directas
    this.dataSource = [...this.data.miembros];
    this.filteredData = [...this.data.miembros];
  }

  ngAfterViewInit() {
    // Suscribirse a los cambios de ordenación
    this.sort.sortChange.subscribe((sortState: Sort) => {
      this.applySort(sortState);
    });
  }

  /**
   * Aplica el filtro basado en el término de búsqueda.
   */
  applyFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.filteredData = this.dataSource.filter(
      (miembro) =>
        miembro.nombre.toLowerCase().includes(filterValue) || miembro.correo.toLowerCase().includes(filterValue),
    );

    // Reaplicar la ordenación después del filtrado
    if (this.sort.active && this.sort.direction) {
      this.applySort(this.sort);
    }

    // Limpiar la selección si los elementos seleccionados ya no están en la lista filtrada
    this.seleccionados = this.seleccionados.filter((miembro) => this.filteredData.includes(miembro));
  }

  /**
   * Aplica la ordenación a los datos filtrados.
   * @param sortState Estado actual de la ordenación.
   */
  applySort(sortState: Sort): void {
    const { active, direction } = sortState;
    if (direction === '') {
      // Si no hay dirección de ordenación, no hacer nada
      return;
    }

    this.filteredData.sort((a, b) => {
      const valueA = (a as any)[active].toLowerCase();
      const valueB = (b as any)[active].toLowerCase();

      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Selecciona o deselecciona todos los miembros.
   * @param event Evento del checkbox de selección total.
   */
  toggleSeleccionTodos(event: any): void {
    if (event.checked) {
      this.seleccionados = [...this.filteredData];
    } else {
      this.seleccionados = [];
    }
  }

  /**
   * Selecciona o deselecciona un miembro individual.
   * @param miembro Miembro a seleccionar o deseleccionar.
   */
  toggleSeleccion(miembro: Miembro): void {
    const index = this.seleccionados.indexOf(miembro);
    if (index === -1) {
      this.seleccionados.push(miembro);
    } else {
      this.seleccionados.splice(index, 1);
    }
  }

  /**
   * Verifica si todos los miembros están seleccionados.
   * @returns Verdadero si todos están seleccionados, falso en caso contrario.
   */
  isAllSelected(): boolean {
    return this.seleccionados.length === this.filteredData.length && this.filteredData.length > 0;
  }

  /**
   * Elimina los miembros seleccionados.
   */
  public eliminarSeleccionados(): void {
    if (this.seleccionados.length === 0) return;

    const confirmacion = confirm(`¿Estás seguro de eliminar ${this.seleccionados.length} miembro(s)?`);
    if (confirmacion) {
      this.dataSource = this.dataSource.filter((miembro) => !this.seleccionados.includes(miembro));
      this.applyFilter();
      this.seleccionados = [];
      this.snackBar.open(`${this.seleccionados.length} miembro(s) eliminado(s)`, 'Cerrar', {
        duration: 3000,
      });
    }
  }

  // Método para eliminar todos los miembros
  eliminarTodos() {
    // Aquí puedes implementar la lógica para eliminar todos los miembros
    // Por ejemplo, si estás obteniendo datos de un servicio, puedes llamar a un método para eliminar en el backend

    // Para efectos de la interfaz, limpiamos los datos locales
    this.dataSource = [];
    this.filteredData = [];
    this.seleccionados = [];
  }

  /**
   * Método para editar un miembro.
   * @param miembro Miembro a editar.
   */
  editarMiembro(miembro: Miembro): void {
    const nuevoNombre = prompt('Editar Nombre:', miembro.nombre);
    if (nuevoNombre === null || nuevoNombre.trim() === '') {
      // El usuario canceló la edición o ingresó un nombre vacío
      return;
    }

    const nuevoCorreo = prompt('Editar Correo:', miembro.correo);
    if (nuevoCorreo === null || nuevoCorreo.trim() === '') {
      // El usuario canceló la edición o ingresó un correo vacío
      return;
    }

    // Validación básica del correo electrónico
    const correoValido = this.validarCorreo(nuevoCorreo);
    if (!correoValido) {
      this.snackBar.open('Correo electrónico inválido.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    // Actualizar el miembro con los nuevos datos
    miembro.nombre = nuevoNombre.trim();
    miembro.correo = nuevoCorreo.trim();
    this.applyFilter(); // Reaplicar el filtro para actualizar la tabla

    this.snackBar.open(`Miembro ${miembro.nombre} actualizado.`, 'Cerrar', {
      duration: 3000,
    });
  }

  /**
   * Método para eliminar un miembro individual.
   * @param miembro Miembro a eliminar.
   */
  eliminarMiembro(miembro: Miembro): void {
    const confirmacion = confirm(`¿Estás seguro de eliminar a ${miembro.nombre}?`);
    if (confirmacion) {
      this.dataSource = this.dataSource.filter((m) => m !== miembro);
      this.applyFilter(); // Reaplica el filtro para actualizar la vista
      this.snackBar.open(`Miembro ${miembro.nombre} eliminado.`, 'Cerrar', {
        duration: 3000,
      });
    }
  }

  /**
   * Cierra el modal y devuelve los datos actualizados.
   */
  cerrarModal(): void {
    this.dialogRef.close(this.dataSource);
  }

  /**
   * Valida el formato de un correo electrónico.
   * @param correo Correo electrónico a validar.
   * @returns Verdadero si el correo es válido, falso en caso contrario.
   */
  validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }
}
