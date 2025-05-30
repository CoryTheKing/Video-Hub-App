import { Component, OnInit, AfterViewInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ElectronService } from './../../providers/electron.service';
import { ModalService } from './../modal/modal.service';

import type { SettingsButtonsType } from '../../common/settings-buttons';
import { SettingsMetaGroup, SettingsMetaGroupLabels } from '../../common/settings-buttons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [
    '../buttons.scss',
    '../settings.scss',
    '../search-input.scss',
    './settings.component.scss'
  ]
})
export class SettingsComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('settingsContainer') settingsContainer!: ElementRef<HTMLDivElement>;

  @Output() changeLanguage = new EventEmitter<string>();
  @Output() checkForNewVersion = new EventEmitter<any>();
  @Output() chooseDefaultVideoPlayer = new EventEmitter<any>();
  @Output() decreaseZoomLevel = new EventEmitter<any>();
  @Output() goDownloadNewVersion = new EventEmitter<any>();
  @Output() increaseZoomLevel = new EventEmitter<any>();
  @Output() openOnlineHelp = new EventEmitter<any>();
  @Output() resetZoomLevel = new EventEmitter<any>();
  @Output() toggleButton = new EventEmitter<string>();
  @Output() toggleHideButton = new EventEmitter<string>();

  @Input() appState;
  @Input() demo;
  @Input() latestVersionAvailable;
  @Input() settingTabToShow;
  @Input() settingsButtons: SettingsButtonsType;
  @Input() versionNumber;

  additionalInput = '';
  editAdditional = false;
  settingsMetaGroup = SettingsMetaGroup;
  settingsMetaGroupLabels = SettingsMetaGroupLabels;

  constructor(
    private electronService: ElectronService,
    private modalService: ModalService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.additionalInput = this.appState.addtionalExtensions;
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settingTabToShow'] && !changes['settingTabToShow'].firstChange) {
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    setTimeout(() => {
      if (this.settingsContainer?.nativeElement) {
        this.settingsContainer.nativeElement.scrollTop = 0;
        console.log('Scrolled to top!');
      }
    }, 0);
  }

  editAdditionalExtensions() {
    this.editAdditional = !this.editAdditional;
    this.additionalInput = this.appState.addtionalExtensions;
  }

  applyAdditionalExtensions() {
    if (this.isAdditionalInputValid(this.additionalInput)) {
      this.appState.addtionalExtensions = this.additionalInput;
      this.electronService.ipcRenderer.send('update-additional-extensions', this.additionalInput);
      this.editAdditional = false;
    } else {
      this.modalService.openSnackbar(this.translate.instant('SETTINGS.extensionsInputError'));
    }
  }

  private isAdditionalInputValid(input: string): boolean {
    let valid = true;
    input.split(',').forEach(element => {
      if (/[^A-Za-z0-9]/.test(element.trim())) {
        valid = false;
      }
    });

    return valid;
  }

}
