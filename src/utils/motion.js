export function slideInFromBottom(delay) {
  return {
    offscreen: {
      x: 80,
      opacity: 0,
    },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: delay,
        ease: "easeOut",
      },
    },
  };
}
export function sideBar() {
  return {
    offscreen: {
      width: "0%",
    },
    onscreen: {
      width: "50%",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };
}