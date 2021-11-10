import * as React from "react";

const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = React.useCallback(
    (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]); // Make sure the effect runs only once
};

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const App = () => {
  const [count, setCount] = React.useState(0);
  const [count2, setCount2] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);

  useInterval(() => {
    setCount2((count2) => count2 + 1);
  }, speed * 1000);

  useAnimationFrame((deltaTime) => {
    if (speed <= 0) return;
    setCount((prevCount) => (prevCount + deltaTime * (speed / 1000)) % 100);
  });

  React.useEffect(() => {
    if (speed === 0 && (count > 0 || count2 > 0)) {
      setCount(0);
      setCount2(0);
    }
  }, [speed, count, count2]);

  return (
    <>
      <div>{Math.round(count)}</div>
      <div>{Math.round(count2)}</div>
      <div>
        <button onClick={() => setSpeed((speed) => speed - 1)}>-</button>
        {speed}
        <button onClick={() => setSpeed((speed) => speed + 1)}>+ </button>
      </div>
    </>
  );
};

export default App;
