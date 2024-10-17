import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { documentationResolver } from './documentation.resolver';

describe('documentationResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => documentationResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
