import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
interface Promocion {
  titulo: string;
  descripcion: string;
  imagen: string;
  precio: number;
  habitaciones: number;

  ubicacion: string;
}

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.scss',
})
export class PromocionesComponent {
  promociones: Promocion[] = [
    {
      titulo: 'Promoción Navia, Vigo',
      descripcion: 'Viviendas de 2 y 3 dormitorios en una ubicación privilegiada.',
      imagen: '../../../../../assets/bg/arcodavella-banner-navia.jpg',
      precio: 200000,
      ubicacion: 'Navia, Vigo',
      habitaciones: 3,
      // Agrega más detalles si es necesario
    },
    // Puedes agregar más promociones si las hay
  ];
  posiblesPromociones: Promocion[] = [];

  constructor(readonly router: Router) {}

  ngOnInit(): void {}
}
