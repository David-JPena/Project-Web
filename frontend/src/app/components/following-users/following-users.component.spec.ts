import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingUsersComponent } from './following-users.component';

describe('FollowingUsersComponent', () => {
  let component: FollowingUsersComponent;
  let fixture: ComponentFixture<FollowingUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowingUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FollowingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
