import { useEffect, useState } from "react";

const useCountdown = () => {
  const [targetTimestamp, setTargetTimestamp] = useState<bigint>(BigInt(0));
  const [secondsUntilCountdown, setSecondsUntilCountdown] = useState<number>(0);

  const setCountdown = (futureTimestampSeconds: bigint) => {
    if (futureTimestampSeconds > BigInt(Math.floor(Date.now() / 1000))) {
      setTargetTimestamp(futureTimestampSeconds);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (targetTimestamp > BigInt(0)) {
      intervalId = setInterval(() => {
        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        const diffInSeconds = Number(targetTimestamp - currentTime);
        if (diffInSeconds > 0) {
          setSecondsUntilCountdown(diffInSeconds);
        } else {
          setSecondsUntilCountdown(0);
          clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [targetTimestamp]);

  return [secondsUntilCountdown, setCountdown] as const;
};

export default useCountdown;
