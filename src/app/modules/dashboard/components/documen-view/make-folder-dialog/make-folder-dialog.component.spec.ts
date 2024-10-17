import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeFolderDialogComponent } from './make-folder-dialog.component';

describe('MakeFolderDialogComponent', () => {
  let component: MakeFolderDialogComponent;
  let fixture: ComponentFixture<MakeFolderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeFolderDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
