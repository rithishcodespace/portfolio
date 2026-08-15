import React from 'react';

const SectionHeader = ({ command }) => {
  // Parse command string into command name and argument/path
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

    // Split on first space or slash/flag
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
    <div className="mb-8 select-none">
      <h2 className="text-2xl md:text-4xl font-bold font-mono tracking-tight flex items-center flex-wrap gap-x-3 gap-y-1">
        <span className="text-[#00ff9d] text-2xl md:text-4xl font-extrabold">{promptChar}</span>
        <span className="text-slate-100 font-semibold">{cmdName}</span>
        <span className="text-[#00e5ff] font-semibold">{pathArg}</span>
      </h2>
      <div className="section-underline mt-4"></div>
    </div>
  );
};

export default SectionHeader;
