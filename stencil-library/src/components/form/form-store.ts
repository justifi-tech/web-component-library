import { createStore } from "@stencil/store";

const { state } = createStore<{
  defaultValues: any,
  values: any,
  errors: any,
  isValid: boolean
}>({
  defaultValues: {},
  values: {},
  errors: {},
  isValid: true
});

export default state;