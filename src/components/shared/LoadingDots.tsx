import { useEffect, useState } from "react";

const LoadingDots = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <>{".".repeat(dotCount)}</>;
};

export default LoadingDots;
