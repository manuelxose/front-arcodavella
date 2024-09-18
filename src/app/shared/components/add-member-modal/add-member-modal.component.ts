import { CommonModule, NgClass } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.scss'],
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
})
export class AddMemberModalComponent {
  @Output() addMember = new EventEmitter<{
    name: string;
    email: string;
    role: string;
    dni: string;
    memberNumber: string;
    status: string;
  }>();

  isVisible = false;

  // Modelos de formulario
  newMember = {
    name: '',
    email: '',
    role: '',
    dni: '',
    memberNumber: '',
    status: 'active',
  };

  // Estado de validación
  validationErrors = {
    name: false,
    email: false,
    role: false,
    dni: false,
    memberNumber: false,
  };

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.resetForm();
  }

  // Validación de los campos
  validateFields(): boolean {
    this.validationErrors = {
      name: !this.newMember.name.trim(),
      email: !this.validateEmail(this.newMember.email),
      role: !this.newMember.role,
      dni: !this.newMember.dni.trim(),
      memberNumber: !this.newMember.memberNumber.trim(),
    };

    return !Object.values(this.validationErrors).includes(true);
  }

  // Validar correo electrónico
  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  onConfirmAdd() {
    if (this.validateFields()) {
      this.addMember.emit(this.newMember);
      toast.success('New member added successfully!', { position: 'bottom-right' });
      this.close();
    } else {
      toast.error('Please correct the errors in the form.', { position: 'bottom-right' });
    }
  }

  resetForm() {
    this.newMember = {
      name: '',
      email: '',
      role: '',
      dni: '',
      memberNumber: '',
      status: 'active',
    };
    this.validationErrors = {
      name: false,
      email: false,
      role: false,
      dni: false,
      memberNumber: false,
    };
  }
}
