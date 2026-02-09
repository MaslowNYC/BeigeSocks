
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

function WishListPage() {
  const { toast } = useToast();
  const [sortByPriority, setSortByPriority] = useState(false);

  const wishListItems = [
    { name: 'OLED Display', price: 25, store: 'Amazon', priority: 1, link: 'https://amazon.com/oled-display' },
    { name: 'Servo Motors', price: 15, store: 'Microcenter', priority: 1, link: 'https://microcenter.com/servo-motors' },
    { name: 'Power Relay', price: 8, store: 'Amazon', priority: 2, link: 'https://amazon.com/power-relay' },
    { name: 'Audio Jack', price: 3, store: 'Amazon', priority: 2, link: 'https://amazon.com/audio-jack' },
    { name: 'USB-C Cable', price: 12, store: 'Amazon', priority: 3, link: 'https://amazon.com/usbc-cable' },
  ];

  const sortedItems = sortByPriority
    ? [...wishListItems].sort((a, b) => a.priority - b.priority)
    : wishListItems;

  const totalCost = wishListItems.reduce((sum, item) => sum + item.price, 0);

  const handleCopyAllLinks = async () => {
    const allLinks = wishListItems.map(item => `${item.name}: ${item.link}`).join('\n');
    try {
      await navigator.clipboard.writeText(allLinks);
      toast({
        title: "Links copied!",
        description: "All shopping links have been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy links to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority) => {
    if (priority === 1) return { variant: 'danger', text: 'High' };
    if (priority === 2) return { variant: 'warning', text: 'Medium' };
    return { variant: 'default', text: 'Low' };
  };

  return (
    <>
      <Helmet>
        <title>Wish List - Shopping Queue | BeigeSocks</title>
        <meta name="description" content="Components and parts needed for upcoming projects at BeigeSocks." />
      </Helmet>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#2C3E2E]">Shopping Queue</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => setSortByPriority(!sortByPriority)}
              variant="outline"
              className="bg-white text-[#2C3E2E] border-[#D4D8D0] hover:bg-[#F0F2EE]"
            >
              <ArrowUpDown className="mr-2" size={16} />
              Sort by Priority
            </Button>
            <Button
              onClick={handleCopyAllLinks}
              className="bg-[#8B9E7D] text-white hover:bg-[#6B8560]"
            >
              <Copy className="mr-2" size={16} />
              Copy All Links
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {sortedItems.map((item, index) => {
            const priorityBadge = getPriorityBadge(item.priority);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-[#D4D8D0] hover:border-[#8B9E7D] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#2C3E2E]">{item.name}</h3>
                      <Badge variant={priorityBadge.variant}>
                        Priority {item.priority} - {priorityBadge.text}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-[#6B7C6B]">
                        Store: <span className="text-[#2C3E2E]">{item.store}</span>
                      </span>
                      <span className="text-[#6B7C6B]">
                        Price: <span className="text-[#D2B48C] font-bold">${item.price}</span>
                      </span>
                    </div>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#8B9E7D] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#6B8560] transition-colors flex items-center gap-2"
                  >
                    Buy Now
                    <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#D4D8D0]">
          <div className="flex items-center justify-between">
            <span className="text-xl text-[#2C3E2E]">Total Cost:</span>
            <span className="text-3xl font-bold text-[#D2B48C]">${totalCost}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default WishListPage;
