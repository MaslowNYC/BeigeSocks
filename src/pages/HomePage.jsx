import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const TILES = [
  { src: '/Socks.JPG', alt: 'Cream socks with little faces' },
  { src: '/Socks1.JPG', alt: 'Yellow socks with sleepy eyes' },
  { src: '/Snail.JPG', alt: 'Snail wearing a sweatband' },
  {
    src: '/Pigeon.JPG',
    alt: 'Pigeon with a sweatband and a basketball',
    to: '/pack',
    label: 'Open the Pack',
  },
];

function HomePage() {
  return (
    <>
      <Helmet>
        <title>BeigeSocks</title>
        <meta name="description" content="Socks, snails, and a pigeon who plays ball." />
      </Helmet>

      <div className="h-[100dvh] w-screen bg-[#F5F5F0] p-4 sm:p-6">
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 sm:gap-6">
          {TILES.map((tile) => {
            const image = (
              <img
                src={tile.src}
                alt={tile.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            );

            if (tile.to) {
              return (
                <Link
                  key={tile.src}
                  to={tile.to}
                  aria-label={tile.label}
                  className="group relative block overflow-hidden rounded-2xl border border-[#D4D8D0] shadow-sm transition-shadow hover:shadow-lg"
                >
                  {image}
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2C3E2E]/85 px-4 py-1.5 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {tile.label}
                  </span>
                </Link>
              );
            }

            return (
              <div
                key={tile.src}
                className="group overflow-hidden rounded-2xl border border-[#D4D8D0] shadow-sm"
              >
                {image}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default HomePage;
