import React from 'react';

interface MacAddressDisplayProps {
  macAddress: string;
  deviceModel: string;
  onCopy: () => void;
  isCopied: boolean;
}

export const MacAddressDisplay: React.FC<MacAddressDisplayProps> = ({
  macAddress,
  deviceModel,
  onCopy,
  isCopied
}) => {
  const formatMacWithColors = (mac: string) => {
    // Remove separators and work with clean hex
    const cleanMac = mac.replace(/[-:]/g, '');

    // Suprema prefix (first 6 chars) - 00:17:FC
    const supremaPrefix = cleanMac.substring(0, 6);

    // Model byte (next 2 chars)
    const modelByte = cleanMac.substring(6, 8);

    // Device ID (last 4 chars)
    const deviceId = cleanMac.substring(8, 12);

    return {
      supremaPrefix: supremaPrefix.match(/.{2}/g)?.join(':') || '',
      modelByte,
      deviceId: deviceId.match(/.{2}/g)?.join(':') || ''
    };
  };

  const { supremaPrefix, modelByte, deviceId } = formatMacWithColors(macAddress);

  return (
    <div className="space-y-4">
      {/* MAC Address with color coding */}
      <div className="relative p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-700 rounded-xl transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">MAC Address</label>
          </div>

          <button
            onClick={onCopy}
            className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110 active:scale-90"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Color-coded MAC display */}
        <div className="font-mono text-2xl md:text-3xl font-bold text-center mb-6 tracking-wider">
          <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md border-2 border-purple-300 dark:border-purple-600 animate-scale-in transition-colors duration-300">
            {supremaPrefix}
          </span>
          <span className="text-gray-400 dark:text-gray-500 mx-1 transition-colors duration-300">:</span>
          <span className="bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-md border-2 border-orange-300 dark:border-orange-600 animate-scale-in transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
            {modelByte}
          </span>
          <span className="text-gray-400 dark:text-gray-500 mx-1 transition-colors duration-300">:</span>
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-md border-2 border-green-300 dark:border-green-600 animate-scale-in transition-colors duration-300" style={{ animationDelay: '0.2s' }}>
            {deviceId}
          </span>
        </div>

        {/* Legend without arrows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 transition-colors duration-300">Suprema Prefix</h4>
            <div className="bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 transition-colors duration-300">
              <p className="text-purple-600 dark:text-purple-300 font-mono font-bold transition-colors duration-300">{supremaPrefix}</p>
              <p className="text-purple-500 dark:text-purple-400 text-xs mt-1 transition-colors duration-300">Company identifier</p>
            </div>
          </div>

          <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 transition-colors duration-300">Model Code</h4>
            <div className="bg-orange-50 dark:bg-orange-900/30 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-700 transition-colors duration-300">
              <p className="text-orange-600 dark:text-orange-300 font-mono font-bold transition-colors duration-300">{modelByte}</p>
              <p className="text-orange-500 dark:text-orange-400 text-xs mt-1 transition-colors duration-300">{deviceModel}</p>
            </div>
          </div>

          <div className="text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 transition-colors duration-300">Device ID</h4>
            <div className="bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 transition-colors duration-300">
              <p className="text-green-600 dark:text-green-300 font-mono font-bold transition-colors duration-300">{deviceId}</p>
              <p className="text-green-500 dark:text-green-400 text-xs mt-1 transition-colors duration-300">Unique device</p>
            </div>
          </div>
        </div>

        {isCopied && (
          <div className="absolute -top-8 right-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded animate-fade-in transition-colors duration-300">
            Copied!
          </div>
        )}
      </div>

      {/* Additional info card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 animate-fade-in transition-colors duration-300" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 shrink-0 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1 transition-colors duration-300">MAC Address Structure</h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm transition-colors duration-300">
              Suprema devices use a structured MAC address where the first 3 bytes identify the manufacturer,
              the 4th byte indicates the device model, and the last 2 bytes represent the unique device identifier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};