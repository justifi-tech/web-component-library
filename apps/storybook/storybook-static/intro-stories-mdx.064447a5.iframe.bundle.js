"use strict";(self.webpackChunkweb_components_storybook=self.webpackChunkweb_components_storybook||[]).push([[36],{"./.storybook/pages/intro.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,__page:()=>__page,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("../../node_modules/react/index.js");var _Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("../../node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../node_modules/@storybook/addon-docs/dist/index.mjs"),_storybook_blocks__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("../../node_modules/@storybook/blocks/dist/index.mjs"),ts_dedent__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("../../node_modules/ts-dedent/esm/index.js"),_utils_tsx__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./.storybook/pages/utils.tsx"),_css_variables_tsx__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./.storybook/pages/css-variables.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../../node_modules/react/jsx-runtime.js");function _createMdxContent(props){const _components=Object.assign({h1:"h1",p:"p",ul:"ul",li:"li",a:"a",h2:"h2",code:"code",h3:"h3"},(0,_Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.h_,{title:"Introduction"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"introduction-to-justifi-web-component-library",children:"Introduction to JustiFi Web Component Library"}),"\n","\n","\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Latest Version: ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("code",{children:(0,_utils_tsx__WEBPACK_IMPORTED_MODULE_2__.gV)()})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"index",children:"Index"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#usage",children:"Usage"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#default-styling",children:"Default Styling"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#react",children:"React"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#styling",children:"Styling"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#styling-components-with-variables",children:"Styling iFramed components with variables"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#loading-google-fonts",children:"Loading Google Fonts"})}),"\n"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#styling-components-with-custom-css",children:"Styling components with custom css"})}),"\n"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"/docs/changelog--docs",children:"Changelog"})}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"usage",children:"Usage"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"The components can be used as HTML Web Components or as React components."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"html-web-components",children:"HTML Web Components"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"The simplest way to use the Web Components is to include the following script within your HTML. This loads all the components into the browsers custom component registry."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    <script type='module' src='https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${(0,_utils_tsx__WEBPACK_IMPORTED_MODULE_2__.gV)()}/dist/webcomponents/webcomponents.esm.js'></script>
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Then, you can use the custom elements as normal ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"HTML"})," tags."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    <justifi-payment-form attr="value" />
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["It can also be installed as a package with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"npm"})," or ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"yarn"})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"bash",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    npm install --save @justifi/webcomponents
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h3,{id:"default-styling",children:"Default styling"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["In both cases, you most likely will also want to include the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"CSS"})," file for the components to have their default styling (that you can override)."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["It can be included from the CDN, which is easier to start with, but won't update as the version changes in the package installed in you ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"package.json"}),":"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${(0,_utils_tsx__WEBPACK_IMPORTED_MODULE_2__.gV)()}/dist/webcomponents/webcomponents.css" />
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["If you want to include it from the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"node_modules"})," you'll need to get this file to the static directory of your built app in your pipeline:"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    <link rel="stylesheet" href="path/to/your/static/assets/webcomponents.css" />
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"react",children:"React"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"To use the React version of the web components, you need to install the package:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"bash",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    npm install --save @justifi/react-components
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Then import it and use it as a normal React component, for a more in-depth explanation you can search the sidebar for the component you want to use:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"jsx",dark:!0,format:!1,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    import { JustifiCardForm } from '@justifi/react-components';

    <JustifiCardForm
      ref={cardFormRef}
      onCardFormReady={onPaymentMethodReady}
    />

`}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.h3,{id:"for-a-detailed-explanation-of-how-to-use-the-react-components-see-the-react-page",children:["For a detailed explanation of how to use the React components, ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"/docs/react--docs",children:"See the React page"})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"styling",children:"Styling"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"styling-components-with-variables",children:"Styling components with variables"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["The following components need to be styled by overriding ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"CSS variables"}),", since they are scoped within an iFrame:"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/docs/components-bankaccountform--docs",children:"BankAccountForm"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/docs/components-cardform--docs",children:"CardForm"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/docs/components-paymentform--docs",children:"PaymentForm"})}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["This is a complete list of variables as defined in this project's ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"root.scss"}),":"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_utils_tsx__WEBPACK_IMPORTED_MODULE_2__.gZ,{title:"See full list of CSS variables available",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_css_variables_tsx__WEBPACK_IMPORTED_MODULE_3__.Z,{})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_blocks__WEBPACK_IMPORTED_MODULE_7__.UG,{children:"\n  **Note:** When customizing the `--jfi-form-control-box-shadow` variable, ensure that the `--jfi-layout-padding` is not set to `0`. This prevents the box-shadow of the last input from being inset into the iframe container, ensuring it remains visible. Additionally, to create enough room around the inputs and prevent them from getting cut off, the layout padding should be set to at least the size of the box shadow\n"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"loading-google-fonts",children:"Loading Google fonts"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["In order to load custom fonts in the iFramed components, there's a special CSS variable that can be used: ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"--jfi-load-google-font"}),".\nThe value provided should be a string commpatible with what's described in the following ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"https://developers.google.com/fonts/docs/css2",target:"_blank",rel:"nofollow noopener noreferrer",children:"official documentation from Google"}),"."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.h3,{id:"check-out-the-cardform-story-for-this-to-see-it-in-action",children:["Check out the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/docs/components-cardform--styled",children:"CardForm story for this to see it in action"}),"."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Usage examples:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"css",dark:!0,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    :root {
      /*
        Note: The value provided to '--jfi-load-google-font' needs to be wrapped in quotes,
        since it can contain characters incompatible with CSS that can't be used literally.

        Also, as you'll see in the examples below, if more than one font-family
        is to be loaded, any subsequent one except the first needs to be preceeded
        by the '&family=' string, as described in the documentation linked above.
      */

      /* Load a single font (and it's default weight of 400) */
      --jfi-load-google-font: 'Inter';

      /* Load a font with multiple weights */
      --jfi-load-google-font: 'Inter:wght@200;400;700;900';

      /* Load multiple fonts */
      --jfi-load-google-font: 'Inter:wght@200;400;700;900&family=Agdasima';

      /* Load multiple fonts with multiple weights */
      --jfi-load-google-font: 'Inter:wght@200;400;700;900&family=Agdasima:wght@200;400';

      /* Then, any of these can be used with the following two variables */
      --jfi-layout-font-family: Inter; /* Applies to all elements and is inherited */
      --jfi-form-label-font-family: Agdasima; /* Applies exclusively to the form labels */
    }

`}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"styling-components-with-custom-css",children:"Styling components with custom css"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["For every other component, you'll be able to see a list of ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"exportedparts"})," in their ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"Docs"})," page. These exported ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"parts"})," can be used in the following manner:"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"css",dark:!0,code:ts_dedent__WEBPACK_IMPORTED_MODULE_6__.C`
    /* Given an exportedpart of "label" for example */
    the-component-tag:part(label) {
      /* Your custom css */
    }
  `}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"report-issues",children:"Report Issues"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"For bugs and issues, please:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["1 - Go to our ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"https://github.com/justifi-tech/web-component-library/issues",target:"_blank",rel:"nofollow noopener noreferrer",children:"GitHub Issues"}),'.\n2 - Click "New Issue" and describe the problem.']})]})}const __page=()=>{throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};const componentMeta={title:"Introduction",tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,_Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}};const __WEBPACK_DEFAULT_EXPORT__=componentMeta,__namedExportsOrder=["__page"]},"./.storybook/pages/css-variables.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/react/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../node_modules/@storybook/addon-docs/dist/index.mjs"),ts_dedent__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../../node_modules/ts-dedent/esm/index.js");const __WEBPACK_DEFAULT_EXPORT__=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"css",dark:!0,code:ts_dedent__WEBPACK_IMPORTED_MODULE_2__.C`
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
//# sourceMappingURL=intro-stories-mdx.064447a5.iframe.bundle.js.map