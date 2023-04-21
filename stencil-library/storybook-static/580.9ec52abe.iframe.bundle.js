"use strict";(self.webpackChunk_justifi_webcomponents=self.webpackChunk_justifi_webcomponents||[]).push([[580],{"./dist/esm/justifi-bank-account-form.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{justifi_bank_account_form:()=>BankAccountForm});var _index_3ce5521c_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./dist/esm/index-3ce5521c.js");const BankAccountForm=class{constructor(hostRef){(0,_index_3ce5521c_js__WEBPACK_IMPORTED_MODULE_0__.r)(this,hostRef),this.bankAccountFormReady=(0,_index_3ce5521c_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"bankAccountFormReady",7),this.bankAccountFormTokenize=(0,_index_3ce5521c_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"bankAccountFormTokenize",7),this.bankAccountFormValidate=(0,_index_3ce5521c_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,"bankAccountFormValidate",7),this.validationStrategy=void 0,this.styleOverrides=void 0,this.iframeOrigin=void 0,this.internalStyleOverrides=void 0}readyHandler(event){this.bankAccountFormReady.emit(event)}tokenizeHandler(event){this.bankAccountFormTokenize.emit(event)}validateHandler(event){this.bankAccountFormValidate.emit(event)}componentWillLoad(){this.parseStyleOverrides()}parseStyleOverrides(){if(this.styleOverrides){const parsedStyleOverrides=JSON.parse(this.styleOverrides);this.internalStyleOverrides=parsedStyleOverrides}}async tokenize(...args){if(!this.childRef)throw new Error("Cannot call tokenize");return this.childRef.tokenize(...args)}async validate(){if(!this.childRef)throw new Error("Cannot call validate");return this.childRef.validate()}render(){return(0,_index_3ce5521c_js__WEBPACK_IMPORTED_MODULE_0__.h)("justifi-payment-method-form",{ref:el=>{el&&(this.childRef=el)},"iframe-origin":this.iframeOrigin,"payment-method-form-type":"bankAccount","payment-method-form-ready":this.bankAccountFormReady,"payment-method-form-tokenize":this.bankAccountFormTokenize,"payment-method-form-validation-strategy":this.validationStrategy||"onSubmit",paymentMethodStyleOverrides:this.internalStyleOverrides})}static get watchers(){return{styleOverrides:["parseStyleOverrides"]}}}}}]);