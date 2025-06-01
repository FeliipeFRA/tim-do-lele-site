import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCfgComponent } from './admin-cfg.component';

describe('AdminCfgComponent', () => {
  let component: AdminCfgComponent;
  let fixture: ComponentFixture<AdminCfgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCfgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCfgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
