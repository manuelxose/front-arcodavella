import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewwUserApprovalsComponent } from './new-user-approvals.component';

describe('NewwUserApprovalsComponent', () => {
  let component: NewwUserApprovalsComponent;
  let fixture: ComponentFixture<NewwUserApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewwUserApprovalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewwUserApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
