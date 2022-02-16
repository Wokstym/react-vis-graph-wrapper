import React, { useState, useRef } from 'react';
import { Network } from 'vis-network';
import VisGraph, { NetworkGraphProps } from '.';
import { handleRef, useResizeNetwork } from './utils';

export function ResponsiveVisGraph({
  networkRef,
  ...props
}: NetworkGraphProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const innerRef = useRef<Network>(null);
  useResizeNetwork(element, innerRef);
  return (
    <VisGraph
      ref={setElement}
      networkRef={(ref) => {
        handleRef(networkRef, ref);
        handleRef(innerRef, ref);
      }}
      {...props}
    />
  );
}
