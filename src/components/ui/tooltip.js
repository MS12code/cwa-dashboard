import * as React from "react";

// Simple tooltip implementation for learning purposes
const TooltipProvider = ({ children, delayDuration = 0 }) => {
  return <div>{children}</div>;
};

const Tooltip = ({ children }) => {
  return <div>{children}</div>;
};

const TooltipTrigger = React.forwardRef(
  ({ asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ref, ...props });
    }
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  },
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
