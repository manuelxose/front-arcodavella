import { Component, OnInit } from '@angular/core';
import { BlogCarouselComponent } from '../../components/overview/blog-carousel/blog-carousel.component';
import { NftAuctionsTableComponent } from '../../components/overview/nft-auctions-table/nft-auctions-table.component';
import { NftChartCardComponent } from '../../components/overview/nft-chart-card/nft-chart-card.component';
import { OverviewDocumentsComponent } from '../../components/overview/overview-documents/overview-documents.component';
import { OverviewHeaderComponent } from '../../components/overview/overview-header/overview-header.component';
import { OverviewProfileCardComponent } from '../../components/overview/overview-profile-card/profile-card-component';
import { Nft } from '../../models/nft';
import { PromocionesComponent } from '../../components/overview/promociones/promociones.component';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { WPMedia } from 'src/app/core/models/wp.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overwiew.component.html',
  standalone: true,
  imports: [
    OverviewHeaderComponent,
    OverviewDocumentsComponent,
    OverviewProfileCardComponent,
    NftChartCardComponent,
    NftAuctionsTableComponent,
    BlogCarouselComponent,
    PromocionesComponent,
  ],
})
export class OverViewComponent implements OnInit {
  nft: Array<Nft>;
  user: User = {} as User;
  documentos: WPMedia = {} as WPMedia;

  constructor(
    private readonly authSvc: AuthService,
    private router: Router, // Inyecta Router para acceder a los datos del estado de navegación
  ) {
    this.nft = [
      {
        id: 34356771,
        title: 'Girls of the Cartoon Universe',
        creator: 'Jhon Doe',
        instant_price: 4.2,
        price: 187.47,
        ending_in: '06h 52m 47s',
        last_bid: 0.12,
        image: './assets/images/img-01.jpg',
        avatar: './assets/avatars/avt-01.jpg',
      },
      {
        id: 34356772,
        title: 'Pupaks',
        price: 548.79,
        last_bid: 0.35,
        image: './assets/images/img-02.jpg',
      },
      {
        id: 34356773,
        title: 'Seeing Green collection',
        price: 234.88,
        last_bid: 0.15,
        image: './assets/images/img-03.jpg',
      },
    ];
  }

  ngOnInit(): void {
    // Verificar si hay datos en el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { userProfile: User };
    this.user = this.authSvc.userValue!;

    console.log('Datos del usuario pasados al perfil: ', this.user);
  } // Utility function to replace 'pending' with null
}
