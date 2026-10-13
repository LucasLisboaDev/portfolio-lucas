import { domMax } from "motion/react";

/**
 * Motion's feature bundle (animations, gestures, in-view and layout), in its
 * own module so MotionProvider can load it after the page becomes interactive
 * instead of parsing it during startup.
 */
export default domMax;
