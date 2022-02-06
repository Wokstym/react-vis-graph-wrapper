import React from 'react';
import VisGraph, { NetworkGraphProps } from '..';
import { Meta, Story } from '@storybook/react';
import {BaseClickData, SingleClickData} from "../EventTypes";

export default {
    title: 'Basic graph example',
    component: VisGraph,
} as Meta;

type StoryProps = NetworkGraphProps;
  
const Template: Story<StoryProps> = (args) => {
    return (
        <div style={{ width: '500px',  height: '500px', border: '1px solid black' }}>
            <VisGraph {...args} />
        </div>
    )
}

export const BasicNetwork = Template.bind({});
BasicNetwork.args = {
    graph: {
        nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
        edges: [{ from: 1, to: 2 }, { from: 2, to: 3 }]
    }
}

export const NetworkWithClickEvents = Template.bind({});
NetworkWithClickEvents.args = {
    ...BasicNetwork.args,
    events: {
        click: (params: SingleClickData) => console.log(params.edges, params.nodes),
        doubleClick: (params: BaseClickData) => console.log(params.pointer)
    }
}