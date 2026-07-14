import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('defaults to es when no stored locale', () => {
    expect(service.locale()).toBe('es');
  });

  it('toggles between es and en', () => {
    service.toggle();
    expect(service.locale()).toBe('en');
    service.toggle();
    expect(service.locale()).toBe('es');
  });

  it('returns es string for es locale', () => {
    expect(service.t('action.reset')).toBe('Reiniciar');
  });

  it('returns en string after toggle', () => {
    service.toggle();
    expect(service.t('action.reset')).toBe('Reset');
  });

  it('persists locale to localStorage', (done) => {
    service.setLocale('en');
    setTimeout(() => {
      expect(localStorage.getItem('buscaminas-locale')).toBe('en');
      done();
    }, 0);
  });
});
