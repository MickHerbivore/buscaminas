import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let browserLang: string;

  beforeEach(() => {
    localStorage.clear();
    browserLang = 'es-ES';
    spyOnProperty(navigator, 'language', 'get').and.callFake(
      () => browserLang,
    );
    TestBed.configureTestingModule({});
  });

  function makeService(): TranslationService {
    return TestBed.runInInjectionContext(() => new TranslationService());
  }

  it('defaults to browser locale when nothing is stored', () => {
    browserLang = 'es-ES';
    expect(makeService().locale()).toBe('es');
  });

  it('detects zh from a Chinese browser locale', () => {
    browserLang = 'zh-CN';
    expect(makeService().locale()).toBe('zh');
  });

  it('detects en from an English browser locale', () => {
    browserLang = 'en-US';
    expect(makeService().locale()).toBe('en');
  });

  it('falls back to es for unsupported browser locales', () => {
    browserLang = 'fr-FR';
    expect(makeService().locale()).toBe('es');
  });

  it('stored locale wins over browser language', () => {
    localStorage.setItem('buscaminas-locale', 'en');
    browserLang = 'zh-CN';
    expect(makeService().locale()).toBe('en');
  });

  it('setLocale updates locale and persists to localStorage', () => {
    const service = makeService();
    service.setLocale('zh');
    expect(service.locale()).toBe('zh');
    expect(localStorage.getItem('buscaminas-locale')).toBe('zh');
  });

  it('returns the translation for the current locale', () => {
    const service = makeService();
    expect(service.t('action.reset')).toBe('Reiniciar');
  });

  it('returns the zh string after setLocale', () => {
    const service = makeService();
    service.setLocale('zh');
    expect(service.t('action.reset')).toBe('重新开始');
  });
});
