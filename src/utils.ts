import { MutableRefObject, useEffect, useLayoutEffect, useState } from 'react';
import { Network } from 'vis-network';

/**
 * The function that correctly handles passing refs.
 *
 * @param ref - An ref object or function
 * @param node - A node that should be passed by ref
 */
export const handleRef = <N>(ref: React.Ref<N> | undefined, node: N) => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof ref === 'string') {
      throw new Error(
        'We do not support refs as string, this is a legacy API and will be likely to be removed in one of the future releases of React.'
      );
    }
  }

  if (typeof ref === 'function') {
    ref(node);
    return;
  }

  if (ref !== null && typeof ref === 'object') {
    // The `current` property is defined as readonly, however it's a valid way because
    // `ref` is a mutable object
    (ref as React.MutableRefObject<N>).current = node;
  }
};

export function useResizeNetwork(network: Network | undefined) {
  const [resizeObserver] = useState(
    () =>
      new ResizeObserver((entries: ResizeObserverEntry[]) => {
        entries.forEach(() => {
          console.log((network as any)?.body.container);
          network?.redraw();
        });
      })
  );
  useEffect(() => {
    const elem: HTMLElement = (network as any)?.body.container;
    console.log(elem, network, resizeObserver);
    if (!elem) {
      return () => {};
    }
    resizeObserver.observe(elem);
    return () => {
      resizeObserver.unobserve(elem);
    };
  }, [network, resizeObserver]);
}
