import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  header: string;
  field: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean';
}

export interface TableData {
  selected?: boolean; // Campo 'selected' opcional
  [key: string]: string | number | boolean | Date | null | undefined; // Permitir también 'undefined' en la firma de índice
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() title = 'Tabla Genérica';
  @Input() selectable = false;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() initialPageSize = 10;
  @Output() selectionChange = new EventEmitter<TableData[]>();

  allSelected = false;
  searchQuery = '';
  sortColumn = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize: number = this.initialPageSize;
  statusFilter = '';
  uniqueStatuses: string[] = [];

  filteredData: TableData[] = [];
  paginatedData: TableData[] = [];

  ngOnInit() {
    this.initializeTable();
  }

  ngOnChanges() {
    this.initializeTable();
  }

  private initializeTable() {
    this.filteredData = [...this.data];
    this.extractUniqueStatuses();
    this.applyFilters();
    this.applySorting();
    this.updatePagination();
  }

  toggleAllSelection(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.allSelected = inputElement.checked;
    this.paginatedData.forEach((item) => (item.selected = this.allSelected));
    this.emitSelection();
  }

  onSelectionChange() {
    this.emitSelection();
  }

  private emitSelection() {
    const selectedItems = this.data.filter((item) => item.selected);
    this.selectionChange.emit(selectedItems);
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.applyFilters();
    this.applySorting();
    this.updatePagination();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
    this.applySorting();
    this.updatePagination();
  }

  private applyFilters() {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredData = this.data.filter((item) =>
        this.columns.some((column) => {
          const value = item[column.field];
          return value && value.toString().toLowerCase().includes(query);
        }),
      );
    } else {
      this.filteredData = [...this.data];
    }

    if (this.statusFilter) {
      this.filteredData = this.filteredData.filter((item) => item['status'] === this.statusFilter);
    }
  }

  onSort(column: TableColumn) {
    if (!column.sortable) return;
    if (this.sortColumn === column.field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.field;
      this.sortOrder = 'asc';
    }
    this.applySorting();
    this.updatePagination();
  }

  private applySorting() {
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];

        if (valueA == null) return 1;
        if (valueB == null) return -1;

        let comparison = 0;
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          comparison = valueA - valueB;
        } else if (valueA instanceof Date && valueB instanceof Date) {
          comparison = valueA.getTime() - valueB.getTime();
        } else {
          comparison = valueA.toString().localeCompare(valueB.toString());
        }

        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredData.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  extractUniqueStatuses() {
    const statuses = this.data.map((item) => String(item['status'])).filter((status) => status != null);
    this.uniqueStatuses = Array.from(new Set(statuses));
  }

  getMinValue() {
    return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
  }
}
