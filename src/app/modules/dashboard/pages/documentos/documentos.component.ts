// src/app/documentos/documentos.component.ts

import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WPMedia } from 'src/app/core/models/wp.model';
import { DocumentosService } from 'src/app/core/services/documentos.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DocumentosComponent implements OnInit {
  mediaItems: WPMedia[] = [];
  searchTerm: string = '';
  selectedMediaType: 'all' | 'image' | 'application/pdf' = 'all';
  sortByDate: 'latest' | 'oldest' = 'latest';

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private documentosService: DocumentosService) {}

  ngOnInit(): void {
    this.fetchMedia();
  }

  /** Obtener medios desde el servicio */
  fetchMedia(): void {
    this.isLoading = true;
    this.documentosService.getMedia(this.selectedMediaType).subscribe({
      next: (media: WPMedia[]) => {
        this.mediaItems = media;
        this.isLoading = false;
        media.forEach((element) => {
          if (element.media_type === 'file') console.log(element);
        });
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  /** Formatear la fecha */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  /** Método para filtrar medios */
  get filteredMedia(): WPMedia[] {
    let filtered = this.mediaItems;

    // Filtrar por búsqueda de texto
    if (this.searchTerm) {
      filtered = filtered.filter((media) => media.title.rendered.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    // Ordenar por fecha
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortByDate === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }

  /** Manejar cambios en los filtros */
  onFilterChange(): void {
    this.fetchMedia();
  }
}
