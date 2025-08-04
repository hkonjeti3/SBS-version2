import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfWithinComponent } from './tf-within.component';

describe('TfWithinComponent', () => {
  let component: TfWithinComponent;
  let fixture: ComponentFixture<TfWithinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TfWithinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TfWithinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
