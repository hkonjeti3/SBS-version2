import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfOutsideComponent } from './tf-outside.component';

describe('TfOutsideComponent', () => {
  let component: TfOutsideComponent;
  let fixture: ComponentFixture<TfOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TfOutsideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TfOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
