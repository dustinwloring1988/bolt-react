import { PaperPlaneRight, CircleNotch, Stop } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="flex justify-center items-center p-0 bg-primary hover:bg-primary/90 text-primary-foreground
                     rounded-lg w-10 h-10 shadow-lg shadow-primary/20 transition-all duration-200
                     hover:scale-105 active:scale-95"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
          }}
        >
          {isStreaming ? (
            <Stop className="w-5 h-5" weight="fill" />
          ) : (
            <PaperPlaneRight className="w-5 h-5" weight="fill" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
