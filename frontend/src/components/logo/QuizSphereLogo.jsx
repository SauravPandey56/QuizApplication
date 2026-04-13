import React from 'react';

const QuizSphereLogo = ({ animated = true, className = "", size = "md", showText = true, layout = "horizontal" }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32"
  };

  const textSizeMap = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl"
  };

  return (
    <div className={`flex items-center ${layout === "vertical" ? "flex-col space-y-3" : "space-x-3"} ${className}`}>
      <div className={`${sizeMap[size]} shrink-0 transition-all duration-300`}>
        <img 
          src={animated ? "/logo/QuizSphereLogoAnimated.svg" : "/logo/QuizSphereLogo.svg"} 
          alt="QuizSphere Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {showText && (
        <div className={`font-sans tracking-tight transition-all duration-300 ${textSizeMap[size]}`}>
          <span className="font-normal text-slate-800">Quiz</span>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
            Sphere
          </span>
        </div>
      )}
    </div>
  );
};

export default QuizSphereLogo;
