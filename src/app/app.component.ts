import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { EnvironmentsService, NotificationsService, ConfigurationService } from './services';
import { ModalComponent } from './components';

@Component({
  selector: 'ac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private loadSubscription: Subscription;
  private loadErrorSubscription: Subscription;
  private validationErrorSubscription: Subscription;
  private loadErrorId: number;

  @ViewChild('baseUrlDialog') baseUrlModal: ModalComponent;

  constructor(
    private envService: EnvironmentsService,
    private alerts: NotificationsService,
    private confService: ConfigurationService) {
    this.subscribeOnEvents();

    if(this.confService.baseUrl) {
      this.envService.loadEnvironments();
    }
  }

  ngOnInit() {
    // Trick to enable Bootstrap4 support in ng2-bootstrap library
    (<any>window).__theme = 'bs4';
  }

  ngOnDestroy() {
    if(this.loadSubscription) {
      this.loadSubscription.unsubscribe();
      this.loadSubscription = null;
    }

    if(this.loadErrorSubscription) {
      this.loadErrorSubscription.unsubscribe();
      this.loadErrorSubscription = null;
    }
    this.clearValidationErrorSusbscription();
  }

  ngAfterViewInit() {
    if(!this.confService.baseUrl) {
      this.baseUrlModal.show();
    }
  }

  get loading(): boolean {
    return this.envService.loadingEnvironments;
  }

  private saveBaseUrl(url: string) {
    this.confService.baseUrl = url;
    this.envService.loadEnvironments();
    this.baseUrlModal.hide();
  }

  private subscribeOnEvents() {
    this.loadSubscription = this.envService.onLoad.subscribe(() => {
      if(this.loadErrorId) {
        this.alerts.dismiss(this.loadErrorId);
        this.loadErrorId = null;
      }
    });

    this.loadErrorSubscription = this.envService.onLoadError.subscribe((error: Error) => {
      this.loadErrorId = this.alerts.addError(`Unable to load environments. ${error.message || error}`);
    });

    this.validationErrorSubscription = this.envService.onValidationError.subscribe((errors: string[]) => {
      this.alerts.addWarning('Information may be displayed incorrectly because data format changed. Check browser console for details.');
      errors.forEach(error => { console.warn(error) });

      // Validation error should be shown just once
      this.clearValidationErrorSusbscription();
    });
  }

  private clearValidationErrorSusbscription() {
    if(this.validationErrorSubscription) {
      this.validationErrorSubscription.unsubscribe();
      this.validationErrorSubscription = null;
    }
  }
}
