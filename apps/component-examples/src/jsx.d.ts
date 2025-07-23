import { SimpleElement } from './utils/simple-jsx';

declare global {
  namespace JSX {
    type Element = SimpleElement;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
export {};
