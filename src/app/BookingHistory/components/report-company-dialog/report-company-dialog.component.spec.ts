import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCompanyDialogComponent } from './report-company-dialog.component';

describe('ReportCompanyDialogComponent', () => {
  let component: ReportCompanyDialogComponent;
  let fixture: ComponentFixture<ReportCompanyDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportCompanyDialogComponent]
    });
    fixture = TestBed.createComponent(ReportCompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
