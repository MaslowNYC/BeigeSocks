
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

function CoffeeCounterPage() {
  const [stats, setStats] = useState({
    coffee: 127,
    prototypes: 6,
    daysToLaunch: 43,
    ideas: 284,
    bugs: 91,
    eureka: 12,
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('coffeeStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('coffeeStats', JSON.stringify(stats));
  }, [stats]);

  const statCards = [
    { key: 'coffee', emoji: '☕', label: 'Coffee consumed', unit: 'cups' },
    { key: 'prototypes', emoji: '🔨', label: 'Prototypes built', unit: '' },
    { key: 'daysToLaunch', emoji: '⏰', label: 'Days until launch', unit: '' },
    { key: 'ideas', emoji: '💡', label: 'Ideas generated', unit: '' },
    { key: 'bugs', emoji: '🐛', label: 'Bugs fixed', unit: '' },
    { key: 'eureka', emoji: '🎉', label: 'Eureka moments', unit: '' },
  ];

  const incrementStat = (key) => {
    setStats((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  return (
    <>
      <Helmet>
        <title>The Coffee Counter - Silly Stats Dashboard | BeigeSocks</title>
        <meta name="description" content="Track absurd workshop statistics with incrementable counters." />
      </Helmet>

      {/* Hero Section */}
      <section className="mb-12 -mx-6 -mt-8">
        <div className="relative h-[300px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1639275617881-d4d39df84950"
            alt="Tired sock character next to coffee cup on wooden surface"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F0] via-[#F5F5F0]/70 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto px-6 py-12 w-full">
              <h1 className="text-5xl font-bold text-[#2C3E2E] mb-2">The Coffee Counter</h1>
              <p className="text-xl text-[#6B7C6B]">Silly Stats Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.button
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => incrementStat(stat.key)}
            className="bg-white rounded-xl p-8 border border-[#D4D8D0] hover:border-[#8B9E7D] transition-all duration-200 text-left cursor-pointer"
          >
            <div className="text-5xl mb-4">{stat.emoji}</div>
            <div className="text-5xl font-bold text-[#2C3E2E] mb-2">
              {stats[stat.key]}
            </div>
            <p className="text-[#2C3E2E] text-lg font-medium mb-1">{stat.label}</p>
            {stat.unit && (
              <p className="text-[#6B7C6B] text-sm">{stat.unit}</p>
            )}
            <p className="text-[#6B7C6B] text-xs mt-4 italic">Click to increment</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[#6B7C6B] italic">
          These numbers are completely arbitrary and serve no purpose whatsoever. But they're fun to track! 🎯
        </p>
      </div>
    </>
  );
}

export default CoffeeCounterPage;
