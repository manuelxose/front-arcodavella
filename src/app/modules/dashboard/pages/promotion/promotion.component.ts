import { Component, OnInit } from '@angular/core';
import { Promotion } from '../../models/promotion';
import { CommonModule } from '@angular/common';
import { BlogCarouselComponent } from '../../components/overview/blog-carousel/blog-carousel.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
  standalone: true,
  imports: [CommonModule, BlogCarouselComponent],
})
export class PromotionComponent implements OnInit {
  promotion: Promotion = {
    title: 'Promoción PAU de Navia',
    subtitle: 'Viviendas cooperativas en Galicia',
    description:
      'Arco da Vella presenta un innovador proyecto de viviendas cooperativas en el PAU de Navia, Vigo. Diseñado para fomentar la sostenibilidad, la inclusión y el bienestar comunitario.',
    mainImage: 'https://arcodavella.gal/wp-content/uploads/2024/04/image-9.jpg',
    images: [
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
    ],
    features: [
      'Diseño moderno y sostenible',
      'Viviendas de alta calidad',
      'Colaboración y apoyo mutuo entre socios',
      'Construcción sostenible',
      'Flexibilidad en personalización',
    ],
    amenities: [
      'Zonas ajardinadas',
      'Áreas comunes para la comunidad',
      'Accesibilidad total',
      'Espacios para actividades sociales',
      'Eficiencia energética',
    ],
    detailedInformation: [
      'Nuestra misión es facilitar el acceso a viviendas de calidad, promoviendo la colaboración y el apoyo mutuo entre nuestros socios. Únete a nosotros y forma parte de una iniciativa que valora la sostenibilidad, la inclusión y el bienestar comunitario.',
      'Arco da Vella es más que una cooperativa de viviendas; es un aliado en tu búsqueda de un hogar sostenible y asequible en Galicia. Con valores centrados en la comunidad y el medio ambiente, te acompañamos en cada paso hacia la vivienda de tus sueños.',
      'La Promoción PAU de Navia es el corazón de nuestra oferta en Arco da Vella. Aquí, cada vivienda es diseñada con el futuro en mente, ofreciendo espacios que son tanto funcionales como inspiradores. Nuestro proyecto no solo busca cumplir con las expectativas actuales de confort y diseño, sino que también se anticipa a las necesidades futuras de nuestros socios.',
      'Descubre nuestras soluciones prefabricadas, donde la eficiencia se encuentra con la personalización. Estas viviendas están construidas con precisión y cuidado, asegurando una calidad constante y una reducción significativa en los tiempos de construcción.',
      'La calidad del diseño es primordial en Arco da Vella. Cada elemento, desde la elección de materiales hasta la disposición de los espacios, está pensado para crear un ambiente que no solo sea estéticamente agradable, sino que también promueva la funcionalidad y el bienestar.',
      'Nos comprometemos a utilizar solo materiales de alta gama en nuestras construcciones. Esto garantiza no solo la durabilidad y la seguridad de tu hogar, sino que también asegura que cada vivienda sea un espacio donde la calidad se siente en cada rincón.',
    ],
    pricingPlans: [
      {
        type: 'Apartamento de 2 habitaciones',
        price: 'Desde 180.000€',
        features: ['75 m²', '1 baño', 'Cocina equipada', 'Terraza'],
      },
      {
        type: 'Apartamento de 3 habitaciones',
        price: 'Desde 240.000€',
        features: ['100 m²', '2 baños', 'Cocina equipada', 'Balcón amplio'],
      },
      {
        type: 'Dúplex de 4 habitaciones',
        price: 'Desde 320.000€',
        features: ['150 m²', '3 baños', 'Cocina moderna', 'Terraza privada'],
      },
    ],
    faqs: [
      {
        question: '¿Qué es una cooperativa de viviendas?',
        answer:
          'Es una asociación de personas que se unen para construir viviendas, compartiendo costes y decisiones para beneficio mutuo.',
      },
      {
        question: '¿Cómo puedo unirme a Arco da Vella?',
        answer:
          'Puedes solicitar información y nos pondremos en contacto contigo para guiarte en el proceso de asociación.',
      },
      {
        question: '¿Qué beneficios ofrecen a los socios?',
        answer:
          'Acceso a viviendas de calidad a precios asequibles, participación en decisiones y promoción de valores comunitarios.',
      },
      {
        question: '¿Qué garantías ofrecen para mi inversión?',
        answer:
          'Contamos con seguros y garantías que protegen tu inversión durante todo el proceso de construcción y adquisición.',
      },
      {
        question: '¿Cómo contribuyen al desarrollo sostenible?',
        answer:
          'Aplicamos prácticas de construcción sostenible y utilizamos materiales eco-amigables para reducir el impacto ambiental.',
      },
    ],
    testimonials: [
      {
        name: 'Faro de Vigo',
        source: 'Periódico Local',
        feedback: '“Una cooperativa que lucha contra las condiciones abusivas del mercado.”',
      },
      {
        name: 'La Voz de Galicia',
        source: 'Diario Regional',
        feedback: '“Así son los pisos que proyectan las cooperativas en el barrio vigués de Navia.”',
      },
      {
        name: 'Faro de Vigo',
        source: 'Periódico Local',
        feedback: '“La cooperativa de viviendas que apuesta por los precios bajos.”',
      },
    ],
    developerInfo: {
      name: 'Arco da Vella',
      logo: 'https://arcodavella.gal/wp-content/uploads/2021/09/logo-arcodavella.png',
      description:
        'Arco da Vella es una cooperativa de viviendas en Galicia comprometida con facilitar el acceso a viviendas de calidad, promoviendo la sostenibilidad y el bienestar comunitario.',
    },
    constructionProgress: [
      {
        stage: 'Planificación',
        completion: 100,
      },
      {
        stage: 'Permisos y Licencias',
        completion: 80,
      },
      {
        stage: 'Construcción',
        completion: 40,
      },
      {
        stage: 'Finalización',
        completion: 0,
      },
    ],
    nearbyPlaces: [
      {
        name: 'Centro de Vigo',
        distance: '15 minutos',
        category: 'Ciudad',
      },
      {
        name: 'Playa de Samil',
        distance: '10 minutos',
        category: 'Playa',
      },
      {
        name: 'Parque de Navia',
        distance: '5 minutos',
        category: 'Parque',
      },
    ],
    contact: {
      phone: '+34 987 654 321',
      email: 'info@arcodavella.gal',
      address: 'Calle de la Cooperativa, 123, Vigo, Galicia',
      mapLink:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11947.262577981193!2d-8.745!3d42.240!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd258abdb6b2a9e7%3A0x9e2b0f1c1c8a1c31!2sNavia%2C%20Pontevedra!5e0!3m2!1sen!2ses!4v1617281234567!5m2!1sen!2ses',
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
