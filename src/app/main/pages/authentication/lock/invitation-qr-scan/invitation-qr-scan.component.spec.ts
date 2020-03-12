import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationQrScanComponent } from './invitation-qr-scan.component';

describe('InvitationQrScanComponent', () => {
  let component: InvitationQrScanComponent;
  let fixture: ComponentFixture<InvitationQrScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationQrScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationQrScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
