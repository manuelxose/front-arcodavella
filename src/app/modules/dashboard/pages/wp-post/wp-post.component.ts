// src/app/components/wp-posts/wp-posts.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WPPost, WPCategory } from 'src/app/core/models/wp.model';
import { WpPostsService } from 'src/app/core/services/wp-blog.service';

@Component({
  selector: 'app-wp-posts',
  templateUrl: './wp-post.component.html',
  styleUrls: ['./wp-post.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WpPostComponent implements OnInit {
  posts: WPPost[] = [];
  categories: WPCategory[] = []; // Categorías principales
  subCategories: WPCategory[] = []; // Subcategorías basadas en la categoría seleccionada
  selectedCategory: string = 'all'; // 'all', 'noticias', 'blog', etc.
  selectedSubCategory: string = 'all'; // 'all' y subcategorías
  searchTerm: string = '';
  sortByDate: 'latest' | 'oldest' = 'latest'; // Definición de sortByDate
  isLoading: boolean = false;
  errorMessage: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private wpPostsService: WpPostsService) {}

  ngOnInit(): void {
    this.fetchCategoriesAndPosts();
  }

  /**
   * Obtener categorías principales y luego obtener posts.
   */
  fetchCategoriesAndPosts(): void {
    this.isLoading = true;
    this.wpPostsService.getCategories().subscribe({
      next: (categories) => {
        // Filtrar categorías principales (parent = 0)
        this.categories = categories.filter((cat) => cat.parent === 0);
        this.fetchSubCategories(); // Inicialmente no hay subcategorías seleccionadas
        this.fetchPosts();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  /**
   * Obtener subcategorías basadas en la categoría seleccionada.
   */
  fetchSubCategories(): void {
    if (this.selectedCategory === 'all') {
      this.subCategories = [];
      this.selectedSubCategory = 'all';
      return;
    }

    const selectedCat = this.categories.find((cat) => cat.slug === this.selectedCategory);
    if (selectedCat) {
      this.wpPostsService.getCategories().subscribe({
        next: (categories) => {
          this.subCategories = categories.filter((cat) => cat.parent === selectedCat.id);
          this.selectedSubCategory = 'all';
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
    }
  }

  /**
   * Obtener posts con los filtros actuales.
   */
  fetchPosts(): void {
    let categoryId: number | null = null;

    if (this.selectedCategory !== 'all') {
      const category = this.categories.find((cat) => cat.slug === this.selectedCategory);
      categoryId = category ? category.id : null;
    }

    if (this.selectedSubCategory !== 'all') {
      const subCategory = this.subCategories.find((cat) => cat.slug === this.selectedSubCategory);
      categoryId = subCategory ? subCategory.id : categoryId;
    }

    this.wpPostsService.getPosts(categoryId ?? undefined, this.searchTerm, this.currentPage).subscribe({
      next: (data) => {
        this.posts = this.sortPosts(data.posts);
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  /**
   * Ordenar los posts según sortByDate.
   * @param posts Array de posts a ordenar.
   * @returns Array de posts ordenados.
   */
  sortPosts(posts: WPPost[]): WPPost[] {
    return posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortByDate === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * Manejar cambios en los filtros.
   */
  onFilterChange(): void {
    this.currentPage = 1; // Reiniciar a la primera página al cambiar filtros
    this.fetchSubCategories();
    this.fetchPosts();
  }

  /**
   * Manejar cambio de página en la paginación.
   * @param page Número de página seleccionado.
   */
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchPosts();
  }

  /**
   * Generar un array de números para las páginas de paginación.
   * @returns Array de números de página.
   */
  getPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  /**
   * Formatear la fecha al formato deseado.
   * @param dateStr Fecha en formato string.
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Manejar errores al cargar imágenes.
   * @param post Post que contiene la imagen.
   */
  handleImageError(post: WPPost): void {
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
      post._embedded['wp:featuredmedia'][0].source_url = 'assets/icons/image-placeholder.svg';
    }
  }
}
