"use client";
import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return <motion.div aria-hidden style={{ scaleX }} className="accent-grad fixed inset-x-0 top-0 z-[90] h-[3px] origin-left" />;
}
