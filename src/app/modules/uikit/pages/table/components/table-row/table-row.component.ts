import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { ErrorHandlerService } from 'src/app/core/services/errorHandler.service';
import { User } from 'src/app/core/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Member } from 'src/app/core/models/member.model';

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

  showProfile(): void {
    this.userService.getUserProfileByEmail(this.user.email).subscribe({
      next: (response: { profile: User }) => {
        console.log('en la row: ', response.profile); // Verifica que los datos que llegan son correctos
        this.router.navigate(['/dashboard/member-profile'], {
          state: { userProfile: response.profile }, // Pasa los datos a través de la propiedad `state`
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Manejo de errores
      },
    });
  }
}
