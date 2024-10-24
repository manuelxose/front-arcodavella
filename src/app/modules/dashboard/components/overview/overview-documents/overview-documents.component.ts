import { Component, OnInit } from '@angular/core';
import { NgStyle, CurrencyPipe, CommonModule } from '@angular/common';
import { DocumentosService } from 'src/app/core/services/documentos.service';
import { WPMedia } from 'src/app/core/models/wp.model';
interface Document {
  nombre: string;
  descripcion: string;
  icono: string; // Nombre del icono para SVG
}
@Component({
  selector: 'overview-documents-card',
  templateUrl: './overview-documents.component.html',
  styleUrls: ['./overview-documents.scss'],
  standalone: true,
  imports: [NgStyle, CurrencyPipe, CommonModule],
})
export class OverviewDocumentsComponent implements OnInit {
  documentos: Document[] = [
    {
      nombre: 'Contrato de Arrendamiento',
      descripcion: 'Contrato firmado el 10/05/2023.',
      icono: 'document-text',
    },
    {
      nombre: 'Ficha Técnica',
      descripcion: 'Detalles técnicos de la propiedad.',
      icono: 'clipboard-list',
    },
    {
      nombre: 'Certificado Energético',
      descripcion: 'Emisión válida hasta 2025.',
      icono: 'fire',
    },
    // Agrega más documentos según sea necesario
  ];

  isLoading: boolean = false;
  selectedMediaType: 'all' | 'image' | 'application/pdf' = 'application/pdf';
  mediaItems: WPMedia[] = [];
  errorMessage: string = '';

  constructor(private readonly documentosService: DocumentosService) {}

  ngOnInit(): void {
    this.fetchMedia();
  }

  getIconPath(iconName: string): string {
    const icons: { [key: string]: string } = {
      file: 'M9 12h6m-3-3v6m4 4H5a2 2 0 01-2-2V6a2 2 0 012-2h4l2 2h5a2 2 0 012 2v8a2 2 0 01-2 2z',
      'clipboard-list': 'M9 12h6m-3-3v6m4 4H5a2 2 0 01-2-2V6a2 2 0 012-2h4l2 2h5a2 2 0 012 2v8a2 2 0 01-2 2z',
      fire: 'M12 22s8-4 8-10c0-5-4.5-9-10-9S2 7 2 12c0 6 8 10 8 10z',
      // Agrega más iconos según sea necesario
    };
    return icons[iconName] || '';
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
}
