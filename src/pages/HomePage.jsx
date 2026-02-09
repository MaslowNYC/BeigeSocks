
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Hammer, Calculator, FlaskConical, Coffee, ShoppingCart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function HomePage() {
  const navigationCards = [
    { title: 'Workshop', path: '/workshop', icon: Wrench, description: 'Component inventory' },
    { title: 'Builds', path: '/builds', icon: Hammer, description: 'Active projects' },
    { title: 'Tools', path: '/tools', icon: Wrench, description: 'Tool library' },
    { title: 'Lab', path: '/lab', icon: Calculator, description: 'Electronics calculators' },
  ];

  const recentActivity = [
    { action: 'Added ESP32-C6', time: '2 hours ago' },
    { action: 'Added Potentiometers', time: '5 hours ago' },
    { action: 'Updated Arduino Uno stock', time: '1 day ago' },
    { action: 'Added Soldering Iron', time: '2 days ago' },
    { action: 'Added Multimeter', time: '3 days ago' },
  ];

  return (
    <>
      <Helmet>
        <title>BeigeSocks - We make things for stuff and stuff for things...</title>
        <meta name="description" content="Patrick's electronics workshop and project tracker. Building prototypes, managing components, and documenting the journey." />
      </Helmet>

      {/* Hero Section */}
      <section className="min-h-screen bg-[#F5F5F0] flex items-center justify-center -mx-6 -mt-8 mb-12">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#2C3E2E] mb-6">
              BeigeSocks
            </h1>
            <p className="text-xl text-[#6B7C6B] mb-8">
              We make things for stuff and stuff for things...
            </p>
            <div className="flex gap-4">
              <Link
                to="/workshop"
                className="bg-[#8B9E7D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6B8560] transition-colors"
              >
                Browse Workshop
              </Link>
              <Link
                to="/builds"
                className="border-2 border-[#8B9E7D] text-[#8B9E7D] px-6 py-3 rounded-lg font-semibold hover:bg-[#8B9E7D] hover:text-white transition-colors"
              >
                View Builds
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1578240350928-ebba01dc535b"
              alt="Electronics workbench with components and tools"
              className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="bg-[#E8EDE5] rounded-xl p-8 border border-[#D4D8D0]">
          <p className="text-[#2C3E2E] text-2xl text-center">
            <span className="text-[#8B9E7D] font-bold">127</span> components •{' '}
            <span className="text-[#8B9E7D] font-bold">6</span> prototypes •{' '}
            <span className="text-[#8B9E7D] font-bold">43</span> days to launch
          </p>
        </div>
      </motion.section>

      {/* Latest Build Showcase */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Latest Build</h2>
        <div className="bg-white rounded-xl p-8 border border-[#D4D8D0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E2E] mb-2">Prototype #6: Console</h3>
              <p className="text-[#6B7C6B]">Building a custom control console</p>
            </div>
            <span className="text-3xl font-bold text-[#8B9E7D]">75%</span>
          </div>
          <Progress value={75} className="h-3" />
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Recent Activity</h2>
        <div className="bg-white rounded-xl p-6 border border-[#D4D8D0]">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-[#D4D8D0] last:border-0">
                <p className="text-[#2C3E2E]">{activity.action}</p>
                <span className="text-[#6B7C6B] text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Navigation Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-[#2C3E2E] mb-6">Explore</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.path}
                className="bg-white rounded-xl p-6 border border-[#D4D8D0] hover:border-[#8B9E7D] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <Icon className="text-[#8B9E7D] mb-4" size={32} />
                <h3 className="text-xl font-bold text-[#2C3E2E] mb-2">{card.title}</h3>
                <p className="text-[#6B7C6B]">{card.description}</p>
              </Link>
            );
          })}
        </div>
      </motion.section>
    </>
  );
}

export default HomePage;
