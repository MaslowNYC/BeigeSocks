
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
      className="bg-white rounded-xl p-6 border border-[#D4D8D0] hover:border-[#8B9E7D] hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-[#2C3E2E] mb-2">{build.title}</h3>
          <p className="text-[#6B7C6B] text-sm">Started: {build.dateStarted}</p>
        </div>
        <Badge
          variant={build.status === 'Completed' ? 'success' : build.status === 'In Progress' ? 'warning' : 'default'}
        >
          {build.status}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#2C3E2E] text-sm">Progress</span>
          <span className="text-[#8B9E7D] font-bold">{build.progress}%</span>
        </div>
        <Progress value={build.progress} className="h-3" />
      </div>

      <div className="mb-4">
        <p className="text-[#6B7C6B] text-sm mb-2">Components used:</p>
        <div className="flex flex-wrap gap-2">
          {build.components.map((component, idx) => (
            <span
              key={idx}
              className="bg-[#F0F2EE] text-[#2C3E2E] px-3 py-1 rounded-full text-xs"
            >
              {component}
            </span>
          ))}
        </div>
      </div>

      <button className="text-[#8B9E7D] hover:text-[#6B8560] text-sm font-medium flex items-center gap-2 transition-colors">
        View Build Log
        <ExternalLink size={16} />
      </button>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Builds - Project Tracker | BeigeSocks</title>
        <meta name="description" content="Track active, planned, and completed electronics projects at BeigeSocks." />
      </Helmet>

      <div className="space-y-12">
        <h1 className="text-4xl font-bold text-[#2C3E2E]">Project Builds</h1>

        {/* Active Builds */}
        <section>
          <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Active Builds</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {builds.active.map((build, index) => (
              <BuildCard key={index} build={build} index={index} />
            ))}
          </div>
        </section>

        {/* Planned */}
        <section>
          <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Planned</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {builds.planned.map((build, index) => (
              <BuildCard key={index} build={build} index={index} />
            ))}
          </div>
        </section>

        {/* Completed */}
        <section>
          <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Completed</h2>
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
