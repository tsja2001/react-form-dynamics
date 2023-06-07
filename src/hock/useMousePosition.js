import { useRef, useEffect } from 'react';

function useMousePosition() {
  const mousePosition = useRef([0, 0]);

  useEffect(() => {
    const updateMousePosition = ev => {
      mousePosition.current = [ev.clientX, ev.clientY];

      // console.log(ev)
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
}

export default useMousePosition;
