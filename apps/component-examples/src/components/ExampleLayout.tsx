/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface ExampleLayoutData {
  title: string;
  description?: string;
  componentContent: string;
  propsContent?: string;
  eventsContent?: string;
  navigationContent?: string;
  scripts?: string[];
  styles?: string[];
}

export function ExampleLayout(data: ExampleLayoutData) {
  const {
    title,
    description,
    componentContent,
    propsContent = '',
    eventsContent = '',
    navigationContent = '',
    scripts = [],
    styles = []
  } = data;

  return (
    <div class="example-layout">
      {/* Navigation Header */}
      <header class="example-header">
        <h1>{title}</h1>
        {description && <p class="example-description">{description}</p>}
        {navigationContent && (
          <div class="example-navigation">
            {navigationContent}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main class="example-main">
        {/* Component Preview Panel */}
        <section class="example-panel component-panel">
          <div class="panel-header">
            <h2>Component Preview</h2>
          </div>
          <div class="panel-content">
            {componentContent}
          </div>
        </section>

        {/* Props Editor Panel */}
        {propsContent && (
          <section class="example-panel props-panel">
            <div class="panel-header">
              <h2>Props Editor</h2>
            </div>
            <div class="panel-content">
              {propsContent}
            </div>
          </section>
        )}

        {/* Events Logger Panel */}
        {eventsContent && (
          <section class="example-panel events-panel">
            <div class="panel-header">
              <h2>Event Log</h2>
            </div>
            <div class="panel-content">
              {eventsContent}
            </div>
          </section>
        )}
      </main>

      {/* Additional Styles */}
      {styles.map(style => (
        <link rel="stylesheet" href={style} />
      ))}

      {/* Additional Scripts */}
      {scripts.map(script => (
        <script>{script}</script>
      ))}
    </div>
  );
} 
