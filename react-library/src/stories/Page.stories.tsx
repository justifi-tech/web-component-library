import React from "react";
import { JustifiCardForm } from "../components";

export default {
  title: 'Components/JustifiCardForm',
  component: JustifiCardForm,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

const Template = (args: any) => <JustifiCardForm {...args} />;

export const Default = Template.bind({});

