import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Member } from '../../model/member.model';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { APP_BASE_HREF, CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { ErrorHandlerService } from 'src/app/core/services/errorHandler.service';

@Component({
  selector: '[app-table-row]',
  standalone: true,
  providers: [
    { provide: APP_BASE_HREF, useValue: '/uikit/' },
    SvgIconRegistryService, // Provide the service here
  ],
  imports: [FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.scss',
})
export class TableRowComponent implements OnInit {
  @Input() user: Member = <Member>{};
  @Output() selectionChange = new EventEmitter<Member>();
  // add injectors

  constructor(
    private router: Router,
    private userService: UserService,
    private errorHandler: ErrorHandlerService, // Inyectamos el servicio de manejo de errores
  ) {
    console.log('en la row');
  }

  ngOnInit(): void {}

  onSelectionChange() {
    this.selectionChange.emit(this.user);
  }

  showProfile() {
    this.userService.getUserProfileByEmail(this.user.email).subscribe({
      next: (response: any) => {
        console.log('en la row: ', response); // Verifica que los datos que llegan son correctos
        this.router.navigate(['/dashboard/member-profile'], {
          state: { userProfile: response }, // Pasa los datos a través de la propiedad `state`
        });
      },
      error: (error: any) => {
        this.errorHandler.handleHttpError(error); // Manejo de errores
      },
    });
  }
}
