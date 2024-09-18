import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorMensajeComponent } from './editor-mensaje.component';

describe('EditorMensajeComponent', () => {
  let component: EditorMensajeComponent;
  let fixture: ComponentFixture<EditorMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorMensajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
