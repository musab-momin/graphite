import React from "react";
import Icon from "@/components/icons";
import { BOARD_TOOLS } from "@/utils/constants";
import cn from "classnames";
import "@/components/board-tools/tools.scss";

const BoardTools = ({ activeTool, handleToolChange }) => {
  return (
    <div className="tools-container">
      {Object.values(BOARD_TOOLS).map((tool) => (
        <button
          key={tool}
          className={cn("tools-btn", {
            "tools-btn--active": activeTool === tool,
          })}
          onClick={() => handleToolChange(tool)}
        >
          <Icon name={tool} />
        </button>
      ))}
    </div>
  );
};

export default BoardTools;
