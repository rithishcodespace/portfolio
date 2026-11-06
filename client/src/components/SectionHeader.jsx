import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ command }) => {
  const parseCommand = (cmdStr) => {
    if (!cmdStr) return { promptChar: '>', cmdName: '', pathArg: '' };

    let str = cmdStr.trim();
    let promptChar = '>';
    if (str.startsWith('>')) {
      str = str.substring(1).trim();
    } else if (str.startsWith('$')) {
      promptChar = '$';
      str = str.substring(1).trim();
    }

    const firstSpace = str.indexOf(' ');
    if (firstSpace === -1) {
      return { promptChar, cmdName: str, pathArg: '' };
    }

    const cmdName = str.substring(0, firstSpace);
    const pathArg = str.substring(firstSpace);

    return { promptChar, cmdName, pathArg };
  };

  const { promptChar, cmdName, pathArg } = parseCommand(command);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mb-10 select-none"
    >
      <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold font-mono tracking-tight flex items-center flex-wrap sm:flex-nowrap gap-x-2 sm:gap-x-3 gap-y-1 max-w-full overflow-hidden">
        <span className="text-[#00ff9d] text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold select-none shrink-0">
          {promptChar}
        </span>
        <span className="text-slate-100 font-bold tracking-normal shrink-0">{cmdName}</span>
        <span className="text-[#00e5ff] font-bold tracking-normal truncate">{pathArg}</span>
      </h2>
      <div className="flex items-center gap-3 mt-3.5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="section-underline"
        />
        <div className="w-2 h-2 rounded-full bg-[#00ff9d]/50 animate-ping" />
      </div>
    </motion.div>
  );
};

export default SectionHeader;
