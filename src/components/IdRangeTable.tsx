import React, { useState } from 'react';
import { deviceModels, getModelByteRanges } from '../data/deviceModels';

interface IdRangeTableProps {
  currentModelByte?: string;
}

export const IdRangeTable: React.FC<IdRangeTableProps> = ({ currentModelByte }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert device models to table format with ID ranges
  const tableData = Object.values(deviceModels).map((device) => {
    const modelByteRanges = getModelByteRanges(device);
    const firstRange = modelByteRanges[0];
    
    // Calculate first and last possible device IDs for this model range
    const firstId = (parseInt(firstRange.start, 16) << 16).toString().padStart(8, '0');
    const lastId = ((parseInt(firstRange.end, 16) << 16) + 0xFFFF).toString().padStart(8, '0');

    // Format model byte range display
    const modelByteDisplay = modelByteRanges.map(range => `${range.start}-${range.end}`).join(', ');

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
      firstId,
      lastId,
      modelByteRange: modelByteDisplay,
      isCurrent
    };
  }).sort((a, b) => a.deviceName.localeCompare(b.deviceName));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
      <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 px-6 py-4 transition-colors duration-300">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-bold">Device ID Ranges by Model</h3>
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
          <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 transition-colors duration-300">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 shrink-0 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1 transition-colors duration-300">About Device IDs</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm transition-colors duration-300">
                  Device IDs are derived from serial numbers by converting them to hexadecimal.
                  The ranges shown represent theoretical limits based on model byte assignments.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Device Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Model Byte Range</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Generation</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">First Device ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Last Device ID</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((device, index) => (
                  <tr
                    key={device.deviceName}
                    className={`border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fade-in ${
                      device.isCurrent ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
                      {device.deviceName}
                      {device.isCurrent && (
                        <span className="ml-2 text-green-600 dark:text-green-400 transition-colors duration-300">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold px-2 py-1 rounded transition-colors duration-300 ${
                        device.isCurrent
                          ? 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}>
                        {device.modelByteRange}
                      </span>
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
                      {device.firstId}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {device.lastId}
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