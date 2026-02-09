
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
        <title>Wish List - Shopping Queue | Beige Socks Workshop</title>
        <meta name="description" content="Components and parts needed for upcoming projects at Beige Socks Workshop." />
      </Helmet>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#F5F0E6]">Shopping Queue</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => setSortByPriority(!sortByPriority)}
              variant="outline"
              className="bg-[#1A1A1A] text-[#F5F0E6] border-[#2A2A2A] hover:bg-[#2A2A2A]"
            >
              <ArrowUpDown className="mr-2" size={16} />
              Sort by Priority
            </Button>
            <Button
              onClick={handleCopyAllLinks}
              className="bg-[#D2B48C] text-[#0A0A0A] hover:bg-[#C4A67C]"
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
                className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#D2B48C] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#F5F0E6]">{item.name}</h3>
                      <Badge variant={priorityBadge.variant}>
                        Priority {item.priority} - {priorityBadge.text}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-[#64748B]">
                        Store: <span className="text-[#F5F0E6]">{item.store}</span>
                      </span>
                      <span className="text-[#64748B]">
                        Price: <span className="text-[#D2B48C] font-bold">${item.price}</span>
                      </span>
                    </div>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#D2B48C] text-[#0A0A0A] px-4 py-2 rounded-lg font-medium hover:bg-[#C4A67C] transition-colors flex items-center gap-2"
                  >
                    Buy Now
                    <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <span className="text-xl text-[#F5F0E6]">Total Cost:</span>
            <span className="text-3xl font-bold text-[#D2B48C]">${totalCost}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default WishListPage;
