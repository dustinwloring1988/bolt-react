"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import { ImportDialog } from './ImportDialog';

interface ExamplePrompt {
  text: string;
  description: string;
  category: string;
}

interface ChatExamplesProps {
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
}

const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  { 
    text: 'Create a Next.js dashboard with data visualization', 
    description: 'Admin dashboard with charts, dark mode, and responsive design',
    category: 'Dashboard'
  },
  { 
    text: 'Build a GraphQL API with Node.js and TypeScript', 
    description: 'Scalable API with authentication, pagination, and subscriptions',
    category: 'Backend'
  },
  { 
    text: 'Design a landing page for a SaaS product', 
    description: 'Modern, conversion-focused landing with animations',
    category: 'Frontend'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function ImportFromGitHubButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/30 border border-border/30 
                 hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300 text-sm"
    >
      <Github className="w-4 h-4 text-primary/70" />
      <span className="text-foreground/80">Import from GitHub</span>
    </motion.button>
  );
}

export const ChatExamples: React.FC<ChatExamplesProps> = ({ sendMessage }) => {
  const [importOpen, setImportOpen] = useState(false);

  const handleImportComplete = (prompt: string) => {
    sendMessage?.({} as React.UIEvent, prompt);
  };

  return (
    <>
      <motion.div 
        className="w-full max-w-4xl mx-auto mt-4 px-6"
        id="examples"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex items-center gap-3 mb-6"
          variants={itemVariants}
        >
          <div className="w-8 h-px bg-primary/40" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground/70 font-medium">
            Get Started
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            onClick={(event) => sendMessage?.(event, examplePrompt.text)}
            className="group text-left p-5 rounded-xl bg-secondary/20 border border-border/20 
                       hover:bg-secondary/40 hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-wider text-primary/70 font-medium">
                {examplePrompt.category}
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/70 
                                     group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="font-display text-lg text-foreground/90 mb-2 group-hover:text-foreground transition-colors">
              {examplePrompt.text}
            </h3>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              {examplePrompt.description}
            </p>
          </motion.button>
        ))}
        </div>
      </motion.div>

      <ImportDialog 
        open={importOpen} 
        onOpenChange={setImportOpen}
        onImportComplete={handleImportComplete}
      />
    </>
  );
};
