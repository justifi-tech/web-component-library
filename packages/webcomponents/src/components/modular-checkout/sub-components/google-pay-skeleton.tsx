import { FunctionalComponent, h } from "@stencil/core";

interface GooglePaySkeletonProps {
  isReady: boolean;
}

const GooglePaySkeleton: FunctionalComponent<GooglePaySkeletonProps> = ({ isReady }) => {
  return (
    <div class={`google-pay-skeleton ${isReady ? 'ready' : 'loading'}`}>
      <div class='skeleton-button'>
        <div class='skeleton-content'>
          <div class='skeleton-logo'></div>
          <div class='skeleton-text'></div>
        </div>
      </div>
      
      <style>
        {`
          .google-pay-skeleton {
            width: 100%;
            transition: opacity 0.3s ease;
          }

          .google-pay-skeleton.loading {
            opacity: 1;
          }

          .google-pay-skeleton.ready {
            opacity: 0;
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: -1;
          }

          .skeleton-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 200px;
            height: 48px;
            background: #f0f0f0;
            border-radius: 4px;
            padding: 0 24px;
            animation: pulse 1.5s ease-in-out infinite;
          }

          .skeleton-content {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .skeleton-logo {
            width: 41px;
            height: 17px;
            background: #e0e0e0;
            border-radius: 2px;
            animation: pulse 1.5s ease-in-out infinite;
          }

          .skeleton-text {
            width: 60px;
            height: 14px;
            background: #e0e0e0;
            border-radius: 2px;
            animation: pulse 1.5s ease-in-out infinite;
          }

          @keyframes pulse {
            0% {
              background-color: #f0f0f0;
            }
            50% {
              background-color: #e0e0e0;
            }
            100% {
              background-color: #f0f0f0;
            }
          }

          @media (max-width: 480px) {
            .skeleton-button {
              width: 100%;
              min-width: 200px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default GooglePaySkeleton;