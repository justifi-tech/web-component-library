import { FunctionalComponent, h } from "@stencil/core";
import { GooglePayButtonType, GooglePayButtonStyle, GooglePayButtonSizeMode } from "../api/GooglePay";

interface GooglePayButtonProps {
  buttonType?: GooglePayButtonType;
  buttonStyle?: GooglePayButtonStyle;
  buttonSizeMode?: GooglePayButtonSizeMode;
  disabled?: boolean;
  isProcessing?: boolean;
  isAvailable?: boolean;
  width?: string;
  height?: string;
  clickHandler?: () => void;
}

type GooglePayButtonElementProps = GooglePayButtonProps & {
  [key: string]: any;
};

const ProcessingSpinner = () => (
  <div class='processing-overlay'>
    <div class='spinner'></div>
    <span>Processing...</span>
  </div>
);

export const GooglePayButton: FunctionalComponent<GooglePayButtonElementProps> = (
  props
) => {
  const getGooglePayButtonClass = (): string => {
    let classes = "google-pay-button";

    // Button style
    switch (props.buttonStyle) {
      case GooglePayButtonStyle.WHITE:
        classes += " google-pay-button-white";
        break;
      case GooglePayButtonStyle.BLACK:
      default:
        classes += " google-pay-button-black";
        break;
    }

    // Button type
    switch (props.buttonType) {
      case GooglePayButtonType.BUY:
        classes += " google-pay-button-type-buy";
        break;
      case GooglePayButtonType.BOOK:
        classes += " google-pay-button-type-book";
        break;
      case GooglePayButtonType.CHECKOUT:
        classes += " google-pay-button-type-checkout";
        break;
      case GooglePayButtonType.DONATE:
        classes += " google-pay-button-type-donate";
        break;
      case GooglePayButtonType.ORDER:
        classes += " google-pay-button-type-order";
        break;
      case GooglePayButtonType.PAY:
        classes += " google-pay-button-type-pay";
        break;
      case GooglePayButtonType.SUBSCRIBE:
        classes += " google-pay-button-type-subscribe";
        break;
      case GooglePayButtonType.PLAIN:
      default:
        classes += " google-pay-button-type-plain";
        break;
    }

    // Size mode
    switch (props.buttonSizeMode) {
      case GooglePayButtonSizeMode.FILL:
        classes += " google-pay-button-fill";
        break;
      case GooglePayButtonSizeMode.STATIC:
      default:
        classes += " google-pay-button-static";
        break;
    }

    if (props.disabled || props.isProcessing || !props.isAvailable) {
      classes += " disabled";
    }

    return classes;
  };

  const getButtonStyles = (): { [key: string]: string } => {
    const styles: { [key: string]: string } = {};

    if (props.buttonSizeMode === GooglePayButtonSizeMode.FILL) {
      styles.width = '100%';
      styles.minWidth = '200px';
    } else {
      styles.width = props.width || '200px';
    }

    styles.height = props.height || '48px';

    return styles;
  };

  const handleClick = () => {
    if (
      !props.disabled &&
      !props.isProcessing &&
      props.isAvailable &&
      props.clickHandler
    ) {
      props.clickHandler();
    }
  };

  return (
    <div class="google-pay-button-container">
      <button
        class={getGooglePayButtonClass()}
        style={getButtonStyles()}
        onClick={handleClick}
        disabled={props.disabled || props.isProcessing || !props.isAvailable}
        aria-label="Google Pay"
        type="button"
        {...props}
      >
        {props.isProcessing && ProcessingSpinner()}
        <div class='google-pay-button-content'>
          <svg width="41" height="17" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <path d="M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.882.605-1.437 0-.544-.202-1.018-.605-1.422-.392-.413-.888-.62-1.488-.62h-2.518zm0 5.52v4.736h-1.504V1.198h3.99c1.013 0 1.873.337 2.582 1.012.72.675 1.08 1.497 1.08 2.466 0 .991-.36 1.819-1.08 2.482-.697.665-1.559.996-2.583.996h-2.485v.001zm7.668 2.287c0 .392.166.718.499.98.332.26.722.391 1.168.391.633 0 1.196-.234 1.692-.701.497-.469.744-1.019.744-1.65-.469-.37-1.123-.555-1.962-.555-.61 0-1.12.148-1.528.442-.409.294-.613.657-.613 1.093m1.946-5.815c1.112 0 1.989.297 2.633.89.642.594.964 1.408.964 2.442v4.932h-1.439v-1.11h-.065c-.622.914-1.45 1.372-2.486 1.372-.882 0-1.621-.262-2.215-.784-.594-.523-.891-1.176-.891-1.96 0-.828.313-1.486.94-1.976s1.463-.735 2.51-.735c.892 0 1.629.163 2.206.49v-.344c0-.522-.207-.966-.621-1.33a2.132 2.132 0 0 0-1.455-.547c-.84 0-1.504.353-1.995 1.062l-1.324-.834c.73-1.045 1.81-1.568 3.238-1.568m11.853.262l-5.02 11.53H34.42l1.864-4.034-3.302-7.496h1.635l2.387 5.749h.032l2.322-5.75z" fill="#FFF"/>
              <path d="M13.448 7.134c0-.473-.04-.93-.116-1.366H6.988v2.588h3.634a3.11 3.11 0 0 1-1.344 2.042v1.68h2.169c1.27-1.17 2.001-2.9 2.001-4.944" fill="#4285F4"/>
              <path d="M6.988 13.7c1.816 0 3.344-.595 4.459-1.621l-2.169-1.681c-.603.406-1.38.643-2.29.643-1.754 0-3.244-1.182-3.776-2.774H.978v1.731a6.728 6.728 0 0 0 6.01 3.703" fill="#34A853"/>
              <path d="M3.212 8.267a4.034 4.034 0 0 1 0-2.572V3.964H.978A6.678 6.678 0 0 0 .261 6.98c0 1.085.26 2.11.717 3.017l2.234-1.731z" fill="#FABB05"/>
              <path d="M6.988 2.921c.992 0 1.88.34 2.58 1.008v.001l1.92-1.918C10.324.928 8.804.262 6.989.262a6.728 6.728 0 0 0-6.01 3.702l2.234 1.731c.532-1.592 2.022-2.774 3.776-2.774" fill="#E94235"/>
            </g>
          </svg>
        </div>
      </button>

      <style>
        {`
          .google-pay-button-container {
            display: block;
            position: relative;
          }

          .google-pay-button {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.25px;
            line-height: 16px;
            outline: none;
            padding: 0 20px;
            position: relative;
            min-width: 140px;
            min-height: 48px;
          }

          /* Button styles */
          .google-pay-button.google-pay-button-black {
            background-color: #000;
            color: #fff;
          }

          .google-pay-button.google-pay-button-white {
            background-color: #fff;
            color: #3c4043;
          }

          /* Button content */
          .google-pay-button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            white-space: nowrap;
          }

          .google-g-logo {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
          }

          .pay-text {
            font-family: 'Google Sans', arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            margin-left: 8px;
          }

          /* Button types - text content handled by ::before pseudo-element */
          .google-pay-button-type-buy .google-pay-button-content::before {
            content: 'Buy with';
            margin-right: 8px;
          }

          .google-pay-button-type-book .google-pay-button-content::before {
            content: 'Book with';
            margin-right: 8px;
          }

          .google-pay-button-type-checkout .google-pay-button-content::before {
            content: 'Checkout with';
            margin-right: 8px;
          }

          .google-pay-button-type-donate .google-pay-button-content::before {
            content: 'Donate with';
            margin-right: 8px;
          }

          .google-pay-button-type-order .google-pay-button-content::before {
            content: 'Order with';
            margin-right: 8px;
          }

          .google-pay-button-type-pay .google-pay-button-content::before {
            content: 'Pay with';
            margin-right: 8px;
          }

          .google-pay-button-type-subscribe .google-pay-button-content::before {
            content: 'Subscribe with';
            margin-right: 8px;
          }

          /* Size modes */
          .google-pay-button.google-pay-button-fill {
            width: 100%;
            min-width: 200px;
          }

          .google-pay-button.google-pay-button-static {
            width: auto;
          }

          /* Hover and focus states */
          .google-pay-button:hover:not(.disabled) {
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 1px rgba(0, 0, 0, 0.30);
          }

          .google-pay-button:focus:not(.disabled) {
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 1px rgba(0, 0, 0, 0.30);
          }

          .google-pay-button:active:not(.disabled) {
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 1px rgba(0, 0, 0, 0.30);
            transform: translateY(1px);
          }

          /* Disabled state */
          .google-pay-button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            box-shadow: none;
          }

          .google-pay-button.disabled:hover,
          .google-pay-button.disabled:focus,
          .google-pay-button.disabled:active {
            box-shadow: none;
            transform: none;
          }

          /* Processing overlay */
          .processing-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
          }

          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Responsive design */
          @media (max-width: 480px) {
            .google-pay-button {
              width: 100% !important;
              min-width: 200px;
            }
          }
        `}
      </style>
    </div>
  );
};
