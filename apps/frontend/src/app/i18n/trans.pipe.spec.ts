import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { TransPipe } from './trans.pipe';

describe('TransPipe', () => {
  let service: TranslationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('creates an instance', () => {
    const pipe = TestBed.runInInjectionContext(() => new TransPipe());
    expect(pipe).toBeTruthy();
  });

  it('translates a key', () => {
    const pipe = TestBed.runInInjectionContext(() => new TransPipe());
    expect(pipe.transform('action.reset')).toBe('Reiniciar');
  });

  it('reflects locale changes', () => {
    const pipe = TestBed.runInInjectionContext(() => new TransPipe());
    expect(pipe.transform('action.reset')).toBe('Reiniciar');
    service.toggle();
    expect(pipe.transform('action.reset')).toBe('Reset');
  });
});
