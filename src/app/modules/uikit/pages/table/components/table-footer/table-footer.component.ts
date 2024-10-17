import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-table-footer',
  standalone: true,
  imports: [AngularSvgIconModule, CommonModule],
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.scss',
})
export class TableFooterComponent {
  @Input() totalUsers = 0; // Total de usuarios
  @Input() pageSize = 10; // Tamaño de página
  @Input() currentPage = 1; // Página actual

  @Output() onPageChange = new EventEmitter<number>();
  @Output() onPageSizeChange = new EventEmitter<number>();

  // Calcula el total de páginas
  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }

  // Calcula el índice del primer usuario mostrado en la página actual
  get firstUserIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  // Calcula el índice del último usuario mostrado en la página actual
  get lastUserIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalUsers);
  }

  // Cambia de página, pero valida que no se exceda del rango válido
  public changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.onPageChange.emit(page);
    }
  }

  // Cambia el tamaño de la página
  public changePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedSize = selectElement ? parseInt(selectElement.value, 10) : this.pageSize;
    this.onPageSizeChange.emit(selectedSize);
  }
}
