import React, { useEffect, useState, useRef } from 'react';
import { Text } from 'react-native';

export default function AnimatedNumber({
  value = 0,
  duration = 1200,
  style,
  formatter = (val) => Math.round(val).toString(),
}) {
  const [displayVal, setDisplayVal] = useState(0);
  const targetVal = typeof value === 'number' ? value : parseInt(value, 10) || 0;
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = targetVal;
    if (end === 0) {
      setDisplayVal(0);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;
      setDisplayVal(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return <Text style={style}>{formatter(displayVal)}</Text>;
}
