import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCampaignComponent } from './editor-campaign.component';

describe('EditorCampaignComponent', () => {
  let component: EditorCampaignComponent;
  let fixture: ComponentFixture<EditorCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
