// Advanced animation variants for Framer Motion
import { Variants } from "framer-motion";

// Card entrance animations
export const cardEntrance: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: (custom: number = 0) => ({ 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: custom * 0.1
    }
  }),
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0 10px 30px -15px var(--shadow-color)",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Data visualization animations
export const chartAnimation: Variants = {
  hidden: { 
    opacity: 0,
    pathLength: 0
  },
  visible: { 
    opacity: 1,
    pathLength: 1,
    transition: { 
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

// Number counter animation
export const countAnimation = (start: number, end: number, duration: number = 1.5) => ({
  from: { value: start },
  to: { value: end, transition: { duration } }
});

// Staggered list animations
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  }
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// Notification animations
export const notificationAnimation: Variants = {
  initial: { opacity: 0, y: -50, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// Button animations
export const buttonAnimation: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

// Gradient animations
export const gradientAnimation = {
  backgroundSize: "200% 200%",
  backgroundPosition: ["0% 0%", "100% 100%"],
  transition: {
    duration: 5,
    repeat: Infinity,
    repeatType: "reverse" as const
  }
};

// Shimmer loading effect
export const shimmer: Variants = {
  hidden: {
    backgroundPosition: "200% 0",
  },
  visible: {
    backgroundPosition: "-200% 0",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};