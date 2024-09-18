import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorListasComponent } from './selector-listas.component';

describe('SelectorListasComponent', () => {
  let component: SelectorListasComponent;
  let fixture: ComponentFixture<SelectorListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorListasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
