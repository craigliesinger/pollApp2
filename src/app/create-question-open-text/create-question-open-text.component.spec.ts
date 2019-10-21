import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionOpenTextComponent } from './create-question-open-text.component';

describe('CreateQuestionOpenTextComponent', () => {
  let component: CreateQuestionOpenTextComponent;
  let fixture: ComponentFixture<CreateQuestionOpenTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionOpenTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionOpenTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
