
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

function BuildsPage() {
  const builds = {
    active: [
      {
        title: 'Console',
        status: 'In Progress',
        progress: 75,
        dateStarted: 'Jan 15, 2026',
        components: ['ESP32-C6', 'Potentiometers', 'LEDs'],
      },
      {
        title: 'Door Sign',
        status: 'In Progress',
        progress: 50,
        dateStarted: 'Jan 20, 2026',
        components: ['Arduino Uno', 'OLED Display', 'Sensor'],
      },
    ],
    planned: [
      {
        title: 'LED Matrix',
        status: 'Planned',
        progress: 0,
        dateStarted: 'Not started',
        components: ['ESP32', 'LED Matrix', 'Power Supply'],
      },
      {
        title: 'Power Supply',
        status: 'Planned',
        progress: 0,
        dateStarted: 'Not started',
        components: ['Transformer', 'Capacitors', 'Voltage Regulator'],
      },
    ],
    completed: [
      {
        title: 'Audio Amplifier',
        status: 'Completed',
        progress: 100,
        dateStarted: 'Dec 1, 2025',
        components: ['LM386', 'Resistors', 'Capacitors'],
      },
    ],
  };

  const BuildCard = ({ build, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#D2B48C] hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-[#F5F0E6] mb-2">{build.title}</h3>
          <p className="text-[#64748B] text-sm">Started: {build.dateStarted}</p>
        </div>
        <Badge 
          variant={build.status === 'Completed' ? 'success' : build.status === 'In Progress' ? 'warning' : 'default'}
        >
          {build.status}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#F5F0E6] text-sm">Progress</span>
          <span className="text-[#D2B48C] font-bold">{build.progress}%</span>
        </div>
        <Progress value={build.progress} className="h-3" />
      </div>

      <div className="mb-4">
        <p className="text-[#64748B] text-sm mb-2">Components used:</p>
        <div className="flex flex-wrap gap-2">
          {build.components.map((component, idx) => (
            <span
              key={idx}
              className="bg-[#0A0A0A] text-[#F5F0E6] px-3 py-1 rounded-full text-xs"
            >
              {component}
            </span>
          ))}
        </div>
      </div>

      <button className="text-[#D2B48C] hover:text-[#C4A67C] text-sm font-medium flex items-center gap-2 transition-colors">
        View Build Log
        <ExternalLink size={16} />
      </button>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Builds - Project Tracker | Beige Socks Workshop</title>
        <meta name="description" content="Track active, planned, and completed electronics projects at Beige Socks Workshop." />
      </Helmet>

      <div className="space-y-12">
        <h1 className="text-4xl font-bold text-[#F5F0E6]">Project Builds</h1>

        {/* Active Builds */}
        <section>
          <h2 className="text-3xl font-bold text-[#F5F0E6] mb-6">Active Builds</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {builds.active.map((build, index) => (
              <BuildCard key={index} build={build} index={index} />
            ))}
          </div>
        </section>

        {/* Planned */}
        <section>
          <h2 className="text-3xl font-bold text-[#F5F0E6] mb-6">Planned</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {builds.planned.map((build, index) => (
              <BuildCard key={index} build={build} index={index} />
            ))}
          </div>
        </section>

        {/* Completed */}
        <section>
          <h2 className="text-3xl font-bold text-[#F5F0E6] mb-6">Completed</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {builds.completed.map((build, index) => (
              <BuildCard key={index} build={build} index={index} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default BuildsPage;
