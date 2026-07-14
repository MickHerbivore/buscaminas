import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconCellComponent } from './icon-cell.component';

describe('IconCellComponent', () => {
  let component: IconCellComponent;
  let fixture: ComponentFixture<IconCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCellComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconCellComponent);
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
