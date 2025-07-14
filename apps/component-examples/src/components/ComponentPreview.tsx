/// <reference path="../jsx.d.ts" />
import { h, SimpleElement } from '../utils/simple-jsx';

export interface ComponentPreviewData {
  componentElement: SimpleElement;
  showOutput?: boolean;
  outputId?: string;
  testButtons?: Array<{
    id: string;
    text: string;
    hidden?: boolean;
  }>;
}

export function ComponentPreview(data: ComponentPreviewData) {
  const {
    componentElement,
    showOutput = true,
    outputId = 'output-pane',
    testButtons = []
  } = data;

  return (
    <div class="component-preview">
      {/* Component Display Area */}
      <div class="component-display">
        <div class="component-container">
          {componentElement}
        </div>

        {/* Test Buttons */}
        {testButtons.length > 0 && (
          <div class="test-buttons">
            {testButtons.map(button => (
              <button
                id={button.id}
                hidden={button.hidden}
                class="test-button"
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Output Display */}
      {showOutput && (
        <div class="output-display">
          <div class="output-header">
            <h3>Component Output</h3>
            <button class="clear-output-btn" onclick="clearOutput()">Clear</button>
          </div>
          <div id={outputId} class="output-content">
            <em>Component output will appear here...</em>
          </div>
        </div>
      )}
    </div>
  );
} 
