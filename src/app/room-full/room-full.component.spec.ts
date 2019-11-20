import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomFullComponent } from './room-full.component';

describe('RoomFullComponent', () => {
  let component: RoomFullComponent;
  let fixture: ComponentFixture<RoomFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
