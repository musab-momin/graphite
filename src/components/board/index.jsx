import React, { useState, useRef, useEffect, useCallback } from "react";
import BoardType from "@/components/board-type";
import BoardTools from "@/components/board-tools";
import { BOARD_TYPES, BOARD_TOOLS } from "@/utils/constants";
import "@/components/board/board.scss";
import cn from "classnames";

const Board = () => {
  const [viewport, setViewport] = useState({
    x: 0, // translateX
    y: 0, // translateY
    scale: 1, // zoom factor
  });

  const [mode, setMode] = useState(BOARD_TYPES.ASTRA_BOARD);
  const [activeTool, setActiveTool] = useState(BOARD_TOOLS.grab);

  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((eve) => {
    isDragging.current = true;
    lastPos.current = { x: eve.clientX, y: eve.clientY };
    // svgRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((eve) => {
    if (!isDragging.current) return;

    const dx = eve.clientX - lastPos.current.x;
    const dy = eve.clientY - lastPos.current.y;

    setViewport((curr) => ({
      ...curr,
      x: curr.x + dx,
      y: curr.y + dy,
    }));

    lastPos.current = { x: eve.clientX, y: eve.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    // svgRef.current.style.cursor = "grab";
  }, []);

  const handleWheel = useCallback((eve) => {
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
  }, []);

  const handleToolChange = useCallback((selectedTool) => {
    const svg = svgRef.current;
    if (activeTool === BOARD_TOOLS.grab) {
      svg.removeEventListener("wheel", handleWheel);
      svg.removeEventListener("mousedown", handleMouseDown);
      svg.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    if (selectedTool === BOARD_TOOLS.grab) {
      svg.addEventListener("wheel", handleWheel);
      svg.addEventListener("mousedown", handleMouseDown);
      svg.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    setActiveTool(selectedTool);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;

    svg.addEventListener("wheel", handleWheel, { passive: false });
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
    <>
      <div className="board-container">
        <svg
          ref={svgRef}
          className={cn("board-svg", `board-svg--${activeTool}`)}
          width="100%"
          height="100%"
        >
          {mode === BOARD_TYPES.ASTRA_BOARD ? (
            <>
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
              <rect width="100%" height="100%" fill="#FFFFFF" />
              <rect width="100%" height="100%" fill="url(#dot-grid)" />
            </>
          ) : (
            <rect width="100%" height="100%" fill="#FFFFFF" />
          )}
          <g
            transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}
          >
            <circle cx="200" cy="200" r="50" fill="tomato" />
            <rect x="500" y="500" width="150" height="150" fill="lightblue" />
          </g>
        </svg>
      </div>
      <BoardType type={mode} changeType={(md) => setMode(md)} />
      <BoardTools activeTool={activeTool} handleToolChange={handleToolChange} />
    </>
  );
};

export default Board;
