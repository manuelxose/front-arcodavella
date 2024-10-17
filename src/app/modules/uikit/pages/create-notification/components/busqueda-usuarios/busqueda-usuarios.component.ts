import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';

// Definimos la interfaz para los usuarios
interface User {
  id: string;
  name: string;
  email: string;
  memberNumer?: string;
  dni?: string;
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
  usuarios: User[] = [];

  // Lista de usuarios seleccionados, con el tipo Usuario
  selectedUsers: User[] = [];

  // Output para enviar la lista de usuarios seleccionados al componente padre
  @Output() usuariosSeleccionados = new EventEmitter<User[]>();

  // Lista de usuarios filtrados
  filteredUsers: User[] = [];

  constructor(private readonly notificationSvc: NotificationService) {
    this.notificationSvc.getAllUsers().subscribe((res) => {
      this.usuarios = res.users;
      console.log('la rs:', this.usuarios);
    });
  }

  // Este método actualiza la lista de usuarios filtrados conforme cambia la búsqueda
  onSearchQueryChange() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = [];
    } else {
      this.filteredUsers = this.usuarios.filter(
        (user) =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) && !this.selectedUsers.includes(user),
      );
    }
  }

  // Añadir usuario a la lista de seleccionados y enviar al componente padre
  addUser(user: User) {
    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user);
      console.log(this.selectedUsers);
      this.usuariosSeleccionados.emit(this.selectedUsers); // Emitimos los usuarios seleccionados al componente padre
    }
    this.searchQuery = ''; // Limpiamos la búsqueda después de seleccionar
    this.filteredUsers = []; // Limpiamos el dropdown después de añadir
  }

  // Eliminar un usuario de la lista seleccionada y actualizar el componente padre
  removeUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter((u) => u !== user);
    this.usuariosSeleccionados.emit(this.selectedUsers); // Emitimos los usuarios seleccionados actualizados
  }
}
