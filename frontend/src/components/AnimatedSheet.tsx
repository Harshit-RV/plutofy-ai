// TODO: fix width issues:
// even when the sheet is closed, the area is covered so it can't be used for scrolling around the React Flow


import { ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"

interface AnimatedSheetProps {
  isVisible: boolean,
  children: ReactNode,
  topOffset?: number,
  bottomOffset?: number,
  rightOffset?: number,
  leftOffset?: number,
  animationDuration?: number,
  width?: number,
}

const AnimatedSheet = ({ 
  isVisible, 
  children,
  topOffset = 55,
  bottomOffset = 0,
  rightOffset = 0,
  leftOffset = 0,
  animationDuration = 0.25,
  width = 300,
} : AnimatedSheetProps ) => {
  return (
    <div style={{width: width}}>
      <AnimatePresence initial={false}>
        { isVisible ? (
          <motion.div
            initial={{ opacity: 0, x: width, width: 0 }}
            animate={{ opacity: 1, x: 0, width }}
            exit={{ opacity: 0, x: width, width: 0 }}
            transition={{ type: "tween", duration: animationDuration }}
            style={{
              position: "absolute",
              right: rightOffset,
              top: topOffset,
              bottom: bottomOffset,
              left: leftOffset,
              overflow: "hidden",
            }}
            key="box"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
} 

export default AnimatedSheet