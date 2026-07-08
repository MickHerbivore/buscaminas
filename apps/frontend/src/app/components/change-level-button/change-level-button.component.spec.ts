import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLevelButtonComponent } from './change-level-button.component';

describe('ChangeLevelButtonComponent', () => {
  let component: ChangeLevelButtonComponent;
  let fixture: ComponentFixture<ChangeLevelButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLevelButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeLevelButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
