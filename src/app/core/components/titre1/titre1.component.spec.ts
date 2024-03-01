import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Titre1Component } from './titre1.component';

describe('Titre1Component', () => {
  let component: Titre1Component;
  let fixture: ComponentFixture<Titre1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Titre1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Titre1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
