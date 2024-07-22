import { ComponentInterface } from '@stencil/core';
import webcomponentsPackageJson from '../../package.json';
import { AnalyticsService } from './services/analytics.service';

interface iBasicData {
  resource_id: string;
  component_name: string;
  component_version: string;
  client_user_agent: string;
  client_platform: string;
  client_origin: string;
  error?: any;
}

/**
 * @class JustifiAnalytics
 * @description A class to track analytics for a component
 * @param { component } ComponentInterface - The component to track
 *
 */
class JustifiAnalytics {
  componentInstance: any;
  eventEmitters: string[];
  service: AnalyticsService;
  basicData: iBasicData;

  constructor(component: ComponentInterface) {
    this.service = new AnalyticsService();
    this.componentInstance = component;
    this.setUpBasicData();
    this.setupLifecycleTracking();
    this.trackCustomEvents();
  }

  get resourceId() {
    return (
      this.componentInstance.accountId ||
      this.componentInstance.businessId ||
      this.componentInstance.paymentId ||
      this.componentInstance.payoutId ||
      this.componentInstance.checkoutId
    );
  }

  setUpBasicData() {
    this.basicData = {
      component_name: this.componentInstance.tagName,
      component_version: webcomponentsPackageJson.version,
      client_user_agent: navigator.userAgent,
      // navigator.platform is deprecated, use navigator.userAgent instead
      client_platform: navigator.userAgent,
      client_origin: window.location.origin,
      resource_id: this.resourceId,
    };
  }

  handleCustomEvent = async (data: any) => {
    // Track the event
    await this.service.record(data);
  };

  private trackCustomEvents() {
    this.eventEmitters = ['submitted', 'error-event'];

    // for each event, add an event listener
    this.eventEmitters.forEach((eventName) => {
      // if this.componentInstance.addEventListener is a function add the event listener
      if (typeof this.componentInstance.addEventListener === 'function') {
        this.componentInstance.addEventListener(eventName, (event: any) =>
          this.handleCustomEvent({
            event_type: eventName,
            data: { ...this.basicData, error: event.detail },
          })
        );
      }
    });
  }

  setupLifecycleTracking() {
    const originalComponentDidLoad = this.componentInstance.componentDidLoad;

    this.componentInstance.componentDidLoad = () => {
      this.service.record({ event_type: 'init', data: this.basicData });

      if (originalComponentDidLoad) {
        return originalComponentDidLoad.apply(this.componentInstance);
      }
    };
  }

  cleanup() {
    // Remove event listeners
    this.eventEmitters.forEach((event) => {
      this.componentInstance.removeEventListener(event, this.handleCustomEvent);
    });
  }
}

export default JustifiAnalytics;
