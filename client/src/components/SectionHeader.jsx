import React from 'react';

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
    <div className="mb-10 select-none">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono tracking-tight flex items-center flex-wrap gap-x-3.5 gap-y-1.5">
        <span className="text-[#00ff9d] text-3xl sm:text-4xl md:text-5xl font-extrabold select-none">
          {promptChar}
        </span>
        <span className="text-slate-100 font-bold tracking-normal">{cmdName}</span>
        <span className="text-[#00e5ff] font-bold tracking-normal">{pathArg}</span>
      </h2>
      <div className="flex items-center gap-3 mt-3.5">
        <div className="section-underline"></div>
        <div className="w-2 h-2 rounded-full bg-[#00ff9d]/50 animate-ping"></div>
      </div>
    </div>
  );
};

export default SectionHeader;
