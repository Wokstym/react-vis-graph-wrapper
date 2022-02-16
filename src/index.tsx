import {
  cloneDeep,
  defaultsDeep,
  differenceWith,
  intersectionWith,
  isEqual,
} from 'lodash';
import React, {
  forwardRef,
  HTMLAttributes,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { DataSet } from 'vis-data';
import { DeepPartial } from 'vis-data/declarations/data-interface';
import {
  Edge,
  IdType,
  Network,
  NetworkEvents,
  Node,
  Options,
} from 'vis-network';
import 'vis-network/styles/vis-network.css';
import { GraphEvents } from './EventTypes';
import { handleRef } from './utils';

export type { Network, Edge, Node, Options, NetworkEvents, IdType };

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface NetworkGraphProps {
  graph: GraphData;
  options?: Options;
  events?: Partial<GraphEvents>;
  style?: React.CSSProperties;
  className?: string;
  /**
   * Require a modifier key in order to zoom to allow it on scrolling pages
   */
  zoomKey?: 'ctrlKey' | 'shiftKey' | 'altKey';
  networkRef?: Ref<Network | undefined>;
}
/**
 * Keeps the value the same permanently.
 * Useful over refs especially in instances where the function creation variant is used
 */
function useSealedState<T>(value: T | (() => T)) {
  const [state] = useState(value);
  return state;
}

/**
 * https://github.com/crubier/react-graph-vis/commit/68bf2e27b2046d6c0bb8b334c2cf974d23443264
 */
function diff<T extends { id?: IdType }>(
  from: T[],
  to: T[],
  field: keyof T = 'id'
) {
  function accessor(item: T) {
    return item[field];
  }
  const nextIds = new Set(to.map(accessor));
  const prevIds = new Set(from.map(accessor));
  const removed = from.filter((item) => !nextIds.has(accessor(item)));

  const unchanged = intersectionWith(from, to, isEqual);

  const updated = differenceWith(
    intersectionWith(to, from, (a, b) => accessor(a) === accessor(b)),
    unchanged,
    isEqual
  );

  const added = to.filter((item) => !prevIds.has(accessor(item)));
  return {
    removed,
    unchanged,
    updated,
    added,
  };
}

const defaultOptions = {
  physics: {
    stabilization: false,
  },
  autoResize: false,
  edges: {
    smooth: false,
    color: '#000000',
    width: 0.5,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      },
    },
  },
};

function shallowClone<T>(array: T[]): T[] {
  return array.map((value) => ({ ...value }));
}

function useDataset<T>(values: T[]) {
  // Shallow clone dataSet to ensure props aren't mutated!
  const dataSet = useSealedState(() => new DataSet<T>(shallowClone(values)));
  const prevValues = useRef(values);
  useEffect(() => {
    if (isEqual(values, prevValues.current)) {
      return; // No change!
    }
    const { added, removed, updated } = diff(dataSet.get(), values);

    dataSet.remove(removed);
    if (added.length) {
      dataSet.add(shallowClone(added));
    }
    if (updated.length) {
      // cast needed for update to not complain about the generic type
      dataSet.update(shallowClone(updated) as DeepPartial<T>[]);
    }
    prevValues.current = values;
  }, [values, dataSet]);
  return dataSet;
}

const VisGraph = forwardRef<
  HTMLDivElement,
  NetworkGraphProps & HTMLAttributes<HTMLDivElement>
>(
  (
    { graph, events, options: propOptions, zoomKey, networkRef, ...props },
    ref
  ) => {
    const container = useRef<HTMLDivElement>(null);
    const initialOptions = useSealedState(propOptions);
    const edges = useDataset(graph.edges);
    const nodes = useDataset(graph.nodes);

    const [network, setNetwork] = useState<Network>();

    useImperativeHandle(networkRef, () => network, [network]);

    useEffect(() => {
      if (!network || !events) {
        return () => {};
      }
      // Add user provied events to network
      for (const [eventName, callback] of Object.entries(events)) {
        if (callback) {
          network.on(eventName as NetworkEvents, callback);
        }
      }
      return () => {
        for (const [eventName, callback] of Object.entries(events)) {
          if (callback) {
            network.off(eventName as NetworkEvents, callback);
          }
        }
      };
    }, [events, network]);

    useEffect(() => {
      if (!zoomKey || !network) {
        return () => {};
      }
      const { interactionHandler } = network as any;
      if (interactionHandler) {
        const originalHandler =
          interactionHandler.body.eventListeners.onMouseWheel;
        interactionHandler.body.eventListeners.onMouseWheel = (
          event: MouseEvent
        ) => {
          if (!event[zoomKey]) return; // ctrlKey detects a max touchpad pinch in onwheel event
          originalHandler(event);
        };
        return () => {
          interactionHandler.body.eventListeners.onMouseWheel = originalHandler;
        };
      }
      return () => {};
    }, [network, zoomKey]);

    useEffect(() => {
      if (!network || !propOptions) {
        return;
      }
      try {
        network.setOptions(propOptions);
      } catch (error) {
        // Throws when it hot reloads... Yay
        if (process.env.NODE_ENV !== 'development') {
          // Still throw it in prod where there's no hot reload
          throw error;
        }
      }
    }, [network, propOptions]);

    useEffect(() => {
      // Creating the network has to be done in a useEffect because it needs access to a ref

      // merge user provied options with our default ones
      // defaultsDeep mutates the host object
      const mergedOptions = defaultsDeep(
        cloneDeep(initialOptions),
        defaultOptions
      );
      const newNetwork = new Network(
        container.current as HTMLElement,
        { edges, nodes },
        mergedOptions
      );
      setNetwork(newNetwork);
      return () => {
        // Cleanup the network on component unmount
        newNetwork.destroy();
      };
    }, [edges, initialOptions, nodes]);

    return (
      <div
        style={{ width: '100%', height: '100%' }}
        ref={(el) => {
          handleRef(container, el);
          handleRef(ref, el);
        }}
        {...props}
      />
    );
  }
);
// Set displayName explicitly as it isn't implicitly set
VisGraph.displayName = 'VisGraph';
export default VisGraph;
