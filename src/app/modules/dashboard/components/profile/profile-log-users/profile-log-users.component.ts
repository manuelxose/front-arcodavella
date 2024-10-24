import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-log-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-log-users.component.html',
  styleUrl: './profile-log-users.component.scss',
})
export class ProfileLogUsersComponent implements OnInit {
  @Input() userLogins!: {
    email: string;
    id: string;
    ipAddress: string;
    timestamp: string;
    status?: string;
  }[];

  constructor() {}

  ngOnInit(): void {
    console.log('userLogins', this.userLogins);

    //Añadimos el estado suceso a los registros de login de usuarios
    this.userLogins.forEach((user) => {
      user.status = 'Success';
    });
  }

  /**
   * Método para filtrar registros de login de usuarios.
   * @param status Filtro de estado.
   */
  filterUsers(status: string) {
    if (status) {
      this.userLogins = this.userLogins.filter((user) => user.status === status);
    }
  }

  /** Método para ordenar los registros de login de usuarios. */
  sortUsers() {
    this.userLogins.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /** Método para invertir el orden de los registros de login de usuarios. */
  invertSort() {
    this.userLogins.reverse();
  }

  ngOnChanges() {
    console.log('ngOnChanges', this.userLogins);
  }
}
