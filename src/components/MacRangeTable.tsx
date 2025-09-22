import React, { useState } from 'react';
import { deviceModels, getModelByteRanges } from '../data/deviceModels';

interface MacRangeTableProps {
  currentModelByte?: string;
}

export const MacRangeTable: React.FC<MacRangeTableProps> = ({ currentModelByte }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert device models to table format with MAC ranges
  const tableData = Object.values(deviceModels).map((device) => {
    // Get the first MAC range for display (most devices have only one)
    const firstMacRange = device.macRange[0];
    const modelByteRanges = getModelByteRanges(device);
    
    // Use actual MAC range start and end
    const firstMac = firstMacRange.start.replace(/-/g, ':');
    const lastMac = firstMacRange.end.replace(/-/g, ':');

    // Check if current model byte falls within any of the device's ranges
    const isCurrent = currentModelByte && modelByteRanges.some(range => {
      const currentValue = parseInt(currentModelByte, 16);
      const startValue = parseInt(range.start, 16);
      const endValue = parseInt(range.end, 16);
      return currentValue >= startValue && currentValue <= endValue;
    });

    return {
      deviceName: device.name,
      generation: device.generation,
      firstMac,
      lastMac,
      isCurrent
    };
  }).sort((a, b) => a.deviceName.localeCompare(b.deviceName));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 px-6 py-4 transition-colors duration-300">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-bold">MAC Address Ranges by Device</h3>
          </div>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`transition-all duration-400 ease-in-out overflow-hidden ${
        isExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
      }`}>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Device Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Generation</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">First MAC Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Last MAC Address</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((device, index) => (
                  <tr
                    key={device.deviceName}
                    className={`border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fade-in ${
                      device.isCurrent ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
                      {device.deviceName}
                      {device.isCurrent && (
                        <span className="ml-2 text-purple-600 dark:text-purple-400 transition-colors duration-300">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        device.generation === 1
                          ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                          : 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                      }`}>
                        {device.generation}{device.generation === 1 ? 'st' : 'nd'} Gen
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {device.firstMac}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {device.lastMac}
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