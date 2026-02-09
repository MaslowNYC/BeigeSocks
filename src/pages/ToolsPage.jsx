
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

function ToolsPage() {
  const tools = [
    {
      name: 'Fanttik Screwdriver',
      description: 'Electric precision screwdriver set',
      perfectFor: 'Assembling and disassembling electronics with precision and speed',
    },
    {
      name: 'Klein Multimeter',
      description: 'Digital multimeter with auto-ranging',
      perfectFor: 'Measuring voltage, current, resistance, and continuity in circuits',
    },
    {
      name: 'Lafayette Receiver',
      description: 'Vintage radio receiver for testing',
      perfectFor: 'Testing RF circuits and audio signal processing',
    },
    {
      name: 'Soldering Station',
      description: 'Temperature-controlled soldering iron',
      perfectFor: 'Professional soldering work on PCBs and through-hole components',
    },
    {
      name: 'Wire Stripper',
      description: 'Automatic wire stripping tool',
      perfectFor: 'Quickly stripping wire insulation for clean connections',
    },
    {
      name: 'Oscilloscope',
      description: 'Digital storage oscilloscope',
      perfectFor: 'Analyzing waveforms and debugging signal issues in circuits',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Tools - Tool Library | BeigeSocks</title>
        <meta name="description" content="Essential electronics tools and equipment at BeigeSocks." />
      </Helmet>

      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-[#2C3E2E]">Tool Library</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl overflow-hidden border border-[#D4D8D0] hover:border-[#8B9E7D] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="bg-gradient-to-br from-[#E8EDE5] to-[#F0F2EE] h-48 flex items-center justify-center">
                <div className="text-[#8B9E7D] text-6xl">🔧</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2C3E2E] mb-2">{tool.name}</h3>
                <p className="text-[#6B7C6B] text-sm mb-4">{tool.description}</p>
                <div className="border-t border-[#D4D8D0] pt-4">
                  <p className="text-[#6B7C6B] text-xs mb-2">What it's perfect for:</p>
                  <p className="text-[#2C3E2E] text-sm">{tool.perfectFor}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ToolsPage;
