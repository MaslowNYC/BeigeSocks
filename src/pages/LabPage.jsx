
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LabPage() {
  // Resistance Calculator
  const [resistanceBands, setResistanceBands] = useState({ band1: 'Brown', band2: 'Black', multiplier: 'Brown' });
  const [resistanceResult, setResistanceResult] = useState('');

  // LED Current Limiter
  const [ledCalc, setLedCalc] = useState({ ledVoltage: '', current: '', supplyVoltage: '' });
  const [ledResult, setLedResult] = useState('');

  // PWM Calculator
  const [pwmCalc, setPwmCalc] = useState({ frequency: '', onTime: '' });
  const [pwmResult, setPwmResult] = useState('');

  // Voltage Divider
  const [voltageDivider, setVoltageDivider] = useState({ vIn: '', r1: '', r2: '' });
  const [voltageResult, setVoltageResult] = useState('');

  // 555 Timer
  const [timer555, setTimer555] = useState({ r1: '', r2: '', c: '' });
  const [timer555Result, setTimer555Result] = useState('');

  // Wire Gauge
  const [wireGauge, setWireGauge] = useState({ length: '', current: '' });
  const [wireResult, setWireResult] = useState('');

  const colorValues = {
    'Black': 0, 'Brown': 1, 'Red': 2, 'Orange': 3, 'Yellow': 4,
    'Green': 5, 'Blue': 6, 'Violet': 7, 'Grey': 8, 'White': 9
  };

  const multiplierValues = {
    'Black': 1, 'Brown': 10, 'Red': 100, 'Orange': 1000, 'Yellow': 10000,
    'Green': 100000, 'Blue': 1000000, 'Gold': 0.1, 'Silver': 0.01
  };

  const calculateResistance = () => {
    const val1 = colorValues[resistanceBands.band1];
    const val2 = colorValues[resistanceBands.band2];
    const mult = multiplierValues[resistanceBands.multiplier];
    const resistance = (val1 * 10 + val2) * mult;
    setResistanceResult(`${resistance} Ω`);
  };

  const calculateLEDResistor = () => {
    const vLed = parseFloat(ledCalc.ledVoltage);
    const i = parseFloat(ledCalc.current) / 1000; // Convert mA to A
    const vSupply = parseFloat(ledCalc.supplyVoltage);
    if (vLed && i && vSupply) {
      const resistor = (vSupply - vLed) / i;
      setLedResult(`${resistor.toFixed(2)} Ω`);
    }
  };

  const calculatePWM = () => {
    const freq = parseFloat(pwmCalc.frequency);
    const onTime = parseFloat(pwmCalc.onTime);
    if (freq && onTime) {
      const period = 1 / freq;
      const dutyCycle = (onTime / period) * 100;
      setPwmResult(`${dutyCycle.toFixed(2)}%`);
    }
  };

  const calculateVoltageDivider = () => {
    const vIn = parseFloat(voltageDivider.vIn);
    const r1 = parseFloat(voltageDivider.r1);
    const r2 = parseFloat(voltageDivider.r2);
    if (vIn && r1 && r2) {
      const vOut = vIn * (r2 / (r1 + r2));
      setVoltageResult(`${vOut.toFixed(2)} V`);
    }
  };

  const calculate555Timer = () => {
    const r1 = parseFloat(timer555.r1);
    const r2 = parseFloat(timer555.r2);
    const c = parseFloat(timer555.c) / 1000000; // Convert µF to F
    if (r1 && r2 && c) {
      const frequency = 1.44 / ((r1 + 2 * r2) * c);
      const dutyCycle = ((r1 + r2) / (r1 + 2 * r2)) * 100;
      setTimer555Result(`Frequency: ${frequency.toFixed(2)} Hz, Duty Cycle: ${dutyCycle.toFixed(2)}%`);
    }
  };

  const calculateWireGauge = () => {
    const length = parseFloat(wireGauge.length);
    const current = parseFloat(wireGauge.current);
    if (length && current) {
      // Simplified wire gauge recommendation
      let gauge = '22 AWG';
      if (current > 5) gauge = '18 AWG';
      if (current > 10) gauge = '14 AWG';
      if (current > 15) gauge = '12 AWG';
      if (current > 20) gauge = '10 AWG';
      setWireResult(`Recommended: ${gauge}`);
    }
  };

  const colorOptions = ['Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet', 'Grey', 'White'];
  const multiplierOptions = ['Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Gold', 'Silver'];

  return (
    <>
      <Helmet>
        <title>The Lab - Electronics Calculators | Beige Socks Workshop</title>
        <meta name="description" content="Interactive electronics calculators for resistors, LEDs, PWM, voltage dividers, 555 timers, and wire gauges." />
      </Helmet>

      {/* Hero Section */}
      <section className="mb-12 -mx-6 -mt-8">
        <div className="relative h-[300px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1590676342854-708a6402d2c1"
            alt="Curious cat examining electronics components on a workbench"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto px-6 py-12 w-full">
              <h1 className="text-5xl font-bold text-[#F5F0E6] mb-2">The Lab</h1>
              <p className="text-xl text-[#D2B48C]">Electronics Calculators</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {/* Beige sock mascot */}
        <div className="fixed bottom-8 right-8 text-6xl opacity-30 pointer-events-none">
          🧦
        </div>

        {/* Resistance Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]"
        >
          <h3 className="text-xl font-bold text-[#F5F0E6] mb-4">Resistance Calculator</h3>
          <div className="space-y-3">
            <select
              value={resistanceBands.band1}
              onChange={(e) => setResistanceBands({ ...resistanceBands, band1: e.target.value })}
              className="w-full bg-[#0A0A0A] text-[#F5F0E6] border border-[#2A2A2A] rounded-md px-3 py-2"
            >
              {colorOptions.map(color => <option key={color}>{color}</option>)}
            </select>
            <select
              value={resistanceBands.band2}
              onChange={(e) => setResistanceBands({ ...resistanceBands, band2: e.target.value })}
              className="w-full bg-[#0A0A0A] text-[#F5F0E6] border border-[#2A2A2A] rounded-md px-3 py-2"
            >
              {colorOptions.map(color => <option key={color}>{color}</option>)}
            </select>
            <select
              value={resistanceBands.multiplier}
              onChange={(e) => setResistanceBands({ ...resistanceBands, multiplier: e.target.value })}
              className="w-full bg-[#0A0A0A] text-[#F5F0E6] border border-[#2A2A2A] rounded-md px-3 py-2"
            >
              {multiplierOptions.map(color => <option key={color}>{color}</option>)}
            </select>
            <Button onClick={calculateResistance} className="w-full bg-[#D2B48C] text-[#0A0A0A] hover:bg-[#C4A67C]">
              Calculate
            </Button>
            {resistanceResult && (
              <div className="bg-[#0A0A0A] rounded-md p-3 text-center">
                <p className="text-[#D2B48C] font-bold">{resistanceResult}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* LED Current Limiter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]"
        >
          <h3 className="text-xl font-bold text-[#F5F0E6] mb-4">LED Current Limiter</h3>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="LED Voltage (V)"
              value={ledCalc.ledVoltage}
              onChange={(e) => setLedCalc({ ...ledCalc, ledVoltage: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Desired Current (mA)"
              value={ledCalc.current}
              onChange={(e) => setLedCalc({ ...ledCalc, current: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Supply Voltage (V)"
              value={ledCalc.supplyVoltage}
              onChange={(e) => setLedCalc({ ...ledCalc, supplyVoltage: e.target.value })}
            />
            <Button onClick={calculateLEDResistor} className="w-full bg-[#D2B48C] text-[#0A0A0A] hover:bg-[#C4A67C]">
              Calculate
            </Button>
            {ledResult && (
              <div className="bg-[#0A0A0A] rounded-md p-3 text-center">
                <p className="text-[#D2B48C] font-bold">{ledResult}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* PWM Duty Cycle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]"
        >
          <h3 className="text-xl font-bold text-[#F5F0E6] mb-4">PWM Duty Cycle</h3>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Frequency (Hz)"
              value={pwmCalc.frequency}
              onChange={(e) => setPwmCalc({ ...pwmCalc, frequency: e.target.value })}
            />
            <Input
              type="number"
              placeholder="On-Time (seconds)"
              value={pwmCalc.onTime}
              onChange={(e) => setPwmCalc({ ...pwmCalc, onTime: e.target.value })}
            />
            <Button onClick={calculatePWM} className="w-full bg-[#D2B48C] text-[#0A0A0A] hover:bg-[#C4A67C]">
              Calculate
            </Button>
            {pwmResult && (
              <div className="bg-[#0A0A0A] rounded-md p-3 text-center">
                <p className="text-[#D2B48C] font-bold">{pwmResult}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Voltage Divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]"
        >
          <h3 className="text-xl font-bold text-[#F5F0E6] mb-4">Voltage Divider</h3>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="V_in (V)"
              value={voltageDivider.vIn}
              onChange={(e) => setVoltageDivider({ ...voltageDivider, vIn: e.target.value })}
            />
            <Input
              type="number"
              placeholder="R1 (Ω)"
              value={voltageDivider.r1}
              onChange={(e) => setVoltageDivider({ ...voltageDivider, r1: e.target.value })}
            />
            <Input
              type="number"
              placeholder="R2 (Ω)"
              value={voltageDivider.r2}
              onChange={(e) => setVoltageDivider({ ...voltageDivider, r2: e.target.value })}
            />
            <Button onClick={calculateVoltageDivider} className="w-full bg-[#D2B48C] text-[#0A0A0A] hover:bg-[#C4A67C]">
              Calculate
            </Button>
            {voltageResult && (
              <div className="bg-[#0A0A0A] rounded-md p-3 text-center">
                <p className="text-[#D2B48C] font-bold">{voltageResult}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 555 Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]"
        >
          <h3 className="text-xl font-bold text-[#F5F0E6] mb-4">555 Timer Calculator</h3>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="R1 (Ω)"
              value={timer555.r1}
              onChange={(e) => setTimer555({ ...timer555, r1: e.target.value })}
            />
            <Input
              type="number"
              placeholder="R2 (Ω)"
              value={timer555.r2}
              onChange={(e) => setTimer555({ ...timer555, r2: e.target.value })}
            />
            <Input
              type="number"
              placeholder="C (µF)"
              value={timer555.c}
              onChange={(e) => setTimer555({ ...timer555, c: e.target.value })}
            />
            <Button onClick={calculate555Timer} className="w-full bg-[#D2B48C] text-[#0A0A0A] hover:bg-[#C4A67C]">
              Calculate
            </Button>
            {timer555Result && (
              <div className="bg-[#0A0A0A] rounded-md p-3 text-center">
                <p className="text-[#D2B48C] font-bold text-sm">{timer555Result}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Wire Gauge Helper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]"
        >
          <h3 className="text-xl font-bold text-[#F5F0E6] mb-4">Wire Gauge Helper</h3>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Wire Length (feet)"
              value={wireGauge.length}
              onChange={(e) => setWireGauge({ ...wireGauge, length: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Current (A)"
              value={wireGauge.current}
              onChange={(e) => setWireGauge({ ...wireGauge, current: e.target.value })}
            />
            <Button onClick={calculateWireGauge} className="w-full bg-[#D2B48C] text-[#0A0A0A] hover:bg-[#C4A67C]">
              Calculate
            </Button>
            {wireResult && (
              <div className="bg-[#0A0A0A] rounded-md p-3 text-center">
                <p className="text-[#D2B48C] font-bold">{wireResult}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default LabPage;
