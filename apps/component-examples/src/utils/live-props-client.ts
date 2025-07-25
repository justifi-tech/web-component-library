/// <reference path="../jsx.d.ts" />

// Client-side utilities for live props editing
export class LivePropsClient {
  private componentContainers: Map<string, HTMLElement> = new Map();
  private updateCallbacks: Map<string, (props: any) => void> = new Map();

  constructor() {
    this.initializeGlobalFunctions();
  }

  /**
   * Register a component container and update callback
   */
  registerComponent(
    componentName: string,
    container: HTMLElement,
    updateCallback: (props: any) => void
  ): void {
    this.componentContainers.set(componentName, container);
    this.updateCallbacks.set(componentName, updateCallback);
  }

  /**
   * Update a component with new props
   */
  updateComponent(componentName: string, props: any): void {
    const callback = this.updateCallbacks.get(componentName);
    if (callback) {
      try {
        callback(props);
      } catch (error) {
        console.error(`Error updating component ${componentName}:`, error);
      }
    }
  }

  /**
   * Get component container
   */
  getComponentContainer(componentName: string): HTMLElement | undefined {
    return this.componentContainers.get(componentName);
  }

  /**
   * Initialize global functions for use in HTML
   */
  private initializeGlobalFunctions(): void {
    if (typeof window !== 'undefined') {
      // Override the global updateProp function to trigger live updates
      const originalUpdateProp = (window as any).updateProp;
      (window as any).updateProp = (
        componentName: string,
        propName: string,
        value: any,
        type: string
      ) => {
        // Call the original function
        if (originalUpdateProp) {
          originalUpdateProp(componentName, propName, value, type);
        }

        // Trigger live update
        this.triggerLiveUpdate(componentName);
      };

      // Override the global resetProps function
      const originalResetProps = (window as any).resetProps;
      (window as any).resetProps = (componentName: string) => {
        // Call the original function
        if (originalResetProps) {
          originalResetProps(componentName);
        }

        // Trigger live update
        this.triggerLiveUpdate(componentName);
      };
    }
  }

  /**
   * Trigger live update for a component
   */
  private triggerLiveUpdate(componentName: string): void {
    // Get current props from the props manager
    const propsManager = (window as any).propsManager;
    if (propsManager) {
      const props = propsManager.getProps(componentName);
      this.updateComponent(componentName, props);
    }
  }

  /**
   * Add visual feedback for prop changes
   */
  addPropChangeFeedback(componentName: string): void {
    const container = this.getComponentContainer(componentName);
    if (container) {
      // Add a brief highlight effect
      container.style.transition = 'box-shadow 0.3s ease';
      container.style.boxShadow = '0 0 10px rgba(0, 123, 255, 0.5)';

      setTimeout(() => {
        container.style.boxShadow = '';
      }, 300);
    }
  }

  /**
   * Show validation errors
   */
  showValidationError(
    _componentName: string,
    propName: string,
    error: string
  ): void {
    const fieldId = `prop-${propName}`;
    const field = document.getElementById(fieldId);

    if (field) {
      // Remove existing error
      const existingError =
        field.parentElement?.querySelector('.validation-error');
      if (existingError) {
        existingError.remove();
      }

      // Add new error
      const errorElement = document.createElement('div');
      errorElement.className = 'validation-error';
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = '0.25rem';
      errorElement.textContent = error;

      field.parentElement?.appendChild(errorElement);

      // Add error styling to field
      field.style.borderColor = '#dc3545';

      // Remove error styling after 3 seconds
      setTimeout(() => {
        field.style.borderColor = '';
        errorElement.remove();
      }, 3000);
    }
  }

  /**
   * Clear validation errors
   */
  clearValidationErrors(_componentName: string): void {
    const errors = document.querySelectorAll('.validation-error');
    errors.forEach((error) => error.remove());

    // Clear error styling from fields
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach((field) => {
      (field as HTMLElement).style.borderColor = '';
    });
  }
}

// Create global instance
export const livePropsClient = new LivePropsClient();

// Global function to register components
if (typeof window !== 'undefined') {
  (window as any).registerLiveComponent = (
    componentName: string,
    container: HTMLElement,
    updateCallback: (props: any) => void
  ) => {
    livePropsClient.registerComponent(componentName, container, updateCallback);
  };
}
