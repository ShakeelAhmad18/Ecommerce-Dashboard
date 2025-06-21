import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronRight } from "lucide-react";

// Create custom markers
const customIcon = (color) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const provinces = [
  {
    name: "Fast Java",
    growth: 50,
    position: [-7.2504, 112.7688],
    color: "#3B82F6",
  },
  {
    name: "Kailmantan",
    growth: 50,
    position: [-0.7893, 113.9213],
    color: "#10B981",
  },
  { name: "Bali", growth: 65, position: [-8.3405, 115.092], color: "#EF4444" },
];

const popularProducts = [
  {
    id: "O2I231",
    name: "Kanky Kitadakate (Green)",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 20.0,
    sales: 3000,
    status: "Success",
  },
  {
    id: "O2I232",
    name: "Kanky Kitadakate (Blue)",
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 20.0,
    sales: 2311,
    status: "Success",
  },
  {
    id: "O2I233",
    name: "Kanky Kitadakate (Red)",
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 20.0,
    sales: 2111,
    status: "Success",
  },
  {
    id: "O2I234",
    name: "Kanky Kitadakate (Yellow)",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 20.0,
    sales: 1661,
    status: "Success",
  },
];


const DashboardContentRow2 = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-inter">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Customer Growth Map */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Customer Growth
            </h3>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                3 Province
              </span>
              <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Show All{" "}
                <ChevronRight className="ml-1 mb-2 w-4 h-4 transform -rotate-45" />
              </button>
            </div>
          </div>

          <div className="h-[300px] rounded-lg overflow-hidden relative">
            <MapContainer
              center={[-2.5489, 118.0149]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Fix for marker icons */}
              {provinces.map((province, index) => {
                // Create marker icon dynamically
                const markerHtml = `
          <div style="
            background-color: ${province.color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
          ">
            ${province.growth}%
          </div>
        `;

                return (
                  <Marker
                    key={index}
                    position={province.position}
                    icon={L.divIcon({
                      html: markerHtml,
                      className: "",
                      iconSize: [24, 24],
                      iconAnchor: [12, 12],
                    })}
                  >
                    <Popup>
                      <div className="text-sm font-medium">
                        <p className="font-semibold">{province.name}</p>
                        <p className="mt-1">
                          Growth:{" "}
                          <span className="font-bold">{province.growth}%</span>
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Fixed legend styling */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 z-[1000]">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-2">
                PROVINCE GROWTH
              </h4>
              {provinces.map((province, index) => (
                <div key={index} className="flex items-center mb-2 last:mb-0">
                  <div
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: province.color }}
                  />
                  <div className="flex justify-between w-full">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                      {province.name}
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 ml-2">
                      {province.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Product Popularity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Product Popular
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Show All{" "}
              <ChevronRight className="ml-1 mb-2 w-4 h-4 transform -rotate-45" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Sales
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {popularProducts.map((product, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.sales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === "Success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContentRow2;
