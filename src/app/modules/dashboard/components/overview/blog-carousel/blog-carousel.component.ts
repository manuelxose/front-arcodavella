import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { WPPost, WPCategory } from 'src/app/core/models/wp.model';
import { WpPostsService } from 'src/app/core/services/wp-blog.service';

interface BlogPost {
  titulo: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-blog-carousel',
  templateUrl: './blog-carousel.component.html',
  styleUrls: ['./blog-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class BlogCarouselComponent implements OnInit {
  properties: any[] = [
    {
      titulo: 'Cómo elegir la mejor propiedad para invertir',
      descripcion: 'Consejos y estrategias para seleccionar propiedades con alto potencial de retorno.',
      imagen: 'https://via.placeholder.com/400x200',
    },
    {
      titulo: 'Tendencias del mercado inmobiliario 2024',
      descripcion: 'Análisis de las últimas tendencias que están moldeando el sector inmobiliario.',
      imagen: 'https://via.placeholder.com/400x200',
    },
    {
      titulo: 'Guía para primerizos en la compra de vivienda',
      descripcion: 'Pasos esenciales para quienes compran su primera casa.',
      imagen: 'https://via.placeholder.com/400x200',
    },
    {
      titulo: 'Beneficios de contratar un agente inmobiliario',
      descripcion: 'Razones por las cuales un agente inmobiliario puede facilitar tu compra o venta.',
      imagen: 'https://via.placeholder.com/400x200',
    },
    // Agrega más entradas de blog según sea necesario
  ];

  @ViewChild('carousel', { static: true }) carousel!: ElementRef;

  isDown = false;
  startX: number = 0;
  scrollLeftPos: number = 0;

  // Elementos de lectura de post de wp

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

  // Fin de elementos de lectura del post

  constructor(private wpPostsService: WpPostsService) {}

  ngOnInit(): void {
    this.fetchCategoriesAndPosts();
  }

  scrollLeftFunc() {
    this.carousel.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  }

  scrollRightFunc() {
    this.carousel.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  }

  onWheelEvent(event: WheelEvent) {
    this.carousel.nativeElement.scrollLeft += event.deltaY;
  }

  // Métodos para manejo de arrastre con el mouse
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    this.carousel.nativeElement.classList.add('active');
    this.startX = event.pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeftPos = this.carousel.nativeElement.scrollLeft;
  }

  onMouseLeave(event: MouseEvent) {
    this.isDown = false;
    this.carousel.nativeElement.classList.remove('active');
  }

  onMouseUp(event: MouseEvent) {
    this.isDown = false;
    this.carousel.nativeElement.classList.remove('active');
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();
    const x = event.pageX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Ajusta la velocidad de desplazamiento
    this.carousel.nativeElement.scrollLeft = this.scrollLeftPos - walk;
  }

  // Métodos para manejo de arrastre táctil
  onTouchStart(event: TouchEvent) {
    this.isDown = true;
    this.carousel.nativeElement.classList.add('active');
    this.startX = event.touches[0].pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeftPos = this.carousel.nativeElement.scrollLeft;
  }

  onTouchEnd(event: TouchEvent) {
    this.isDown = false;
    this.carousel.nativeElement.classList.remove('active');
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDown) return;
    const x = event.touches[0].pageX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Ajusta la velocidad de desplazamiento
    this.carousel.nativeElement.scrollLeft = this.scrollLeftPos - walk;
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
        console.log(this.posts);
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
}
