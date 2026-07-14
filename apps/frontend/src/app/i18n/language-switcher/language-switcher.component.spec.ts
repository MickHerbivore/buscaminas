import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslationService } from '../translation.service';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let service: TranslationService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    service = TestBed.inject(TranslationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('shows ES code when locale is es', () => {
    expect(service.locale()).toBe('es');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent).toContain('ES');
  });

  it('toggles locale on click', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();
    expect(service.locale()).toBe('en');
    expect(btn.textContent).toContain('EN');
  });
});
