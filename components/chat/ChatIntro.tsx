"use client"
import React from 'react';
import { motion } from 'framer-motion';

export const ChatIntro: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.8
      }
    }
  };

  return (
    <div className="relative z-10" id='intro'>
      <motion.div 
        className="relative z-10 mt-[18vh] max-w-3xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative Line */}
        <motion.div 
          className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        
        {/* Main Title */}
        <motion.h1 
          className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
          variants={itemVariants}
        >
          <span className="text-foreground">Build Your</span>
          <br />
          <span className="text-gradient-gold italic">Vision</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground font-light mb-10 max-w-xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Create full-stack applications with the elegance of conversation.
          <br className="hidden md:block" />
          <span className="text-foreground/70">No code, just clarity.</span>
        </motion.p>

        {/* Bottom Line */}
        <motion.div 
          className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.div>
    </div>
  );
};

export default ChatIntro;
