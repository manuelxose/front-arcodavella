// src/app/components/member-profile/member-profile.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faUniversity,
  faEye,
  faEyeSlash,
  faEdit,
  faCamera,
  faUpload,
  faCalendarAlt,
  faBriefcase,
  faFileAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Member } from 'src/app/core/models/member.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-profile',
  standalone: true,
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
  imports: [CommonModule, FormsModule, AngularSvgIconModule, FontAwesomeModule, ReactiveFormsModule],
})
export class MemberProfileComponent implements OnInit, OnDestroy {
  // Íconos de FontAwesome
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;
  faUniversity = faUniversity;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faEdit = faEdit;
  faCamera = faCamera;
  faUpload = faUpload;
  faCalendarAlt = faCalendarAlt;
  faBriefcase = faBriefcase;
  faFileAlt = faFileAlt;
  faTrash = faTrash;

  member: Member = {} as Member;
  user: User = {} as User;
  memberForm!: FormGroup;
  showAccountNumber = false;
  isEditing = false;

  // Manejo de imagen de perfil
  profileImageUrl = 'assets/images/default-profile.png';
  isUploadingImage = false;

  // Manejo de documentos
  uploadedDocuments: Array<{ name: string; url: string }> = [];
  isUploadingDocument: boolean = false;

  // Búsqueda de documentos
  searchTerm: string = '';

