import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Titre2Component } from './titre2.component';

describe('Titre2Component', () => {
  let component: Titre2Component;
  let fixture: ComponentFixture<Titre2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Titre2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Titre2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
