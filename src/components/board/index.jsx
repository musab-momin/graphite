import React, { useState, useRef, useEffect } from "react";
import "@/components/board/board.scss";

const Board = () => {
  const [viewport, setViewport] = useState({
    x: 0, // translateX
    y: 0, // translateY
    scale: 1, // zoom factor
  });

  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const svg = svgRef.current;

    const handleWheel = (eve) => {
      eve.preventDefault();

      const zoomFactor = 0.1;

      if (eve.deltaY < 0) {
        setViewport((currViewPort) => ({
          ...currViewPort,
          scale: Math.min(currViewPort.scale + zoomFactor, 5),
        }));
      } else {
        setViewport((currViewPort) => ({
          ...currViewPort,
          scale: Math.max(currViewPort.scale - zoomFactor, 0.2),
        }));
      }
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });

    const handleMouseDown = (eve) => {
      isDragging.current = true;
      lastPos.current = { x: eve.clientX, y: eve.clientY };
      svg.style.cursor = "grabbing";
    };

    const handleMouseMove = (eve) => {
      if (!isDragging.current) return;

      const dx = eve.clientX - lastPos.current.x;
      const dy = eve.clientY - lastPos.current.y;

      setViewport((curr) => ({
        ...curr,
        x: curr.x + dx,
        y: curr.y + dy,
      }));

      lastPos.current = { x: eve.clientX, y: eve.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      svg.style.cursor = "grab";
    };

    svg.addEventListener("mousedown", handleMouseDown);
    svg.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      svg.removeEventListener("wheel", handleWheel);
      svg.removeEventListener("mousedown", handleMouseDown);
      svg.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="board-container">
      <svg ref={svgRef} className="board-svg" width="100%" height="100%">
        <defs>
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#ccc" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
        <g
          transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}
        >
          <circle cx="200" cy="200" r="50" fill="tomato" />
          <rect x="500" y="500" width="150" height="150" fill="lightblue" />
        </g>
      </svg>
    </div>
  );
};

export default Board;
