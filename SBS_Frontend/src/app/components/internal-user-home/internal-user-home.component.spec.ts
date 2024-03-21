import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserHomeComponent } from './internal-user-home.component';

describe('InternalUserHomeComponent', () => {
  let component: InternalUserHomeComponent;
  let fixture: ComponentFixture<InternalUserHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalUserHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternalUserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
