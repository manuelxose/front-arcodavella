import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-table-header]',
  standalone: true,
  imports: [AngularSvgIconModule, CommonModule],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss',
})
export class TableHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();
  @Output() onSort = new EventEmitter<string>();

  public toggle(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.onCheck.emit(value);
  }

  public sort(column: string) {
    this.onSort.emit(column);
  }
}
