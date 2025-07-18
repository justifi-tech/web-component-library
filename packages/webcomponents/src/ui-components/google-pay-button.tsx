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
          <svg class='google-pay-logo' viewBox='0 0 41 17' xmlns='http://www.w3.org/2000/svg'>
            <g fill='none' fill-rule='evenodd'>
              <path d='M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.882.605-1.438 0-.544-.202-1.018-.605-1.43-.392-.413-.888-.61-1.488-.61h-2.518zm0 5.52v4.736h-1.504V1.198h4.022c1.024 0 1.915.365 2.673 1.1.757.723 1.136 1.65 1.136 2.78 0 1.119-.379 2.04-1.136 2.781-.758.735-1.649 1.1-2.673 1.1h-2.518v-.004z' fill='#4285F4'/>
              <path d='M33.644 7.39c0-.48-.144-.895-.433-1.246-.289-.334-.701-.501-1.235-.501-.544 0-.96.173-1.246.52-.286.334-.429.738-.429 1.227 0 .48.149.895.447 1.246.298.334.708.501 1.228.501.533 0 .951-.173 1.257-.52.297-.334.445-.738.445-1.227h-.034zm1.423 0c0 .987-.306 1.794-.918 2.42-.612.627-1.423.94-2.433.94-.992 0-1.797-.313-2.414-.94-.617-.626-.926-1.433-.926-2.42 0-.999.309-1.811.926-2.438.617-.627 1.422-.94 2.414-.94 1.01 0 1.821.313 2.433.94.612.627.918 1.439.918 2.438z' fill='#34A853'/>
              <path d='M25.6 7.39c0-.48-.144-.895-.433-1.246-.289-.334-.701-.501-1.235-.501-.544 0-.96.173-1.246.52-.286.334-.429.738-.429 1.227 0 .48.149.895.447 1.246.298.334.708.501 1.228.501.533 0 .951-.173 1.257-.52.297-.334.445-.738.445-1.227h-.034zm1.423 0c0 .987-.306 1.794-.918 2.42-.612.627-1.423.94-2.433.94-.992 0-1.797-.313-2.414-.94-.617-.626-.926-1.433-.926-2.42 0-.999.309-1.811.926-2.438.617-.627 1.422-.94 2.414-.94 1.01 0 1.821.313 2.433.94.612.627.918 1.439.918 2.438z' fill='#FBBC05'/>
              <path d='M35.947 1.198v11.553h-1.504V1.198h1.504z' fill='#EA4335'/>
              <path d='M40.74 7.39c0-.48-.144-.895-.433-1.246-.289-.334-.701-.501-1.235-.501-.544 0-.96.173-1.246.52-.286.334-.429.738-.429 1.227 0 .48.149.895.447 1.246.298.334.708.501 1.228.501.533 0 .951-.173 1.257-.52.297-.334.445-.738.445-1.227h-.034zm1.423 0c0 .987-.306 1.794-.918 2.42-.612.627-1.423.94-2.433.94-.992 0-1.797-.313-2.414-.94-.617-.626-.926-1.433-.926-2.42 0-.999.309-1.811.926-2.438.617-.627 1.422-.94 2.414-.94 1.01 0 1.821.313 2.433.94.612.627.918 1.439.918 2.438z' fill='#34A853'/>
              <path d='M8.517 7.39c0-.48-.144-.895-.433-1.246-.289-.334-.701-.501-1.235-.501-.544 0-.96.173-1.246.52-.286.334-.429.738-.429 1.227 0 .48.149.895.447 1.246.298.334.708.501 1.228.501.533 0 .951-.173 1.257-.52.297-.334.445-.738.445-1.227h-.034zm1.423 0c0 .987-.306 1.794-.918 2.42-.612.627-1.423.94-2.433.94-.992 0-1.797-.313-2.414-.94-.617-.626-.926-1.433-.926-2.42 0-.999.309-1.811.926-2.438.617-.627 1.422-.94 2.414-.94 1.01 0 1.821.313 2.433.94.612.627.918 1.439.918 2.438z' fill='#EA4335'/>
              <path d='M16.25 7.39c0-.48-.144-.895-.433-1.246-.289-.334-.701-.501-1.235-.501-.544 0-.96.173-1.246.52-.286.334-.429.738-.429 1.227 0 .48.149.895.447 1.246.298.334.708.501 1.228.501.533 0 .951-.173 1.257-.52.297-.334.445-.738.445-1.227h-.034zm1.423 0c0 .987-.306 1.794-.918 2.42-.612.627-1.423.94-2.433.94-.992 0-1.797-.313-2.414-.94-.617-.626-.926-1.433-.926-2.42 0-.999.309-1.811.926-2.438.617-.627 1.422-.94 2.414-.94 1.01 0 1.821.313 2.433.94.612.627.918 1.439.918 2.438z' fill='#4285F4'/>
            </g>
          </svg>
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
            min-height: 40px;
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

          .google-pay-logo {
            width: 41px;
            height: 17px;
            flex-shrink: 0;
          }

          /* Button types - text content handled by ::after pseudo-element */
          .google-pay-button-type-buy .google-pay-button-content::after {
            content: 'Buy with';
            margin-right: 4px;
          }

          .google-pay-button-type-book .google-pay-button-content::after {
            content: 'Book with';
            margin-right: 4px;
          }

          .google-pay-button-type-checkout .google-pay-button-content::after {
            content: 'Checkout with';
            margin-right: 4px;
          }

          .google-pay-button-type-donate .google-pay-button-content::after {
            content: 'Donate with';
            margin-right: 4px;
          }

          .google-pay-button-type-order .google-pay-button-content::after {
            content: 'Order with';
            margin-right: 4px;
          }

          .google-pay-button-type-pay .google-pay-button-content::after {
            content: 'Pay with';
            margin-right: 4px;
          }

          .google-pay-button-type-subscribe .google-pay-button-content::after {
            content: 'Subscribe with';
            margin-right: 4px;
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