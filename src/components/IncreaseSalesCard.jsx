import React from "react";

const IncreaseSalesCard = () => (
  <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6 overflow-hidden flex flex-col justify-between h-full transition-all hover:shadow-xl">
    {/* Diagonal pattern background */}
    <div className="absolute inset-0 opacity-10">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <pattern
          id="diagonal-stripe-1"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="5" height="10" fill="white" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#diagonal-stripe-1)" />
      </svg>
    </div>

    <div className="relative">
      <h3 className="text-xl font-semibold mb-3">Increase your sales</h3>
      <p className="text-sm text-blue-100 mb-6 leading-relaxed">
        Discover the Proven Methods to Skyrocket Your Sales! Unleash the
        Potential of Your Business and Achieve Remarkable Growth. Whether you're
        a seasoned entrepreneur or just starting out.
      </p>
      <p className="text-sm text-blue-100 mb-6 leading-relaxed">
        Discover the Proven Methods to Skyrocket Your Sales! Unleash the
        Potential of Your Business and Achieve Remarkable Growth. Whether you're
        a seasoned entrepreneur or just starting out.
      </p>
    </div>

    <button className="relative bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors duration-200 self-start flex items-center group">
      Learn More
      <svg
        className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
);

export default IncreaseSalesCard;
