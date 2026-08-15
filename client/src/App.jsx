import React from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';

function App() {
  return (
    <div className="relative min-h-screen bg-[#070e10] text-slate-200 overflow-x-hidden selection:bg-[#00ff9d] selection:text-black font-mono">
      {/* Animated Live Dot Particle Background */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections strictly adhering to provided screenshots */}
      <main className="relative z-10 space-y-8 sm:space-y-16 pb-24">
        {/* 1. Hero Section: ./init_session.sh */}
        <Hero />

        {/* 2. About Section: cat /profile/summary.md */}
        <About />

        {/* 3. Skills Section: ls -la /tech_stack/ */}
        <Skills />

        {/* 4. Experience Section: journalctl --unit=work-experience */}
        <Experience />

        {/* 5. Projects Section: docker ps --filter status=running */}
        <Projects />
      </main>

      {/* Terminal Footer */}
      <footer className="relative z-10 border-t border-[#00ff9d]/15 py-8 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <span className="text-[#00ff9d] font-bold">&gt;</span>
            <span>Chetan Chaudhari © {new Date().getFullYear()}</span>
          </p>
          <p className="text-slate-400 text-[11px]">
            System Status: <span className="text-[#00ff9d]">ONLINE [ALL_SERVICES_OPERATIONAL]</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
