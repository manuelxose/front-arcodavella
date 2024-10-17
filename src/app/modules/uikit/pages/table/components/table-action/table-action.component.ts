import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-table-action',
  standalone: true,
  imports: [AngularSvgIconModule, CommonModule],
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.scss',
})
export class TableActionComponent {
  @Input() totalUsers = 0; // Total de usuarios
  @Input() displayedUsers = 0; // Usuarios mostrados actualmente

  @Output() onSearch = new EventEmitter<string>();
  @Output() onFilter = new EventEmitter<{ status: string | null; sort: string | null }>();

  public search(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement ? inputElement.value : '';
    this.onSearch.emit(query);
  }

  // Emitimos los filtros seleccionados (estado o sort)
  public filter(status: string | null, sort: string | null) {
    this.onFilter.emit({ status, sort });
  }

  // Cambio de filtro
  public onFilterChange(event: Event, type: 'status' | 'sort') {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement ? selectElement.value : null;

    if (type === 'status') {
      this.filter(value, null); // Filtra por estado
    } else if (type === 'sort') {
      this.filter(null, value); // Ordena por ascendente o descendente
    }
  }
}