  // Suscripción para evitar memory leaks
  private userSubscription!: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private readonly userService: UserService) {}

  ngOnInit(): void {
    this.initializeForm();

    this.user = this.authService.userValue!;
    this.loadMemberData();

    // Cargar documentos
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    // Revocar todas las Blob URLs para liberar memoria
    this.uploadedDocuments.forEach((doc) => {
      URL.revokeObjectURL(doc.url);
    });

    // Cancelar la suscripción para prevenir memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private initializeForm() {
    this.memberForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      memberNumber: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{9,15}$')]],
      address: [''],
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{20}$')]],
      occupation: [''],
      dateOfBirth: ['', Validators.required],
      // dni: [''], // Descomenta si 'dni' es editable
    });
  }

  private loadMemberData() {
    console.log('user: ', this.user);

    if (this.user) {
      this.memberForm.patchValue({
        name: this.user.name || '',
        memberNumber: this.user.memberNumber || '',
        email: this.user.email || '',
        phone: this.user.phone || '',
        address: this.user.address || '',
        accountNumber: this.user.accountNumber || '',
        occupation: this.user.occupation || '',
        dateOfBirth: this.user.dateOfBirth ? this.formatDate(this.user.dateOfBirth) : '',
        // dni: this.user.dni || '', // Descomenta si 'dni' es editable
      });
    }

    // Actualizar la imagen de perfil
    if (this.user.img) {
      this.profileImageUrl = this.user.img;
    } else if (this.memberForm.get('name')?.value) {
      this.profileImageUrl =
        'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.memberForm.get('name')?.value);
    }
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  toggleAccountVisibility() {
    this.showAccountNumber = !this.showAccountNumber;
  }

  onEdit() {
    this.isEditing = true;
    this.memberForm.enable();

    // Deshabilitar campos que no deben ser editables
    this.memberForm.get('name')?.disable();
    this.memberForm.get('memberNumber')?.disable();
    // Deshabilita otros campos si es necesario
  }

  onCancel() {
    this.isEditing = false;
    this.memberForm.reset();
    this.memberForm.disable();
    this.loadMemberData();
  }

  onSave() {
    if (this.memberForm.valid) {
      console.log('Datos guardados:', this.memberForm.value);

      // Construir la carga útil combinando datos del formulario y del usuario autenticado
      const updatedData: any = {
        id: this.user.id, // Asegúrate de que 'id' corresponde con el backend
        email: this.memberForm.get('email')?.value,
        phone: this.memberForm.get('phone')?.value,
        address: this.memberForm.get('address')?.value,
        accountNumber: this.memberForm.get('accountNumber')?.value,
        memberNumber: this.memberForm.get('memberNumber')?.value,
        name: this.memberForm.get('name')?.value,
        // occupation: this.memberForm.get('occupation')?.value,
        // dateOfBirth: this.memberForm.get('dateOfBirth')?.value,
        // dni: this.memberForm.get('dni')?.value, // Incluye si 'dni' es editable
        status: this.user.status, // Incluye si es necesario
        role: this.user.role, // Incluye si es necesario
      };

      // Enviar los datos actualizados al servidor
      this.userService.updateUserProfile(updatedData).subscribe({
        next: (response) => {
          console.log('Datos actualizados:', response);
          this.isEditing = false;
          this.authService.updateUserValue(updatedData);
        },
        error: (error) => {
          console.error('Error al actualizar los datos:', error);
        },
      });
    } else {
      this.memberForm.markAllAsTouched();
    }
  }

  // Manejo del cambio de imagen de perfil
  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploadingImage = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
        this.isUploadingImage = false;

        // Opcional: Subir la imagen al servidor
        // this.userService.uploadProfileImage(file).subscribe(response => {
        //   this.profileImageUrl = response.imageUrl;
        // });
      };
      reader.readAsDataURL(file);
    }
  }

  // Manejo de la subida de documentos utilizando Blob URLs
  onDocumentUpload(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0 && !this.isUploadingDocument) {
      this.isUploadingDocument = true;
      let uploadCount = 0;
      const totalFiles = files.length;

      Array.from(files).forEach((file) => {
        const blobUrl = URL.createObjectURL(file);
        this.uploadedDocuments.push({
          name: file.name,
          url: blobUrl,
        });
        uploadCount++;

        if (uploadCount === totalFiles) {
          this.isUploadingDocument = false;
        }

        // Opcional: Subir el documento al servidor
        // this.userService.uploadDocument(file).subscribe(response => {
        //   this.uploadedDocuments.push({ name: response.fileName, url: response.fileUrl });
        // });
      });
    }
  }

  // Método para cargar documentos (mock o desde la base de datos)
  loadDocuments() {
    // Aquí podrías llamar a un servicio para obtener los documentos desde la base de datos
    // Por ahora, usaremos documentos mock
    const mockDocuments = [
      { name: 'Contrato de Adhesión.pdf', url: 'assets/documents/Contrato-de-Adhesion.pdf' },
      { name: 'Identificación Oficial.jpg', url: 'assets/documents/Identificacion-Oficial.jpg' },
      { name: 'Comprobante de Domicilio.pdf', url: 'assets/documents/Comprobante-de-Domicilio.pdf' },
      { name: 'Recibo de Nómina.pdf', url: 'assets/documents/Recibo-de-Nomina.pdf' },
      { name: 'Contrato de Arrendamiento.docx', url: 'assets/documents/Contrato-de-Arrendamiento.docx' },
    ];

    // Simular la carga de documentos con un retardo
    setTimeout(() => {
      this.uploadedDocuments = mockDocuments;
    }, 1000);
  }

  // Métodos para obtener mensajes de error
  getEmailError() {
    const emailControl = this.memberForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'El email es obligatorio';
    }
    if (emailControl?.hasError('email')) {
      return 'Introduce un email válido';
    }
    return '';
  }

  getPhoneError() {
    const phoneControl = this.memberForm.get('phone');
    if (phoneControl?.hasError('pattern')) {
      return 'Introduce un número de teléfono válido';
    }
    return '';
  }

  getAccountError() {
    const accountControl = this.memberForm.get('accountNumber');
    if (accountControl?.hasError('required')) {
      return 'El número de cuenta es obligatorio';
    }
    if (accountControl?.hasError('pattern')) {
      return 'El número de cuenta debe tener 20 dígitos';
    }
    return '';
  }

  getDateOfBirthError() {
    const dobControl = this.memberForm.get('dateOfBirth');
    if (dobControl?.hasError('required')) {
      return 'La fecha de nacimiento es obligatoria';
    }
    return '';
  }

  // Método para eliminar un documento
  onDeleteDocument(documentName: string) {
    const index = this.uploadedDocuments.findIndex((doc) => doc.name === documentName);
    if (index !== -1) {
      // Revocar la Blob URL para liberar memoria
      URL.revokeObjectURL(this.uploadedDocuments[index].url);
      // Eliminar el documento de la lista
      this.uploadedDocuments.splice(index, 1);

      // Opcional: Eliminar el documento del servidor
      // this.userService.deleteDocument(documentName).subscribe(response => {
      //   console.log('Documento eliminado:', response);
      // });
    }
  }

  // Métodos auxiliares para determinar el tipo de archivo
  getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'other';
    }
  }

  isImage(fileName: string): boolean {
    const mimeType = this.getMimeType(fileName);
    return mimeType === 'image';
  }

  isPdf(fileName: string): boolean {
    const mimeType = this.getMimeType(fileName);
    return mimeType === 'application/pdf';
  }

  // Getter para obtener los documentos filtrados según searchTerm
  get filteredDocuments() {
    if (!this.searchTerm.trim()) {
      return this.uploadedDocuments;
    }
    return this.uploadedDocuments.filter((doc) => doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}
