import React from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Education from './components/Education';
import Contact from './components/Contact';

function App() {
  return (
    <div className="relative min-h-screen bg-[#070e10] text-slate-200 overflow-x-hidden selection:bg-[#00ff9d] selection:text-black font-mono">
      {/* Animated Live Dot Particle Background */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
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

        {/* 6. Achievements Section: cat /var/log/achievements.log */}
        <Achievements />

        {/* 7. Education Section: cat /etc/education.conf */}
        <Education />

        {/* 8. Contact Section: ssh chetancdhri@contact-server */}
        <Contact />
      </main>

      {/* Terminal Footer */}
      <footer className="relative z-10 border-t border-[#00ff9d]/15 py-8 text-center text-sm text-slate-300 font-mono bg-[#070e10]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
          <p className="flex items-center gap-2 text-slate-300">
            <span>© 2025 Rithish S</span>
            <span className="text-[#00ff9d] font-bold">|</span>
            <span className="text-[#00ff9d]">
              $ systemctl status portfolio --all-systems-optimal
            </span>
          </p>
          <p className="text-xs text-slate-400 flex flex-wrap justify-center gap-2">
            <span>Java</span> • <span>Spring Boot</span> • <span>Microservices</span> •{' '}
            <span>Docker</span> • <span>Kubernetes</span> • <span>AWS</span> •{' '}
            <span>Kafka</span> • <span>Distributed Systems</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
