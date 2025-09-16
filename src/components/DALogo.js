import React from 'react';

const DALogo = ({ className = "w-8 h-8", variant = "default" }) => {
  const baseClasses = "inline-block";
  const combinedClasses = `${baseClasses} ${className}`;

  // Different variants for different use cases
  const variants = {
    default: {
      // No filters - show original image
    },
    white: {
      filter: "brightness(0) invert(1)", // Makes image white
    },
    black: {
      filter: "brightness(0)", // Makes image black
    },
    outline: {
      filter: "brightness(0) invert(1) drop-shadow(0 0 2px currentColor)", // White with outline effect
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <img
      src="/da-logo.png"
      alt="Dynamic Active Logo"
      className={combinedClasses}
      style={style}
      onLoad={() => {
        console.log('Logo image loaded successfully');
      }}
      onError={(e) => {
        console.error('Logo image failed to load. Make sure da-logo.png is in the public folder.');
        console.error('Image src:', e.target.src);
        // Show a fallback text
        e.target.style.display = 'none';
      }}
    />
  );
};

export default DALogo;
