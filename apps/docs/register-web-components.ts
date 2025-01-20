import { JSX as LocalJSX } from '@justifi/webcomponents/dist/loader';

// HTMLAttributes
type HTMLAttributes<T> = {
  [key: string]: any;
};

type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, 'className'> & {
      class?: string;
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements
      extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}
