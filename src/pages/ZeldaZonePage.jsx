
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ZeldaZonePage() {
  const [clickCount, setClickCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const savedClickCount = localStorage.getItem('zeldaClickCount');
    const savedUnlocked = localStorage.getItem('zeldaUnlocked');
    if (savedClickCount) setClickCount(parseInt(savedClickCount));
    if (savedUnlocked === 'true') setIsUnlocked(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('zeldaClickCount', clickCount.toString());
    if (clickCount >= 10) {
      setIsUnlocked(true);
      localStorage.setItem('zeldaUnlocked', 'true');
    }
  }, [clickCount]);

  const zeldaComponents = [
    { name: 'Servo Motors', quantity: 5 },
    { name: 'Power Relays', quantity: 3 },
    { name: 'Audio Jacks', quantity: 2 },
    { name: 'USB Cables', quantity: 4 },
    { name: 'OLED Displays', quantity: 1 },
  ];

  return (
    <>
      <Helmet>
        <title>Zelda Zone - Do Not Touch! | Beige Socks Workshop</title>
        <meta name="description" content="Zelda's protected electronics kit - unauthorized access strictly prohibited!" />
      </Helmet>

      <div className="border-4 border-red-600 rounded-xl p-8 space-y-8">
        {/* Warning Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <AlertTriangle className="mx-auto text-red-600" size={64} />
          <h1 className="text-4xl font-bold text-red-600">
            ⚠️ ZELDA'S ELECTRONICS KIT - DO NOT TOUCH ⚠️
          </h1>
        </motion.div>

        {/* Guard Dog Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <img
            src="https://images.unsplash.com/photo-1584118338584-b0a36e8679a3"
            alt="Alert guard dog protecting electronics equipment"
            className="rounded-xl w-full h-[400px] object-cover border-4 border-red-600"
          />
        </motion.div>

        {/* Click Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center space-y-4"
        >
          {!isUnlocked ? (
            <>
              <p className="text-[#F5F0E6] text-xl">
                {clickCount < 10 ? `${10 - clickCount} clicks to unlock` : 'Unlocking...'}
              </p>
              <Button
                onClick={() => setClickCount(clickCount + 1)}
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
              >
                Click to Unlock ({clickCount}/10)
              </Button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-red-900/20 border-2 border-red-600 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-[#F5F0E6] mb-4">
                  🔓 Unlocked - But Ask Permission First!
                </h2>
                <p className="text-[#D2B48C] mb-6">
                  Zelda's Components (Handle with care!)
                </p>

                <div className="space-y-3">
                  {zeldaComponents.map((component, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between"
                    >
                      <span className="text-[#F5F0E6] font-medium">{component.name}</span>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {component.quantity}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-red-400 text-sm mt-6 font-bold">
                  ⚠️ Remember: These are Zelda's. Ask before borrowing! ⚠️
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default ZeldaZonePage;
