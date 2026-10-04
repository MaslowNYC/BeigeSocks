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
    to: '/trips',
    label: 'Trips',
  },
];

function HomePage() {
  return (
    <>
      <Helmet>
        <title>BeigeSocks</title>
        <meta name="description" content="Socks, a snail, and a pigeon who plays ball." />
      </Helmet>

      <div className="h-[100dvh] w-screen bg-[#F6F1E7] p-4 sm:p-6">
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
                  className="group relative block overflow-hidden rounded-2xl border border-[#E2D7C3] shadow-sm transition-shadow hover:shadow-lg"
                >
                  {image}
                  <span className="sweatband absolute inset-x-0 top-0 h-2.5" aria-hidden="true" />
                  <span className="band-pill absolute bottom-3 left-1/2 -translate-x-1/2 transition-transform duration-300 group-hover:-translate-y-1">
                    {tile.label}
                  </span>
                </Link>
              );
            }

            return (
              <div
                key={tile.src}
                className="group overflow-hidden rounded-2xl border border-[#E2D7C3] shadow-sm"
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
