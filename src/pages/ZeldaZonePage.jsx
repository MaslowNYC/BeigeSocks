
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
        <title>Zelda Zone - Do Not Touch! | BeigeSocks</title>
        <meta name="description" content="Zelda's protected electronics kit - unauthorized access strictly prohibited!" />
      </Helmet>

      <div className="border-4 border-[#B85C5C] rounded-xl p-8 space-y-8">
        {/* Warning Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <AlertTriangle className="mx-auto text-[#B85C5C]" size={64} />
          <h1 className="text-4xl font-bold text-[#B85C5C]">
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
            className="rounded-xl w-full h-[400px] object-cover border-4 border-[#B85C5C]"
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
              <p className="text-[#2C3E2E] text-xl">
                {clickCount < 10 ? `${10 - clickCount} clicks to unlock` : 'Unlocking...'}
              </p>
              <Button
                onClick={() => setClickCount(clickCount + 1)}
                className="bg-[#B85C5C] hover:bg-[#A04E4E] text-white text-lg px-8 py-6"
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
              <div className="bg-[#B85C5C]/10 border-2 border-[#B85C5C] rounded-xl p-6">
                <h2 className="text-2xl font-bold text-[#2C3E2E] mb-4">
                  🔓 Unlocked - But Ask Permission First!
                </h2>
                <p className="text-[#8B9E7D] mb-6">
                  Zelda's Components (Handle with care!)
                </p>

                <div className="space-y-3">
                  {zeldaComponents.map((component, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 flex items-center justify-between"
                    >
                      <span className="text-[#2C3E2E] font-medium">{component.name}</span>
                      <span className="bg-[#B85C5C] text-white px-3 py-1 rounded-full text-sm font-bold">
                        {component.quantity}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[#B85C5C] text-sm mt-6 font-bold">
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
