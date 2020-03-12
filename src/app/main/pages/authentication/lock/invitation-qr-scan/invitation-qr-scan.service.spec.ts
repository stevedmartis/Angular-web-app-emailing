import { TestBed } from '@angular/core/testing';

import { InvitationQrScanService } from './invitation-qr-scan.service';

describe('InvitationQrScanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvitationQrScanService = TestBed.get(InvitationQrScanService);
    expect(service).toBeTruthy();
  });
});
