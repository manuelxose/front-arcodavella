import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalEdicionComponent, Miembro } from '../modal-edicion/modal-edicion.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ListingsService } from 'src/app/core/services/listings.service';

interface Lista {
  nombre: string;
  destinatarios: number;
  miembros: Miembro[];
}

@Component({
  selector: 'app-selector-listas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ModalEdicionComponent,
    MatCheckboxModule,
  ],
  templateUrl: './selector-listas.component.html',
  styleUrls: ['./selector-listas.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorListasComponent),
      multi: true,
    },
  ],
})
export class SelectorListasComponent implements ControlValueAccessor {
  listasSeleccionadas: Lista[] = []; // Listas seleccionadas en el formato requerido
  dropdownOpen: boolean = false;
  isDisabled: boolean = false;

  listas: Lista[] = []; // Listas disponibles

  constructor(
    private eRef: ElementRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private readonly notSvc: NotificationService,
    private readonly listSvc: ListingsService,
  ) {
    this.loadLists();
  }

  private loadLists(): void {
    this.notSvc.getAllMembers().subscribe((res) => {
      // Load lists into the component in the exact required format
      this.listas.push({
        nombre: 'Socios Arcodavella',
        destinatarios: res.members.length,
        miembros: res.members,
      });

      console.log('Loaded lists:', res);
    });
    this.listSvc.getAllListings().subscribe((res) => {
      console.log('Loaded listings:', res);
      this.listas.push({
        nombre: 'Listas de Contacto',
        destinatarios: res.contacts.length,
        miembros: res.contacts,
      });
    });
  }

  // Implementación de ControlValueAccessor
  writeValue(value: Lista[]): void {
    this.listasSeleccionadas = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChange = (value: Lista[]) => {};
  onTouched = () => {};

  toggleDropdown(): void {
    if (this.isDisabled) return;
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (this.dropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.onTouched();
    }
  }

  abrirModal(lista: Lista): void {
    if (!lista) {
      this.snackBar.open('La lista seleccionada no existe.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const dialogRef = this.dialog.open(ModalEdicionComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { miembros: lista.miembros },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        lista.miembros = result;
        lista.destinatarios = lista.miembros.length;
        this.propagateChange();
      }
    });
  }

  toggleListaSeleccionada(lista: Lista): void {
    if (this.isListaSeleccionada(lista)) {
      this.eliminarListaSeleccionada(lista);
    } else {
      this.agregarListaSeleccionada(lista);
    }
    this.propagateChange();
  }

  private isListaSeleccionada(lista: Lista): boolean {
    return this.listasSeleccionadas.some((l) => l.nombre === lista.nombre);
  }

  private agregarListaSeleccionada(lista: Lista): void {
    // Directly add the list in the correct format without altering its properties
    this.listasSeleccionadas = [...this.listasSeleccionadas, lista];
  }

  eliminarListaSeleccionada(lista: Lista): void {
    // Remove the list from the selected lists, keeping the format intact
    this.listasSeleccionadas = this.listasSeleccionadas.filter((l) => l.nombre !== lista.nombre);
    this.propagateChange();
  }

  private propagateChange(): void {
    // Pass the lists back to the parent in the exact required format
    this.onChange(this.listasSeleccionadas);
  }
}
