import { debounce } from 'lodash';
import { MutableRefObject, Ref, RefObject, useEffect, useState } from 'react';
import { Network } from 'vis-network';

/**
 * The function that correctly handles passing refs.
 *
 * @param ref - An ref object or function
 * @param node - A node that should be passed by ref
 */
export const handleRef = <N>(ref: Ref<N> | undefined, node: N) => {
  if (typeof ref === 'function') {
    ref(node);
    return;
  }

  if (ref !== null && typeof ref === 'object') {
    // The `current` property is defined as readonly, however it's a valid way because
    // `ref` is a mutable object
    (ref as MutableRefObject<N>).current = node;
  }
};

export function useResizeNetwork(
  element: HTMLElement | null,
  networkRef: RefObject<Network | undefined>
) {
  const [resizeObserver] = useState(() => {
    const redraw = debounce(
      () => {
        networkRef.current?.redraw();
      },
      // we can play around with these timings a bit
      // the events appear to fire off every 15ms, it appears
      // so 30/60 has a bit of a stutter to it, whereas not using debouncing gives
      // a really smooth looking resize
      30,
      { maxWait: 60 }
    );
    return new ResizeObserver((entries: ResizeObserverEntry[]) => {
      entries.forEach(() => {
        redraw();
      });
    });
  });
  useEffect(() => {
    if (!element) {
      return () => {};
    }
    resizeObserver.observe(element);
    return () => {
      resizeObserver.unobserve(element);
    };
  }, [element, resizeObserver]);
}
