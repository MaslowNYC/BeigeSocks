
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function MaslowPage() {
  const prototypes = [
    { name: 'Console', progress: 75, startDate: 'Jan 15, 2026' },
    { name: 'Door Sign', progress: 50, startDate: 'Jan 20, 2026' },
    { name: 'LED Matrix', progress: 25, startDate: 'Jan 25, 2026' },
    { name: 'Power Supply', progress: 40, startDate: 'Jan 22, 2026' },
  ];

  return (
    <>
      <Helmet>
        <title>Maslow NYC Project Tracker | BeigeSocks</title>
        <meta name="description" content="Track progress on Maslow NYC prototypes and projects." />
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#2C3E2E] mb-4">Maslow NYC Project Tracker</h1>
          <a
            href="https://maslownyc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#8B9E7D] hover:text-[#6B8560] transition-colors text-lg"
          >
            Visit maslownyc.com
            <ExternalLink size={20} />
          </a>
        </div>

        {/* Current Prototype Progress */}
        <section>
          <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Current Prototype Progress</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {prototypes.map((prototype, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-[#D4D8D0]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C3E2E]">{prototype.name}</h3>
                    <p className="text-[#6B7C6B] text-sm">Started: {prototype.startDate}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#8B9E7D]">{prototype.progress}%</span>
                </div>
                <Progress value={prototype.progress} className="h-3 mb-4" />

                {/* Placeholder photo */}
                <div className="bg-gradient-to-br from-[#E8EDE5] to-[#F0F2EE] h-40 rounded-lg flex items-center justify-center">
                  <span className="text-[#6B7C6B] text-4xl">📦</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline View */}
        <section>
          <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Timeline</h2>
          <div className="bg-white rounded-xl p-6 border border-[#D4D8D0]">
            <div className="space-y-4">
              {prototypes.map((prototype, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 pb-4 border-b border-[#D4D8D0] last:border-0"
                >
                  <div className="bg-[#8B9E7D] rounded-full w-3 h-3 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-[#2C3E2E] font-medium">{prototype.name}</p>
                    <p className="text-[#6B7C6B] text-sm">{prototype.startDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#8B9E7D] font-bold">{prototype.progress}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default MaslowPage;
