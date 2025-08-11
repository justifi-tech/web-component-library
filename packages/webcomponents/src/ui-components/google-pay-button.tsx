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
    
    styles.height = props.height || '56px';
    
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
    <div class='google-pay-button-container'>
      <button
        class={getGooglePayButtonClass()}
        style={getButtonStyles()}
        onClick={handleClick}
        disabled={props.disabled || props.isProcessing || !props.isAvailable}
        aria-label='Pay with Google Pay'
        type='button'
        {...props}
      >
        {props.isProcessing && ProcessingSpinner()}
        <div class='google-pay-button-content'>
          <svg class='google-g-logo' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4'/>
            <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
            <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05'/>
            <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
          </svg>
          <span class='pay-text'>Pay</span>
        </div>
      </button>

      <style>
        {`
          .google-pay-button-container {
            display: inline-block;
            position: relative;
          }

          .google-pay-button {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Google Sans', arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.25px;
            line-height: 16px;
            outline: none;
            padding: 0 24px;
            position: relative;
            transition: box-shadow 0.2s ease;
            min-width: 140px;
            min-height: 48px;
          }

          /* Button styles */
          .google-pay-button.google-pay-button-black {
            background-color: #000;
            color: #fff;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
          }

          .google-pay-button.google-pay-button-white {
            background-color: #fff;
            color: #3c4043;
            box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.30), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
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