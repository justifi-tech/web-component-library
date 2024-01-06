"use strict";(self.webpackChunkweb_components_storybook=self.webpackChunkweb_components_storybook||[]).push([[934],{"./.storybook/pages/vue.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,__page:()=>__page,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("../../node_modules/react/index.js");var _Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../../node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../node_modules/@storybook/addon-docs/dist/index.mjs"),ts_dedent__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("../../node_modules/ts-dedent/esm/index.js"),_utils_tsx__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./.storybook/pages/utils.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../../node_modules/react/jsx-runtime.js");function _createMdxContent(props){const _components=Object.assign({h1:"h1",ul:"ul",li:"li",a:"a",h2:"h2",ol:"ol",p:"p",code:"code",strong:"strong"},(0,_Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_4__.ah)(),props.components);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.h_,{title:"Vue 3"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.h1,{id:"justifi-vue-3-web-components",children:"Justifi Vue 3 web components"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.h1,{id:"index",children:"Index"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.a,{href:"",children:"Integration Step"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.a,{href:"#props-and-event-handling",children:"Props and Event Handling"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.a,{href:"#calling-methods",children:"Calling methods"})}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.h2,{id:"integration-steps",children:"Integration Steps"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.ol,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.li,{children:"Include Web Components in your Project:"}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.p,{children:["Add the web components script and stylesheet to your project's ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.code,{children:"index.html"})," file."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,code:(0,ts_dedent__WEBPACK_IMPORTED_MODULE_5__.C)(`\n    <head>\n      <link rel="stylesheet"\n        href="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${(0,_utils_tsx__WEBPACK_IMPORTED_MODULE_2__.gV)()}/dist/webcomponents/webcomponents.css" />\n      <script type='module'\n        src='https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${(0,_utils_tsx__WEBPACK_IMPORTED_MODULE_2__.gV)()}/dist/webcomponents/webcomponents.esm.js'><\/script>\n    </head>\n  `)}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.ol,{start:"2",children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.li,{children:"Use the Web Component in your Vue Template:"}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.p,{children:"Once included, use the web component tags directly in your Vue templates."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,code:(0,ts_dedent__WEBPACK_IMPORTED_MODULE_5__.C)('\n    <template>\n      <justifi-card-form\n        ref="cardForm"\n        :validation-mode="\'onBlur\'"\n        @cardFormReady="onCardFormReady"\n        @cardFormTokenize="onCardFormTokenize"\n        @cardFormValidate="onCardFormValidate"\n      ></justifi-card-form>\n    </template>\n')}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.h2,{id:"event-handling",children:"Event Handling"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.li,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.strong,{children:"Event Handling:"})," Events emitted by justifi-card-form can be listened to using the @eventName syntax.."]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,code:(0,ts_dedent__WEBPACK_IMPORTED_MODULE_5__.C)('\n    <template>\n      <justifi-card-form\n        ref="cardForm"\n        :validation-mode="\'onBlur\'"\n        @cardFormReady="onCardFormReady"\n        @cardFormTokenize="onCardFormTokenize"\n        @cardFormValidate="onCardFormValidate"\n      ></justifi-card-form>\n    </template>\n    <script setup lang="ts">\n      // Event handlers\n      const onCardFormReady = (event: any) => {\n        console.log(\'Card Form is ready:\', event)\n      }\n\n      const onCardFormTokenize = (event: any) => {\n        console.log(\'Card Form Tokenize event:\', event)\n      }\n\n      const onCardFormValidate = (event: any) => {\n        console.log(\'Card Form Validate event:\', event)\n      }\n    <\/script>\n\n')}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.h2,{id:"calling-methods",children:"Calling Methods"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.p,{children:["To call methods on a web component from a Vue component use a ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.code,{children:"ref"})," to get a reference to the web component."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Hw,{language:"html",dark:!0,code:(0,ts_dedent__WEBPACK_IMPORTED_MODULE_5__.C)("\n    <template>\n      <justifi-card-form ref=\"cardForm\"></justifi-card-form>\n    </template>\n\n    <script setup>\n      import { ref } from 'vue';\n\n      const cardForm = ref<any>(null)\n\n      const validateForm = async () => {\n        if (cardForm.value) {\n          const response = await cardForm.value.validate()\n          console.log('Validation response:', response)\n        }\n      }\n    <\/script>\n\n")}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components.p,{children:["In this example, ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.code,{children:"cardForm"})," is a reference to the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components.code,{children:"justifi-card-form"})," web component, and you can call its methods directly."]})]})}const __page=()=>{throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};const componentMeta={title:"Vue 3",tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,_Users_jakemerringer_justifi_tech_web_component_library_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_4__.ah)(),props.components);return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}};const __WEBPACK_DEFAULT_EXPORT__=componentMeta,__namedExportsOrder=["__page"]}}]);