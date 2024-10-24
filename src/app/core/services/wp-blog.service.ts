// src/app/services/wp-posts.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { WPCategory, WPPost } from '../models/wp.model';

@Injectable({
  providedIn: 'root',
})
export class WpPostsService {
  private apiUrl = 'https://arcodavella.gal/wp-json/wp/v2'; // Reemplaza con la URL de tu sitio WordPress

  // Caché en memoria
  private categoriesCache: WPCategory[] | null = null;
  private postsCache: { [key: string]: { posts: WPPost[]; totalPages: number } } = {};

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las categorías con caché en memoria.
   */
  getCategories(): Observable<WPCategory[]> {
    if (this.categoriesCache) {
      // Retornar los datos del caché en memoria
      return of(this.categoriesCache);
    } else {
      const params = new HttpParams().set('per_page', '100'); // Ajusta 'per_page' según tus necesidades
      return this.http.get<WPCategory[]>(`${this.apiUrl}/categories`, { params }).pipe(
        tap((categories) => (this.categoriesCache = categories)),
        catchError(this.handleError),
      );
    }
  }

  /**
   * Obtener el ID de una categoría dado su slug.
   * Utiliza el caché de categorías si está disponible.
   * @param slug Slug de la categoría.
   */
  getCategoryIdBySlug(slug: string): Observable<number | null> {
    if (this.categoriesCache) {
      const category = this.categoriesCache.find((cat) => cat.slug === slug);
      return of(category ? category.id : null);
    } else {
      const params = new HttpParams().set('slug', slug).set('per_page', '1');
      return this.http.get<WPCategory[]>(`${this.apiUrl}/categories`, { params }).pipe(
        map((categories) => (categories.length > 0 ? categories[0].id : null)),
        tap((id) => {
          if (id !== null && this.categoriesCache) {
            // Opcional: agregar la categoría al caché si no está presente
            // Nota: Esto asume que tienes acceso a más detalles de la categoría
          }
        }),
        catchError(this.handleError),
      );
    }
  }

  /**
   * Obtener posts con filtros opcionales por categoría y término de búsqueda.
   * Implementa caché en memoria basado en los parámetros de la consulta.
   * @param categoryId ID de la categoría.
   * @param searchTerm Término de búsqueda por título.
   * @param page Número de página para la paginación.
   */
  getPosts(
    categoryId?: number,
    searchTerm?: string,
    page: number = 1,
  ): Observable<{ posts: WPPost[]; totalPages: number }> {
    // Crear una clave única para la caché basada en los parámetros
    const cacheKey = `category:${categoryId || 'all'}-search:${searchTerm || 'none'}-page:${page}`;

    if (this.postsCache[cacheKey]) {
      // Retornar los datos del caché en memoria
      return of(this.postsCache[cacheKey]);
    } else {
      let params = new HttpParams()
        .set('per_page', '9') // Número de posts por página
        .set('page', page.toString())
        .set('_embed', ''); // Para incluir featured media

      if (categoryId && categoryId !== 0) {
        params = params.set('categories', categoryId.toString());
      }

      if (searchTerm) {
        params = params.set('search', searchTerm);
      }

      return this.http.get<WPPost[]>(`${this.apiUrl}/posts`, { params, observe: 'response' }).pipe(
        map((response) => {
          const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
          const result = { posts: response.body || [], totalPages };
          // Almacenar en el caché en memoria
          this.postsCache[cacheKey] = result;
          return result;
        }),
        catchError(this.handleError),
      );
    }
  }

  /**
   * Limpia el caché de categorías.
   */
  limpiarCategoriasCache() {
    this.categoriesCache = null;
  }

  /**
   * Limpia el caché de posts.
   * Opcionalmente, puedes limpiar todo el caché o solo partes específicas.
   */
  limpiarPostsCache() {
    this.postsCache = {};
  }

  /**
   * Manejo de errores HTTP.
   * @param error Error de la respuesta HTTP.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching data from WordPress API', error);
    return throwError(() => new Error('Error fetching data from WordPress API'));
  }
}
