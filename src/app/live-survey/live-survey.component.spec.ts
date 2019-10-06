import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSurveyComponent } from './live-survey.component';

describe('LiveSurveyComponent', () => {
  let component: LiveSurveyComponent;
  let fixture: ComponentFixture<LiveSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
