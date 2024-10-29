import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss',
})
export class DocumentationComponent {
  constructor(private router: Router) {}

  navigateBack(): void {
    this.router.navigate(['/auth/sign-up']); // Reemplaza '/ruta-anterior' con la ruta deseada
  }
}
