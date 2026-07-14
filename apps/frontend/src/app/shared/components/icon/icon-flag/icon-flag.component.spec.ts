import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconFlagComponent } from './icon-flag.component';

describe('IconFlagComponent', () => {
  let component: IconFlagComponent;
  let fixture: ComponentFixture<IconFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFlagComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(IconFlagComponent);
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
