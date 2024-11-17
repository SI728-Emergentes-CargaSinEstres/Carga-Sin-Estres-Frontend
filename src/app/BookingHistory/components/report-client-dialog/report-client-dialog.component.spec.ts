import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportClientDialogComponent } from './report-client-dialog.component';

describe('ReportClientDialogComponent', () => {
  let component: ReportClientDialogComponent;
  let fixture: ComponentFixture<ReportClientDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportClientDialogComponent]
    });
    fixture = TestBed.createComponent(ReportClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
