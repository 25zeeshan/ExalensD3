import { useEffect, useState, useMemo } from "react";
import ResizeObserver from "resize-observer-polyfill";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    margin: { top: 10, right: 50, bottom: 50, left: 50 },
  });

  const memoizedDimensions = useMemo(() => dimensions, [dimensions]);

  useEffect(() => {
    const observeTarget = ref.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const newDimensions = entries.reduce((acc, entry) => {
        acc.width = entry.contentRect.width;
        acc.height = entry.contentRect.height;
        return acc;
      }, { ...dimensions });

      setDimensions(newDimensions);
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.disconnect();
    };

  }, [ref]);

  return memoizedDimensions;
};

export default useResizeObserver;
