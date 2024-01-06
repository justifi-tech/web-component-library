"use strict";(self.webpackChunkweb_components_storybook=self.webpackChunkweb_components_storybook||[]).push([[217],{"./.storybook/pages/react.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,__page:()=>__page,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("../../node_modules/react/index.js");var _Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("../../node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../node_modules/@storybook/addon-docs/dist/index.mjs"),ts_dedent__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("../../node_modules/ts-dedent/esm/index.js"),_css_variables_tsx__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./.storybook/pages/css-variables.tsx"),_utils_tsx__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./.storybook/pages/utils.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../../node_modules/react/jsx-runtime.js");function _createMdxContent(props){const _components=Object.assign({h1:"h1",ul:"ul",li:"li",a:"a",p:"p",code:"code",h2:"h2",h3:"h3"},(0,_Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.h_,{title:"React"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"justifi-react-web-components",children:"Justifi React web components"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"index",children:"Index"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#usage",children:"Usage"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#usage-details",children:"Usage details"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#calling-methods",children:"Calling methods"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#listening-to-events",children:"Listening to events"})}),"\n"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#styling-exported-parts",children:"Styling exported parts"})}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"usage",children:"Usage"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["To use the web-components in a React app you need to add the CDN script and the link to the default styles to your ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"index.html"})," file:"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"bash",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    <head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${(0,_utils_tsx__WEBPACK_IMPORTED_MODULE_3__.gV)()}/dist/webcomponents/webcomponents.css"
      />
      <script
        async
        type="module"
        src="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${(0,_utils_tsx__WEBPACK_IMPORTED_MODULE_3__.gV)()}/dist/webcomponents/webcomponents.esm.js"
      />
    </head>
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Then you can use the components as any other HTML element:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"jsx",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    <justifi-card-form
      single-line="true"
      validation-mode="onSubmit"
    />
`}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"usage-details",children:"Usage details"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"tyepscript-integration",children:"Tyepscript integration"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"To integrate with TypeScript, declare the component in the JSX.IntrinsicElements interface. This helps TypeScript understand the custom element, its attributes, and events."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"jsx",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    import React, { useState, DOMAttributes } from 'react';

    type CustomElement<T> = Partial<T & DOMAttributes<T> & { children?: React.ReactNode }>;

    declare global {
      namespace JSX {
        interface IntrinsicElements {
          'justifi-payment-form': CustomElement<any>; // Specify more specific types as needed
        }
      }
    }

`}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"calling-methods",children:"Calling Methods"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"In some scenarios, you might need to programmatically call methods on the justifi-payment-form web component from your React components. This can be done using React refs. Here’s a step-by-step guide:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h3,{id:"creating-a-ref-to-the-component",children:"Creating a Ref to the Component"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Create a ref in your React component that will be attached to the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"justifi-payment-form"})," element. This ref will be used to access the web component and its methods."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"jsx",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    import React, { useRef } from 'react';

    export default function CardFormComponent() {
      // create the ref
      const formRef = useRef(null);

      const handleSubmit = () => {
        const form = formRef.current;
        if (form) {
          form.tokenize();
        }
      };

      return (
        <justifi-card-form
          // attach the ref to the web component
          ref={formRef}
          validation-mode="onBlur"
        />
      );
    }

`}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"listening-to-events",children:"Listening to events"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"React allows attaching event listeners directly to JSX components. For custom events emitted by justifi-payment-form, use the addEventListener method within a useEffect hook or a ref callback."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Example of handling a custom event:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"jsx",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    import React, { useEffect, useRef } from 'react';

    export default function PaymentFormComponent() {
      const formRef = useRef(null);

      useEffect(() => {
        const form = formRef.current;
        if (form) {
          const handleSubmit = (event) => {
            // Handle the submit event
          };
          form.addEventListener('submitted', handleSubmit);

          // Cleanup
          return () => form.removeEventListener('submitted', handleSubmit);
        }
      }, []);

      return (
        <justifi-payment-form
          ref={formRef}
          client-id="your-client-id"
          email="customer@example.com"
          // ... other props
        />
      );
    }

`}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"styling",children:"Styling"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Styling works similarly to the vanilla web components."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"components-styled-with-variables",children:"Components styled with variables"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"The following components can only be styled through CSS variables:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/docs/components-bankaccountform--docs",children:"BankAccountForm"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/docs/components-cardform--docs",children:"CardForm"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/docs/components-paymentform--docs",children:"PaymentForm"})}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["You can easily override the variables in a ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"<style>"})," tag in any place of your App, both in the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"<head>"})," of your root ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"index.html"})," or at any component level."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"jsx",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    <YourComponent>
      <style>
        {\`:root {
          --jfi-variable: 'override value';
        }\`}
      </style>

      <JustifiPaymentForm />
    </YourComponent>

`}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_utils_tsx__WEBPACK_IMPORTED_MODULE_3__.gZ,{title:"See full list of CSS variables available",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_css_variables_tsx__WEBPACK_IMPORTED_MODULE_2__.Z,{})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"styling-exported-parts",children:"Styling exported parts"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["For components that are not in an iFrame, you'll find a list of ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"exportedparts"})," on their docs page."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"css",dark:!0,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    /* Given an exportedpart of "label" for example */
    the-component-tag:part(label) {
      /* Your custom css */
    }
  `})]})}const __page=()=>{throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};const componentMeta={title:"React",tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,_Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}};const __WEBPACK_DEFAULT_EXPORT__=componentMeta,__namedExportsOrder=["__page"]},"./.storybook/pages/css-variables.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/react/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../node_modules/@storybook/addon-docs/dist/index.mjs"),ts_dedent__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../../node_modules/ts-dedent/esm/index.js");const __WEBPACK_DEFAULT_EXPORT__=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"css",dark:!0,code:ts_dedent__WEBPACK_IMPORTED_MODULE_2__.C`
  /* general */
  --jfi-load-google-font

  /* layout */
  --jfi-layout-font-family
  --jfi-layout-padding
  --jfi-layout-form-control-spacing-x
  --jfi-layout-form-control-spacing-y

  /* colors */
  --jfi-primary-color

  /* form control */
  --jfi-form-control-background-color
  --jfi-form-control-border-color
  --jfi-form-control-border-color-focus
  --jfi-form-control-border-color-error
  --jfi-form-control-border-width
  --jfi-form-control-border-bottom-width
  --jfi-form-control-border-left-width
  --jfi-form-control-border-right-width
  --jfi-form-control-border-top-width
  --jfi-form-control-border-radius
  --jfi-form-control-border-style
  --jfi-form-control-box-shadow
  --jfi-form-control-box-shadow-error
  --jfi-form-control-box-shadow-error-focus
  --jfi-form-control-box-shadow-focus
  --jfi-form-control-color
  --jfi-form-control-color-focus
  --jfi-form-control-font-size
  --jfi-form-control-font-weight
  --jfi-form-control-line-height
  --jfi-form-control-margin
  --jfi-form-control-padding
  --jfi-form-control-disabled-background-color
  --jfi-form-control-disabled-color

  /* form label */
  --jfi-form-label-color
  --jfi-form-label-font-family
  --jfi-form-label-font-size
  --jfi-form-label-font-weight
  --jfi-form-label-margin

  /* validation messages */
  --jfi-error-message-color
  --jfi-error-message-margin
  --jfi-error-message-font-size

  /* Below only used in justifi-payment-form */
  /* form radio group */
  --jfi-radio-button-color
  --jfi-radio-button-background-color
  --jfi-radio-button-color-selected
  --jfi-radio-button-background-color-selected
  --jfi-radio-button-border-color
  --jfi-radio-button-border-color-selected
  --jfi-radio-button-padding
  --jfi-radio-button-font-size
  --jfi-radio-button-color-hover
  --jfi-radio-button-color-selected-hover
  --jfi-radio-button-background-color-hover
  --jfi-radio-button-background-color-selected-hover
  --jfi-radio-button-border-color-selected-hover
  --jfi-radio-button-border-color-hover
  --jfi-radio-button-group-width

  /* submit button */
  --jfi-submit-button-color
  --jfi-submit-button-background-color
  --jfi-submit-button-border-color
  --jfi-submit-button-padding
  --jfi-submit-button-font-size
  --jfi-submit-button-border-radius
  --jfi-submit-button-color-hover
  --jfi-submit-button-background-color-hover
  --jfi-submit-button-border-color-hover
  --jfi-submit-button-color-focus
  --jfi-submit-button-background-color-focus
  --jfi-submit-button-border-color-focus
  --jfi-submit-button-color-active
  --jfi-submit-button-background-color-active
  --jfi-submit-button-border-color-active
  --jfi-submit-button-width
  --jfi-submit-button-box-shadow
  --jfi-submit-button-color-loading
  --jfi-submit-button-background-color-loading
  --jfi-submit-button-border-color-loading
  `})}}]);
//# sourceMappingURL=react-stories-mdx.8f76ca89.iframe.bundle.js.map