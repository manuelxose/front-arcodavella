import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor],
})
export class DeleteConfirmationModalComponent {
  @Input() selectedUsers: any[] = []; // Lista de usuarios seleccionados
  @Output() confirmDelete = new EventEmitter<void>();
  isVisible = false;

  constructor() {
    this.selectedUsers = [];
  }

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  onConfirmDelete() {
    this.confirmDelete.emit();
    this.close();
  }
}
