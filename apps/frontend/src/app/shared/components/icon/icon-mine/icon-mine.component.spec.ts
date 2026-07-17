import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconMineComponent } from './icon-mine.component';

describe('IconMineComponent', () => {
  let component: IconMineComponent;
  let fixture: ComponentFixture<IconMineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMineComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconMineComponent);
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
