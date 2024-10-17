import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Carpeta {
  nombre: string;
  // Otros campos relevantes
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input() path: Carpeta[] = [];
  @Output() navigateEvent = new EventEmitter<number>();

  navigateTo(index: number) {
    this.navigateEvent.emit(index);
  }
}
