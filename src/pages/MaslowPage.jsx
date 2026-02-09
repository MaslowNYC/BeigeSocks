
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
        <title>Maslow NYC Project Tracker | Beige Socks Workshop</title>
        <meta name="description" content="Track progress on Maslow NYC prototypes and projects." />
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#F5F0E6] mb-4">Maslow NYC Project Tracker</h1>
          <a
            href="https://maslownyc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#D2B48C] hover:text-[#C4A67C] transition-colors text-lg"
          >
            Visit maslownyc.com
            <ExternalLink size={20} />
          </a>
        </div>

        {/* Current Prototype Progress */}
        <section>
          <h2 className="text-3xl font-bold text-[#F5F0E6] mb-6">Current Prototype Progress</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {prototypes.map((prototype, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#F5F0E6]">{prototype.name}</h3>
                    <p className="text-[#64748B] text-sm">Started: {prototype.startDate}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#D2B48C]">{prototype.progress}%</span>
                </div>
                <Progress value={prototype.progress} className="h-3 mb-4" />
                
                {/* Placeholder photo */}
                <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] h-40 rounded-lg flex items-center justify-center">
                  <span className="text-[#64748B] text-4xl">📦</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline View */}
        <section>
          <h2 className="text-3xl font-bold text-[#F5F0E6] mb-6">Timeline</h2>
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
            <div className="space-y-4">
              {prototypes.map((prototype, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 pb-4 border-b border-[#2A2A2A] last:border-0"
                >
                  <div className="bg-[#D2B48C] rounded-full w-3 h-3 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-[#F5F0E6] font-medium">{prototype.name}</p>
                    <p className="text-[#64748B] text-sm">{prototype.startDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D2B48C] font-bold">{prototype.progress}%</p>
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
