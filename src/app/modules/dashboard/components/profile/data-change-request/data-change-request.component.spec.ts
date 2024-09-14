import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChangeRequestComponent } from './data-change-request.component';

describe('DataChangeRequestComponent', () => {
  let component: DataChangeRequestComponent;
  let fixture: ComponentFixture<DataChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataChangeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
