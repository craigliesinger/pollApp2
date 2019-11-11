import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSurveyByShortcodeComponent } from './find-survey-by-shortcode.component';

describe('FindSurveyByShortcodeComponent', () => {
  let component: FindSurveyByShortcodeComponent;
  let fixture: ComponentFixture<FindSurveyByShortcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindSurveyByShortcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSurveyByShortcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
