import { Meta, Story } from '@storybook/react';
import React from 'react';
import VisGraph, { NetworkGraphProps } from '..';
import { __fakeType } from './fakeType';

export default {
  title: 'Basic graph example',
  // storybook doesn't work well with forward ref components
  component: __fakeType,
} as Meta;

type StoryProps = NetworkGraphProps;

const Template: Story<StoryProps> = (args) => {
  return (
    <div style={{ width: '500px', height: '500px', border: '1px solid black' }}>
      <VisGraph {...args} />
    </div>
  );
};

export const BasicNetwork = Template.bind({});
BasicNetwork.args = {
  graph: {
    nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ],
  },
};

export const NetworkWithClickEvents = Template.bind({});
NetworkWithClickEvents.args = {
  ...BasicNetwork.args,
  events: {
    click: (params) => console.log(params),
    doubleClick: (params) => console.log(params),
  },
};
