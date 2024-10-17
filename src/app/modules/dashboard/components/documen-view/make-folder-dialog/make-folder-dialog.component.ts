import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-make-folder-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, BreadcrumbComponent, CommonModule, FormsModule, MatInputModule],
  templateUrl: './make-folder-dialog.component.html',
  styleUrl: './make-folder-dialog.component.scss',
})
export class MakeFolderDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MakeFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombreCarpeta: string },
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
