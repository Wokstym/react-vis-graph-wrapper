import { IdType, NetworkEvents } from 'vis-network';

type SupportedNetworkEvents = Record<
  'click',
  (params: SingleClickData) => void
> &
  Record<
    | 'doubleClick'
    | 'oncontext'
    | 'hold'
    | 'release'
    | 'select'
    | 'selectNode'
    | 'selectEdge'
    | 'dragStart'
    | 'dragging'
    | 'dragEnd',
    (params: BaseClickData) => void
  >;

type UnsupportedTypeNetworkEvents = Exclude<
  NetworkEvents,
  keyof SupportedNetworkEvents
>;

export type GraphEvents = Record<
  UnsupportedTypeNetworkEvents,
  (params: unknown) => void
> &
  SupportedNetworkEvents;

export interface BaseClickData {
  nodes: IdType[];
  edges: IdType[];
  event: unknown; // TODO add event type
  pointer: Pointer;
}

export interface SingleClickData extends BaseClickData {
  items: unknown[]; // TODO add items type
}

export interface Pointer {
  DOM: Position;
  canvas: Position;
}

export interface Position {
  x: number;
  y: number;
}
