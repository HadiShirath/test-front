/* eslint-disable react/prop-types */
import {useSpring, animated} from "react-spring";

export function AnimatedNumber ({n, integer}) {
    const {number} = useSpring({
      from: {number: 0},
      number: n,
      delay: 100,
      config: {mass: 1, tension:20, friction: 10},
    })
    return <animated.div>{number.to((n) => n.toFixed(integer ? 0 : 2))}</animated.div>
  }