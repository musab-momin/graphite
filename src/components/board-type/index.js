import React from "react";

import { BOARD_TYPES } from "@/utils/constants";

const BoardType = ({ type, changeType }) => {
  return (
    <div className="board-type-selector">
      <select
        name="board-type"
        value={type}
        onChange={() =>
          changeType((currType) =>
            currType === BOARD_TYPES.IVORY_BOARD
              ? BOARD_TYPES.ASTRA_BOARD
              : BOARD_TYPES.IVORY_BOARD
          )
        }
      >
        {Object.values(BOARD_TYPES).map((type) => (
          <option key={type} value={type}>
            {type.split("_")[0].toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BoardType;
