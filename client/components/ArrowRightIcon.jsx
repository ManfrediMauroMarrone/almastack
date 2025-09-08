// Arrow Component 1: Sharp 90-degree angle (Lucide style)
const ArrowDownRight = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main path: down then right */}
    <path 
      d="M7 4 L7 17 L20 17" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Arrow head */}
    <path 
      d="M15 12 L20 17 L15 22" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Arrow Component 2: Curved corner version
const ArrowDownRightCurved = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Curved path: down then right with rounded corner */}
    <path 
      d="M7 4 L7 14 Q7 17 10 17 L20 17" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Arrow head */}
    <path 
      d="M15 12 L20 17 L15 22" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Arrow Component 3: Simplified single-path version
const ArrowDownRightSimple = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Single continuous path with arrow */}
    <path 
      d="M8 5 L8 16 L19 16 M15 12 L19 16 L15 20" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export { ArrowDownRight, ArrowDownRightCurved, ArrowDownRightSimple };