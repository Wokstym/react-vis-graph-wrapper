import { Meta, Story } from '@storybook/react';
import { default as React } from 'react';
import VisGraph, { GraphData, NetworkGraphProps } from '..';
import { ResponsiveVisGraph } from '../ResponsiveVisGraph';
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
const baseGraph: GraphData = {
  nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
  edges: [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ],
};
export const BasicNetwork = Template.bind({});
BasicNetwork.args = {
  graph: baseGraph,
};

export const NetworkWithClickEvents = Template.bind({});
NetworkWithClickEvents.args = {
  ...BasicNetwork.args,
  events: {
    click: (params) => console.log(params),
    doubleClick: (params) => console.log(params),
  },
};

const ZoomKeyTemplate: Story<StoryProps> = (args) => {
  return (
    <div>
      <p> Use {args.zoomKey} to zoom so that scrolling normally works</p>
      <div
        style={{
          width: '520px',
          height: '250px',
          border: '1px solid black',
          overflow: 'auto',
        }}
      >
        <div
          style={{ width: '500px', height: '500px', border: '1px solid black' }}
        >
          <VisGraph {...args} />
        </div>
      </div>
    </div>
  );
};

export const ZoomKey = ZoomKeyTemplate.bind({});
ZoomKey.args = {
  graph: baseGraph,
  zoomKey: 'ctrlKey',
};

const ResizeTemplate: Story<StoryProps> = (args) => {
  return (
    <div
      style={{
        resize: 'both',
        overflow: 'auto',
        border: '1px solid black',
      }}
    >
      <ResponsiveVisGraph {...args} />
    </div>
  );
};

export const ResizeNetwork = ResizeTemplate.bind({});
ResizeNetwork.args = {
  graph: baseGraph,
};
