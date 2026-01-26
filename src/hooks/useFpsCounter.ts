"use client";

import { useEffect, useRef, useState } from "react";

export function useFpsCounter() {
  const [fps, setFps] = useState(0);

  const lastTime = useRef(0);
  const frameCount = useRef(0);

  useEffect(() => {
    lastTime.current = performance.now();
    let animationFrameId: number;

    const loop = () => {
      const now = performance.now();
      frameCount.current++;

      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return { fps };
}
