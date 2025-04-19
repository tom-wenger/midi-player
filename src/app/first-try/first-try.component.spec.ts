import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTryComponent } from './first-try.component';

describe('FirstTryComponent', () => {
  let component: FirstTryComponent;
  let fixture: ComponentFixture<FirstTryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstTryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
