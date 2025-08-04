import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranHisComponent } from './tran-his.component';

describe('TranHisComponent', () => {
  let component: TranHisComponent;
  let fixture: ComponentFixture<TranHisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranHisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TranHisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
