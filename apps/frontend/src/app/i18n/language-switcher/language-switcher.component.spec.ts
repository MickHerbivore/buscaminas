import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslationService } from '../translation.service';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let service: TranslationService;

  beforeEach(async () => {
    localStorage.clear();
    spyOnProperty(navigator, 'language', 'get').and.returnValue('es-ES');
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

  it('renders an option per supported locale', () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toEqual(['es', 'en', 'zh']);
  });

  it('reflects the active locale as the selected option', () => {
    service.setLocale('zh');
    fixture.detectChanges();
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');
    expect(select.value).toBe('zh');
  });

  it('changes locale when the select changes', () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');
    select.value = 'en';
    select.dispatchEvent(new Event('change'));
    expect(service.locale()).toBe('en');
  });
});
