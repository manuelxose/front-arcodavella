import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Document {
  name: string;
  category: string;
  uploadedDate: string;
  size: string;
  icon: string;
  extension: string;
}

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor],
})
export class DocumentosComponent {
  // Datos simulados
  documents: Document[] = [
    {
      name: 'Informe Financiero Anual',
      category: 'Finanzas',
      uploadedDate: '15 de Agosto de 2023',
      size: '1.5 MB',
      icon: 'assets/icons/pdf-icon.svg',
      extension: 'PDF',
    },
    {
      name: 'Política de Recursos Humanos',
      category: 'Recursos Humanos',
      uploadedDate: '22 de Septiembre de 2023',
      size: '850 KB',
      icon: 'assets/icons/word-icon.svg',
      extension: 'DOCX',
    },
    {
      name: 'Balance de Gastos Mensuales',
      category: 'Finanzas',
      uploadedDate: '30 de Julio de 2023',
      size: '450 KB',
      icon: 'assets/icons/excel-icon.svg',
      extension: 'XLSX',
    },
    {
      name: 'Contrato Legal Actualizado',
      category: 'Legal',
      uploadedDate: '5 de Octubre de 2023',
      size: '2 MB',
      icon: 'assets/icons/pdf-icon.svg',
      extension: 'PDF',
    },
    {
      name: 'Guía de Tecnología 2023',
      category: 'Tecnología',
      uploadedDate: '10 de Julio de 2023',
      size: '1.2 MB',
      icon: 'assets/icons/word-icon.svg',
      extension: 'DOCX',
    },
  ];

  // Filtros
  searchTerm: string = '';
  selectedCategory: string = 'all';
  sortByDate: string = 'latest';

  // Método para filtrar documentos
  filteredDocuments(): Document[] {
    let filteredDocs = this.documents;

    // Filtrar por búsqueda de texto
    if (this.searchTerm) {
      filteredDocs = filteredDocs.filter((doc) => doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    // Filtrar por categoría
    if (this.selectedCategory !== 'all') {
      filteredDocs = filteredDocs.filter((doc) => doc.category.toLowerCase() === this.selectedCategory);
    }

    // Ordenar por fecha
    filteredDocs = filteredDocs.sort((a, b) => {
      const dateA = new Date(a.uploadedDate.split(' de ').reverse().join('-')).getTime();
      const dateB = new Date(b.uploadedDate.split(' de ').reverse().join('-')).getTime();
      return this.sortByDate === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return filteredDocs;
  }
}
