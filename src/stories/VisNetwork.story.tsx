import React from 'react';
import VisGraph, { NetworkGraphProps } from '..';
import { Meta, Story } from '@storybook/react';


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