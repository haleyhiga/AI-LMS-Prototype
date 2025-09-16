import React from 'react';

const DALogo = ({ className = "w-8 h-8", variant = "default" }) => {
  const baseClasses = "inline-block";
  const combinedClasses = `${baseClasses} ${className}`;

  // Different variants for different use cases
  const variants = {
    default: {
      fill: "#ef4444", // brand red
      stroke: "none"
    },
    white: {
      fill: "#ffffff", // white
      stroke: "none"
    },
    black: {
      fill: "#000000", // black
      stroke: "none"
    },
    outline: {
      fill: "none",
      stroke: "#ef4444",
      strokeWidth: "2"
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <svg
      className={combinedClasses}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle/rounded square */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="20"
        ry="20"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      
      {/* DA Letters */}
      <g transform="translate(20, 20)">
        {/* Letter D */}
        <path
          d="M10 10 L10 50 L25 50 Q35 50 35 40 L35 20 Q35 10 25 10 Z M15 15 L25 15 Q30 15 30 20 L30 40 Q30 45 25 45 L15 45 Z"
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
        />
        
        {/* Letter A - connected to D */}
        <path
          d="M35 50 L45 10 L55 10 L65 50 L60 50 L58 40 L42 40 L40 50 Z M44 15 L56 15 L50 35 L48 35 Z"
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
        />
      </g>
    </svg>
  );
};

export default DALogo;
