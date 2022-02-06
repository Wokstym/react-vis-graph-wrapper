export type GraphEvents = Partial<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<UnsupportedTypeNetworkEvents, (params?: unknown) => void>
  | Record<'click', (params: SingleClickData) => void>
  | Record<
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
    >
>;

type UnsupportedTypeNetworkEvents =
  | 'deselectNode'
  | 'deselectEdge'
  | 'controlNodeDragging'
  | 'controlNodeDragEnd'
  | 'hoverNode'
  | 'blurNode'
  | 'hoverEdge'
  | 'blurEdge'
  | 'zoom'
  | 'showPopup'
  | 'hidePopup'
  | 'startStabilizing'
  | 'stabilizationProgress'
  | 'stabilizationIterationsDone'
  | 'stabilized'
  | 'resize'
  | 'initRedraw'
  | 'beforeDrawing'
  | 'afterDrawing'
  | 'animationFinished'
  | 'configChange';

export interface BaseClickData {
  nodes: string[];
  edges: string[];
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
