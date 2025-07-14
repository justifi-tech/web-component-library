/// <reference path="../jsx.d.ts" />
// @ts-nocheck
import { h, renderToString } from '../utils/simple-jsx';
import { BaseTemplateData } from './base-template';
import { ExampleLayout } from '../components/ExampleLayout';
import { ComponentPreview } from '../components/ComponentPreview';
import { PropsEditor } from '../components/PropsEditor';
import { EventLogger } from '../components/EventLogger';
import { NavigationMenu } from '../components/NavigationMenu';

export interface ExampleTemplateData extends BaseTemplateData {
  // Example-specific data
  exampleTitle: string;
  exampleDescription?: string;
  componentElement: any; // JSX element

  // Props configuration
  propsConfig?: {
    props: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'select' | 'object';
      label: string;
      value: any;
      options?: Array<{ value: string; label: string }>;
      placeholder?: string;
      description?: string;
    }>;
  };

  // Events configuration
  eventsConfig?: {
    eventTypes: string[];
    maxEvents?: number;
  };

  // Navigation configuration
  navigationConfig?: {
    items: Array<{
      id: string;
      title: string;
      description?: string;
      category?: string;
      url: string;
      isActive?: boolean;
    }>;
  };

  // Test buttons
  testButtons?: Array<{
    id: string;
    text: string;
    hidden?: boolean;
  }>;

  // Additional scripts for the example
  exampleScripts?: string[];
}

export function ExampleTemplate(data: ExampleTemplateData) {
  const {
    title,
    exampleTitle,
    exampleDescription,
    componentElement,
    propsConfig,
    eventsConfig,
    navigationConfig,
    testButtons = [],
    exampleScripts = [],
    ...baseData
  } = data;

  // Build the component preview content
  const componentPreviewElement = ComponentPreview({
    componentElement,
    showOutput: true,
    outputId: 'output-pane',
    testButtons
  });
  const componentPreviewContent = renderToString(componentPreviewElement);

  // Build the props editor content (if props are configured)
  const propsContent = propsConfig
    ? renderToString(PropsEditor({
      props: propsConfig.props,
      onPropsChange: 'updateComponentProps'
    }))
    : '';

  // Build the event logger content (if events are configured)
  const eventsContent = eventsConfig
    ? renderToString(EventLogger({
      events: [], // Will be populated by client-side JavaScript
      maxEvents: eventsConfig.maxEvents || 100,
      showFilters: true,
      eventTypes: eventsConfig.eventTypes || []
    }))
    : '';

  // Build the navigation content (if navigation is configured)
  const navigationContent = navigationConfig
    ? renderToString(NavigationMenu({
      items: navigationConfig.items,
      showCategories: true
    }))
    : '';

  // Build the main example layout
  const exampleLayoutElement = ExampleLayout({
    title: exampleTitle,
    description: exampleDescription || '',
    componentContent: componentPreviewContent,
    propsContent,
    eventsContent,
    navigationContent,
    scripts: exampleScripts
  });
  const exampleLayoutContent = renderToString(exampleLayoutElement);

  // Return the example layout content directly
  // The BaseTemplate will be applied by the server when rendering
  return exampleLayoutContent;
} 
