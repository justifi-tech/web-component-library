import { h } from "@stencil/core";

export const LoadingState =
  <main part='detail-loading-state' class="p-2 d-flex justify-content-center">
    <div part='detail-loading-spinner' class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </main>


export const ErrorState = (errorMessage: string) =>
  <main part='detail-empty-state' class="p-2 d-flex justify-content-center">
    <div>{errorMessage}</div>
  </main>
