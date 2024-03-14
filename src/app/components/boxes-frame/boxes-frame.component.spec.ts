import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesFrameComponent } from './boxes-frame.component';

describe('BoxesFrameComponent', () => {
  let component: BoxesFrameComponent;
  let fixture: ComponentFixture<BoxesFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxesFrameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxesFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
