import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingI } from 'src/app/core/models/listing.model';
import { ExcelService } from 'src/app/core/services/excel.service';
import { ListingsService } from 'src/app/core/services/listings.service';
import { TableColumn, TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [TableComponent, CommonModule, FormsModule],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.scss',
  providers: [DatePipe],
})
export class ListingsComponent {
  selectedListType = 'solicita-informacion';

  data: ListingI[] = [];

  yourColumnsArray: TableColumn[] = [
    // { header: 'ID', field: 'id', sortable: true, type: 'number' },
    { header: 'Nombre', field: 'nombre', sortable: true, type: 'text' },
    { header: 'Email', field: 'correo', sortable: true, type: 'text' },
    { header: 'Teléfono', field: 'telefono', sortable: false, type: 'text' },
    { header: 'Fecha', field: 'fechaRegistro', sortable: true, type: 'date' },
  ];

  selectedContacts: any[] = [];

  constructor(
    private readonly listingSvc: ListingsService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
  ) {
    this.loadListings();
  }

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

  private updateTableData(listType: string) {
    // Aquí implementas cómo cambiar los datos de la tabla según el tipo de listado
    // Por ejemplo:
    if (listType === 'solicita-informacion') {
      this.data = this.data;
    }
  }

  onListTypeChange(event: any) {
    const selectedValue = event.target.value;
    // Lógica para actualizar los datos mostrados en la tabla según el tipo seleccionado
    this.updateTableData(selectedValue);
  }

  private loadListings() {
    this.listingSvc.getListings().subscribe((data) => {
      console.log('data: ', data);

      // Mapear los contactos para transformar la fechaRegistro
      this.data = data.contacts
        .map((contact: any) => {
          return {
            ...contact, // Mantener todas las propiedades existentes del contacto
            fechaRegistro: this.datePipe.transform(contact.fechaRegistro, 'short'), // Transformar fechaRegistro
          };
        })
        .sort((a: any, b: any) => {
          // Convertir las fechas de nuevo a Date para compararlas
          const dateA = new Date(a.fechaRegistro).getTime();
          const dateB = new Date(b.fechaRegistro).getTime();
          return dateB - dateA; // Ordenar de reciente a más antiguo
        });

      console.log(this.data);
    });
  }
  downloadExcel() {
    if (this.data.length > 0) {
      // Definir los encabezados basados en las columnas configuradas
      const headers = this.yourColumnsArray.map((col) => col.header);

      // Preparar los datos para la exportación como un array de objetos
      const data = this.data.map((row) => {
        const rowData: Record<string, string | number> = {};

        this.yourColumnsArray.forEach((col) => {
          // Aquí aseguramos que col.field es una propiedad válida de ListingI
          const field = col.field as keyof ListingI;
          rowData[col.header] = row[field] || ''; // Asigna '' si el valor es undefined
        });

        return rowData;
      });

      console.log('Headers:', headers);
      console.log('Data:', data);

      // Generar el nombre del archivo con la fecha actual
      const fileName = `Lista_Contactos_${new Date().toISOString().split('T')[0]}`;

      // Llamar al servicio para descargar el archivo Excel
      this.excelService.downloadExcel(data, headers, fileName);
    } else {
      console.log('No hay datos para exportar.');
    }
  }
}
