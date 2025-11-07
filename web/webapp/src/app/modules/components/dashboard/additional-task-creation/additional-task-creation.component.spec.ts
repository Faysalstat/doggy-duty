import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalTaskCreationComponent } from './additional-task-creation.component';

describe('AdditionalTaskCreationComponent', () => {
  let component: AdditionalTaskCreationComponent;
  let fixture: ComponentFixture<AdditionalTaskCreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalTaskCreationComponent]
    });
    fixture = TestBed.createComponent(AdditionalTaskCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
