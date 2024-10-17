import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingsService } from 'src/app/core/services/listings.service';
import { TableColumn, TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [TableComponent, CommonModule, FormsModule],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.scss',
})
export class ListingsComponent {
  selectedListType = 'solicita-informacion';

  data = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '555-1234', status: 'Activo' },
    { id: 2, name: 'María García', email: 'maria@example.com', phone: '555-5678', status: 'Inactivo' },
    // ... más contactos
  ];

  yourColumnsArray: TableColumn[] = [
    { header: 'ID', field: 'id', sortable: true, type: 'number' },
    { header: 'Nombre', field: 'name', sortable: true, type: 'text' },
    { header: 'Email', field: 'email', sortable: true, type: 'text' },
    { header: 'Teléfono', field: 'phone', sortable: false, type: 'text' },
    { header: 'Estado', field: 'status', sortable: true, type: 'text' },
  ];

  selectedContacts: any[] = [];

  constructor(private readonly listingSvc: ListingsService) {}

  onSelectionChange(selected: any[]) {
    this.selectedContacts = selected;
  }

  addItem() {
    // Lógica para agregar un nuevo contacto
    console.log('Agregar nuevo contacto');
  }

  deleteSelected() {
    // Lógica para eliminar los contactos seleccionados
    if (this.selectedContacts.length > 0) {
      this.data = this.data.filter((item: any) => !item.selected);
      this.selectedContacts = [];
    } else {
      console.log('Por favor, seleccione al menos un contacto para eliminar.');
    }
  }

  downloadExcel() {
    // Lógica para descargar datos en Excel
    console.log('Descargar Excel');
  }

  onListTypeChange(event: any) {
    const selectedValue = event.target.value;
    // Lógica para actualizar los datos mostrados en la tabla según el tipo seleccionado
    this.updateTableData(selectedValue);
  }

  updateTableData(listType: string) {
    // Aquí implementas cómo cambiar los datos de la tabla según el tipo de listado
    // Por ejemplo:
    if (listType === 'solicita-informacion') {
      this.data = this.data;
    }
  }
}
