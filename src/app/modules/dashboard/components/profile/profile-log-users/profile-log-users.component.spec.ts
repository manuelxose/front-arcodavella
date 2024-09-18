import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLogUsersComponent } from './profile-log-users.component';

describe('ProfileLogUsersComponent', () => {
  let component: ProfileLogUsersComponent;
  let fixture: ComponentFixture<ProfileLogUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLogUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileLogUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
