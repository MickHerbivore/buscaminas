import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconCompassComponent } from './icon-compass.component';

describe('IconCompassComponent', () => {
  let component: IconCompassComponent;
  let fixture: ComponentFixture<IconCompassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCompassComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconCompassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders an svg', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
