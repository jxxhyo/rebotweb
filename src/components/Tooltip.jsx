import React, { useState } from "react";

const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      <div style={{ opacity: 1, width: "5%", height: "50px" }}>{children}</div>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: 0,
            backgroundColor: "gray",
            color: "#fff",
            padding: "5px",
            borderRadius: "5px",
            margin: "0px 0 0 5px",
            width: "max-content",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
