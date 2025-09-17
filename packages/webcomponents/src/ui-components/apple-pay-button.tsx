import { FunctionalComponent, h } from "@stencil/core";
import { ApplePayButtonType, ApplePayButtonStyle } from "../api/ApplePay";

interface ApplePayButtonProps {
  buttonType?: ApplePayButtonType;
  buttonStyle?: ApplePayButtonStyle;
  disabled?: boolean;
  isProcessing?: boolean;
  isAvailable?: boolean;
  width?: string;
  height?: string;
  clickHandler?: () => void;
}

type ApplePayButtonElementProps = ApplePayButtonProps & {
  [key: string]: any;
};

const ProcessingSpinner = () => (
  <div class='processing-overlay'>
    <div class='spinner'></div>
    <span>Processing...</span>
  </div>
);

export const ApplePayButton: FunctionalComponent<ApplePayButtonElementProps> = (
  props
) => {
  const getApplePayButtonClass = (): string => {
    let classes = "apple-pay-button";

    switch (props.buttonStyle) {
      case ApplePayButtonStyle.WHITE:
        classes += " apple-pay-button-white";
        break;
      case ApplePayButtonStyle.WHITE_OUTLINE:
        classes += " apple-pay-button-white-outline";
        break;
      case ApplePayButtonStyle.BLACK:
      default:
        classes += " apple-pay-button-black";
        break;
    }

    switch (props.buttonType) {
      case ApplePayButtonType.BUY:
        classes += " apple-pay-button-type-buy";
        break;
      case ApplePayButtonType.DONATE:
        classes += " apple-pay-button-type-donate";
        break;
      case ApplePayButtonType.PLAIN:
      default:
        classes += " apple-pay-button-type-plain";
        break;
    }

    if (props.disabled || props.isProcessing || !props.isAvailable) {
      classes += " disabled";
    }

    return classes;
  };

  const getButtonStyles = (): { [key: string]: string } => {
    return {
      width: props.width || "200px",
      height: props.height || "48px",
    };
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
    <div class='apple-pay-button-container'>
      <button
        class={getApplePayButtonClass()}
        style={getButtonStyles()}
        onClick={handleClick}
        disabled={props.disabled || props.isProcessing || !props.isAvailable}
        aria-label='Pay with Apple Pay'
        type='button'
        {...props}
      >
        {props.isProcessing && ProcessingSpinner()}
      </button>

      <style>
        {`
          .apple-pay-button-container {
            display: inline-block;
            position: relative;
          }

          /* Apple Pay CSS classes - these are the official Apple Pay button styles */
          .apple-pay-button {
            display: inline-block;
            -webkit-appearance: -apple-pay-button;
            -apple-pay-button-type: plain; /* default */
            -apple-pay-button-style: black; /* default */
            border-radius: 8px;
            cursor: pointer;
            border: none;
            outline: none;
            transition: opacity 0.2s ease;
            position: relative;
          }

          /* Button styles */
          .apple-pay-button.apple-pay-button-black {
            -apple-pay-button-style: black;
          }

          .apple-pay-button.apple-pay-button-white {
            -apple-pay-button-style: white;
          }

          .apple-pay-button.apple-pay-button-white-outline {
            -apple-pay-button-style: white-outline;
          }

          /* Button types */
          .apple-pay-button.apple-pay-button-type-plain {
            -apple-pay-button-type: plain;
          }

          .apple-pay-button.apple-pay-button-type-buy {
            -apple-pay-button-type: buy;
          }

          .apple-pay-button.apple-pay-button-type-donate {
            -apple-pay-button-type: donate;
          }

          /* Hover and disabled states */
          .apple-pay-button:hover:not(.disabled) {
            opacity: 0.9;
          }

          .apple-pay-button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
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
            border-radius: 8px;
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
            .apple-pay-button {
              width: 100% !important;
              min-width: 200px;
            }
          }
        `}
      </style>
    </div>
  );
};
