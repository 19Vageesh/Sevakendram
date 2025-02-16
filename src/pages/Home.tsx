import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, FileWarning } from 'lucide-react';

export default function Home() {
  const letters = [
    { letter: 'S', color: 'text-white-500'},
    { letter: 'E', color: 'text-white-500'},
    { letter: 'V', color: 'text-orange-500', link: 'https://example.com/a' },
    { letter: 'A', color: 'text-blue-500', link: 'https://example.com/a2' },
    { letter: 'K', color: 'text-white500'},
    { letter: 'E', color: 'text-white-500'},
    { letter: 'N', color: 'text-white-500' },
    { letter: 'D', color: 'text-white-500' },
    { letter: 'R', color: 'text-purple-500', link: 'https://in.linkedin.com/in/rohan-chinta-629229325' },
    { letter: 'A', color: 'text-red-500', link: 'https://example.com/a' },
    { letter: 'M', color: 'text-yellow-500', link: 'https://example.com/m' },
  ];

  return (
    <div className="space-y-8">
      <section className="text-center py-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg">
        <h1 className="text-4xl font-bold mb-4 flex justify-center space-x-1">
          <span>Welcome to </span>
          <div className="flex">
            {letters.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${item.color} hover:scale-110 transition-transform`}
              >
                {item.letter}
              </a>
            ))}
          </div>
        </h1>
        <p className="text-xl mb-8">Your one-stop platform for NITW campus services</p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <Link to="/marketplace" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="text-center space-y-4">
            <ShoppingBag className="w-12 h-12 mx-auto text-blue-400" />
            <h2 className="text-2xl font-semibold">Marketplace</h2>
            <p className="text-gray-300">Buy and sell items within the campus community</p>
          </div>
        </Link>

        <Link to="/mess-menu" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="text-center space-y-4">
            <Calendar className="w-12 h-12 mx-auto text-green-400" />
            <h2 className="text-2xl font-semibold">Mess Menu</h2>
            <p className="text-gray-300">View this week's mess schedule</p>
          </div>
        </Link>

        <Link to="/complaints" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
          <div className="text-center space-y-4">
            <FileWarning className="w-12 h-12 mx-auto text-red-400" />
            <h2 className="text-2xl font-semibold">Complaints</h2>
            <p className="text-gray-300">Submit and track hostel complaints</p>
          </div>
        </Link>
      </div>
    </div>
  );
}