import React, { useState } from 'react';
import { deviceModels, getMacPrefix, getModelByteRanges } from '../data/deviceModels';

interface ReferenceTableProps {
  currentModelByte?: string;
}

export const ReferenceTable: React.FC<ReferenceTableProps> = ({ currentModelByte }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert device models to table format
  const tableData = Object.values(deviceModels).map((device) => {
    // Format model byte ranges - show all ranges for devices with multiple ranges
    const modelByteRanges = getModelByteRanges(device);
    const modelByteDisplay = modelByteRanges.map(range => `${range.start}-${range.end}`).join(', ');
    
    // Check if current model byte falls within any of the device's ranges
    const isCurrent = currentModelByte && modelByteRanges.some(range => {
      const currentValue = parseInt(currentModelByte, 16);
      const startValue = parseInt(range.start, 16);
      const endValue = parseInt(range.end, 16);
      return currentValue >= startValue && currentValue <= endValue;
    });

    return {
      modelByte: modelByteDisplay,
      fullPrefix: `${getMacPrefix(device)}-XX`,
      deviceName: device.name,
      generation: device.generation,
      isCurrent
    };
  }).sort((a, b) => a.deviceName.localeCompare(b.deviceName));

  return (
    <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-gray-600 to-gray-700 px-6 py-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-white"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold">Suprema Device Reference Table</h3>
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
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Prefix Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <h4 className="font-semibold text-purple-800">Suprema Company Prefix</h4>
                </div>
                <p className="text-purple-700 font-mono text-lg font-bold">00:17:FC</p>
                <p className="text-purple-600 text-sm mt-1">
                  All Suprema devices start with this IEEE registered prefix
                </p>
              </div>

              {/* Model Byte Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <h4 className="font-semibold text-orange-800">Model Identification</h4>
                </div>
                <p className="text-orange-700 text-sm">
                  The 4th byte (after 00:17:FC) identifies the specific device model using ranges
                </p>
                {currentModelByte && (
                  <p className="text-orange-600 font-mono text-lg font-bold mt-1">
                    Current: {currentModelByte.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {/* Device Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Model Byte Range</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">MAC Prefix</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Device Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Generation</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((device, index) => (
                    <tr
                      key={device.deviceName}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fade-in ${
                        device.isCurrent ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold px-2 py-1 rounded ${
                          device.isCurrent
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          {device.modelByte}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">
                        {device.fullPrefix}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {device.deviceName}
                        {device.isCurrent && (
                          <span className="ml-2 text-blue-600">
                            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.generation === 1
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {device.generation}{device.generation === 1 ? 'st' : 'nd'} Gen
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Device ID Structure</h4>
                  <p className="text-blue-700 text-sm mb-2">
                    The last 2 bytes of the MAC address represent the unique device identifier, derived from the device's serial number.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium text-blue-800">MAC Generation Process:</p>
                      <ul className="text-blue-600 mt-1 space-y-1">
                        <li>• Convert 9-digit serial to hexadecimal</li>
                        <li>• Take last 4 hex digits for device ID</li>
                        <li>• Model byte determined by range lookup</li>
                        <li>• Combine: 00:17:FC:XX:YY:ZZ</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Reverse Lookup:</p>
                      <ul className="text-blue-600 mt-1 space-y-1">
                        <li>• Extract model byte from MAC</li>
                        <li>• Find device by byte range</li>
                        <li>• Convert device ID back to decimal</li>
                        <li>• Approximate original serial number</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};