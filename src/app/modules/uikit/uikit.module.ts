import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UikitRoutingModule } from './uikit-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './pages/table/table.component';
import { TableActionComponent } from './pages/table/components/table-action/table-action.component';
import { TableFooterComponent } from './pages/table/components/table-footer/table-footer.component';
import { UploadCsvModalComponent } from 'src/app/shared/components/upload-csv-modal/upload-csv-modal.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { AddMemberModalComponent } from 'src/app/shared/components/add-member-modal/add-member-modal.component';
import { TableRowComponent } from './pages/table/components/table-row/table-row.component';

@NgModule({
  declarations: [TableComponent],
  imports: [
    AngularSvgIconModule,
    FormsModule,
    CommonModule,
    UikitRoutingModule,
    AngularSvgIconModule.forRoot(), // Configures angular-svg-icon with provider
    TableActionComponent,
    TableFooterComponent,
    UploadCsvModalComponent,
    DeleteConfirmationModalComponent,
    AddMemberModalComponent,
    TableActionComponent,
    TableRowComponent,
  ],
  exports: [],
})
export class UikitModule {}
