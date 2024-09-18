import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

// Definimos la interfaz para los usuarios
interface Usuario {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-busqueda-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './busqueda-usuarios.component.html',
  styleUrl: './busqueda-usuarios.component.scss',
})
export class BusquedaUsuariosComponent {
  searchQuery = '';

  // Lista de usuarios simulada usando la interfaz Usuario
  usuarios: Usuario[] = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Ana Gómez' },
    { id: 3, nombre: 'Luis Rodríguez' },
    { id: 4, nombre: 'Carla Fernández' },
    { id: 5, nombre: 'Miguel Sánchez' },
    // Añadir más usuarios simulados
  ];

  // Lista de usuarios seleccionados, con el tipo Usuario
  selectedUsers: Usuario[] = [];

  // Output para enviar la lista de usuarios seleccionados al componente padre
  @Output() usuariosSeleccionados = new EventEmitter<Usuario[]>();

  // Lista de usuarios filtrados
  filteredUsers: Usuario[] = [];

  // Este método actualiza la lista de usuarios filtrados conforme cambia la búsqueda
  onSearchQueryChange() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = [];
    } else {
      this.filteredUsers = this.usuarios.filter(
        (user) =>
          user.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) && !this.selectedUsers.includes(user),
      );
    }
  }

  // Añadir usuario a la lista de seleccionados y enviar al componente padre
  addUser(user: Usuario) {
    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user);
      this.usuariosSeleccionados.emit(this.selectedUsers); // Emitimos los usuarios seleccionados al componente padre
    }
    this.searchQuery = ''; // Limpiamos la búsqueda después de seleccionar
    this.filteredUsers = []; // Limpiamos el dropdown después de añadir
  }

  // Eliminar un usuario de la lista seleccionada y actualizar el componente padre
  removeUser(user: Usuario) {
    this.selectedUsers = this.selectedUsers.filter((u) => u !== user);
    this.usuariosSeleccionados.emit(this.selectedUsers); // Emitimos los usuarios seleccionados actualizados
  }
}
