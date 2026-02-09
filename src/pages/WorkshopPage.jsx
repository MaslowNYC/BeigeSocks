
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

function WorkshopPage() {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = ['All', 'Microcontrollers', 'Controls', 'Power', 'Audio', 'Displays', 'Tools'];

  const components = [
    { name: 'ESP32-C6', category: 'Microcontrollers', quantity: 5, status: 'Available', specs: 'WiFi 6, BLE 5.0' },
    { name: 'Arduino Uno', category: 'Microcontrollers', quantity: 3, status: 'Available', specs: 'ATmega328P, 16MHz' },
    { name: 'Potentiometers', category: 'Controls', quantity: 20, status: 'Available', specs: '10kΩ, Linear' },
    { name: 'Resistors', category: 'Power', quantity: 150, status: 'Available', specs: 'Assorted values' },
    { name: 'LEDs', category: 'Displays', quantity: 50, status: 'In Use', specs: 'Red, Green, Blue' },
    { name: 'Capacitors', category: 'Power', quantity: 80, status: 'Available', specs: 'Electrolytic, Ceramic' },
    { name: 'Breadboards', category: 'Tools', quantity: 4, status: 'In Use', specs: '830 tie-points' },
    { name: 'Jumper Wires', category: 'Tools', quantity: 100, status: 'Available', specs: 'Male-Male, Female-Female' },
    { name: 'Soldering Iron', category: 'Tools', quantity: 1, status: 'Available', specs: 'Temperature controlled' },
    { name: 'Multimeter', category: 'Tools', quantity: 2, status: 'Need to Buy', specs: 'Digital, Auto-ranging' },
  ];

  const filteredComponents = components.filter(component => {
    const matchesFilter = activeFilter === 'All' || component.category === activeFilter;
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusVariant = (status) => {
    if (status === 'Available') return 'success';
    if (status === 'In Use') return 'warning';
    if (status === 'Need to Buy') return 'danger';
    return 'default';
  };

  const handleAddComponent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Workshop - Component Inventory | BeigeSocks</title>
        <meta name="description" content="Browse and manage electronics components in Patrick's workshop inventory." />
      </Helmet>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#2C3E2E]">Component Inventory</h1>
          <Button onClick={handleAddComponent} className="bg-[#8B9E7D] text-white hover:bg-[#6B8560]">
            <Plus className="mr-2" size={18} />
            Add Component
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C6B]" size={20} />
          <Input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-[#8B9E7D] text-white'
                  : 'bg-white text-[#2C3E2E] border border-[#D4D8D0] hover:bg-[#F0F2EE]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Component Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 border border-[#D4D8D0] hover:border-[#8B9E7D] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2C3E2E] mb-1">{component.name}</h3>
                  <p className="text-[#6B7C6B] text-sm">{component.category}</p>
                </div>
                <Badge variant={getStatusVariant(component.status)}>
                  {component.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7C6B] text-sm">Quantity:</span>
                  <span className="text-[#2C3E2E] font-semibold">{component.quantity}</span>
                </div>
                <div>
                  <span className="text-[#6B7C6B] text-sm block mb-1">Specs:</span>
                  <p className="text-[#2C3E2E] text-sm">{component.specs}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B7C6B] text-lg">No components found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default WorkshopPage;
