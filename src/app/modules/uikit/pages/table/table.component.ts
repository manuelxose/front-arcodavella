import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Member } from './model/member.model';
import { FormsModule } from '@angular/forms';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { TableActionComponent } from './components/table-action/table-action.component';
import { toast } from 'ngx-sonner';
import { UploadCsvModalComponent } from 'src/app/shared/components/upload-csv-modal/upload-csv-modal.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { environment } from 'src/environments/environment';
import { AddMemberModalComponent } from 'src/app/shared/components/add-member-modal/add-member-modal.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
    TableActionComponent,
    UploadCsvModalComponent,
    DeleteConfirmationModalComponent,
    AddMemberModalComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  users = signal<Member[]>([]); // Almacena los usuarios que se van a mostrar en la página actual
  allUsers: Member[] = []; // Almacena todos los usuarios cargados desde el servidor
  totalUsers = 0; // Total de usuarios cargados
  currentPage = 1; // Página actual
  pageSize = 10; // Número de usuarios por página
  searchQuery = ''; // Búsqueda actual
  sortColumn = 'memberNumber'; // Columna predeterminada para ordenación
  sortOrder = 'asc'; // Orden ascendente por defecto
  statusFilter: string | null = null; // Filtro de estado
  apiUrl = environment.apiUrl;
  displayedUsers = 10; // Número de usuarios que se muestran

  @ViewChild('deleteModal') deleteModal!: DeleteConfirmationModalComponent; // Modal de confirmación de eliminación
  selectedUsers: Member[] = []; // Usuarios seleccionados para eliminar

  constructor(private http: HttpClient) {
    this.fetchAllUsers(); // Cargar todos los usuarios al iniciar
  }

  ngOnInit() {}

  /**
   * Cargar todos los usuarios desde el servidor.
   */
  private fetchAllUsers() {
    this.http.get<{ members: Member[] }>(`${this.apiUrl}/member/all`, { withCredentials: true }).subscribe({
      next: (data) => this.processUsers(data.members),
      error: (error) => this.handleRequestError(error, 'An error occurred while fetching users'),
    });
  }

  /**
   * Procesar los usuarios recibidos del servidor.
   */
  private processUsers(members: Member[]) {
    this.allUsers = this.sortMembers(members);
    this.totalUsers = members.length;
    this.updateDisplayedUsers();
  }

  /**
   * Ordenar los usuarios por memberNumber.
   */
  private sortMembers(members: Member[]): Member[] {
    return members.sort((a, b) => this.compareMemberNumbers(a, b));
  }

  /**
   * Comparar y ordenar los usuarios por memberNumber.
   */
  private compareMemberNumbers(a: Member, b: Member): number {
    const memberA = parseInt(a.memberNumber);
    const memberB = parseInt(b.memberNumber);

    const isMemberANumeric = !isNaN(memberA);
    const isMemberBNumeric = !isNaN(memberB);

    if (isMemberANumeric && isMemberBNumeric) {
      return this.sortOrder === 'asc' ? memberA - memberB : memberB - memberA;
    }

    return isMemberANumeric ? -1 : 1;
  }

  /**
   * Abre el modal de confirmación de eliminación.
   */
  public deleteSelectedUsers() {
    if (this.selectedUsers.length > 0) {
      this.deleteModal.open();
    } else {
      this.showToast('Please select at least one member to delete.', 'error');
    }
  }

  /**
   * Confirmar la eliminación de los usuarios seleccionados de forma secuencial.
   */
  public async confirmDelete() {
    for (const user of this.selectedUsers) {
      await this.deleteUser(user.id);
    }

    this.showToast('Selected members have been deleted.', 'success');
    this.fetchAllUsers(); // Recargar la lista de usuarios después de eliminar
  }

  /**
   * Método para eliminar un usuario individual.
   */
  private deleteUser(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiUrl}/member/${id}`, { withCredentials: true }).subscribe({
        next: () => resolve(),
        error: (error) => {
          this.handleRequestError(error, `Error deleting member with id ${id}`);
          reject(error);
        },
      });
    });
  }

  /**
   * Mostrar un toast de éxito o error.
   */
  private showToast(message: string, type: 'success' | 'error') {
    const toastOptions = {
      position: 'bottom-right' as const, // Asegura que el valor de posición sea correcto
    };
    type === 'success' ? toast.success(message, toastOptions) : toast.error(message, toastOptions);
  }

  /**
   * Actualizar los usuarios que se muestran en la página actual.
   */
  private updateDisplayedUsers() {
    let filteredUsers = this.applyFilters([...this.allUsers]);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.users.set(filteredUsers.slice(startIndex, endIndex));
    this.totalUsers = filteredUsers.length;
  }

  /**
   * Aplicar los filtros de búsqueda y estado a los usuarios.
   */
  private applyFilters(users: Member[]): Member[] {
    if (this.statusFilter) {
      users = users.filter((user) => user.status === this.statusFilter);
    }
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      users = users.filter((user) =>
        [user.name, user.dni, user.email].some((field) => field?.toLowerCase().includes(query)),
      );
    }
    return this.sortMembers(users);
  }

  /**
   * Cambiar el número de usuarios mostrados.
   */
  public onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  /**
   * Cambiar la página actual.
   */
  public onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedUsers();
  }

  /**
   * Filtrar usuarios por búsqueda y estado.
   */
  public onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  public onFilter(filter: { status: string | null; sort: string | null }) {
    this.statusFilter = filter.status;

    // Actualizar el valor de sortOrder basado en el filtro
    if (filter.sort) {
      this.sortOrder = filter.sort; // Puede ser 'asc' o 'desc'
    }

    this.updateDisplayedUsers(); // Actualiza los usuarios mostrados
  }

  /**
   * Seleccionar o deseleccionar usuarios en la tabla.
   */
  public toggleUsers(checked: boolean) {
    this.users.update((users) => users.map((user) => ({ ...user, selected: checked })));
    this.selectedUsers = checked ? [...this.users()] : [];
  }

  /**
   * Manejar la selección de un usuario.
   */
  public onUserSelectionChange(user: Member) {
    user.selected
      ? this.selectedUsers.push(user)
      : (this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id));
  }

  /**
   * Manejar errores en las solicitudes HTTP.
   */
  private handleRequestError(error: any, message: string) {
    toast.error(message, {
      position: 'bottom-right',
      description: error.message,
      action: {
        label: 'Retry',
        onClick: () => this.fetchAllUsers(),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  public handleAddMember(newMember: {
    name: string;
    email: string;
    role: string;
    dni: string;
    memberNumber: string;
    status: string;
  }) {
    console.log('llega al evento');
    // Verificar que los campos necesarios estén completos
    if (
      !newMember.name ||
      !newMember.email ||
      !newMember.role ||
      !newMember.dni ||
      !newMember.memberNumber ||
      !newMember.status
    ) {
      this.showToast('Please fill in all the fields to add a new member.', 'error');
      return;
    }

    // Enviar solicitud POST para agregar el nuevo miembro al servidor
    this.http.post(`${this.apiUrl}/member/create`, newMember, { withCredentials: true }).subscribe({
      next: () => {
        this.showToast('New member added successfully.', 'success');
        this.fetchAllUsers(); // Recargar la lista de usuarios después de añadir un nuevo miembro
      },
      error: (error) => {
        this.handleRequestError(error, 'Error adding new member');
      },
    });
  }
}
