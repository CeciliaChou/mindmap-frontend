import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedLabelsComponent } from './subscribed-labels.component';

describe('SubscribedLabelsComponent', () => {
  let component: SubscribedLabelsComponent;
  let fixture: ComponentFixture<SubscribedLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
