import { useState, useEffect, useRef } from 'react';

export default function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const startTime = useRef(null);
  const rafId = useRef(null);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (typeof target !== 'number' || target === 0) {
      setValue(target || 0);
      return;
    }

    const from = prevTarget.current;
    prevTarget.current = target;
    startTime.current = null;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);

      setValue(current);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return value;
}
