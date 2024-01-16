import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCardsComponent } from './history-cards.component';

describe('HistoryCardsComponent', () => {
  let component: HistoryCardsComponent;
  let fixture: ComponentFixture<HistoryCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryCardsComponent]
    });
    fixture = TestBed.createComponent(HistoryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
