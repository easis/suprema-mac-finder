import React, { useState } from 'react';
import { formatMacAddress, type SupremaDeviceInfo } from '../utils/supremaParser';
import { MacAddressDisplay } from './MacAddressDisplay';

interface DeviceInfoProps {
  deviceInfo: SupremaDeviceInfo;
}

export const DeviceInfo: React.FC<DeviceInfoProps> = ({ deviceInfo }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatSerialDisplay = (serial: string) => {
    const clean = serial.replace(/[^0-9]/g, '');
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  if (!deviceInfo.isValid) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 animate-fade-in">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg transition-colors duration-300">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 transition-colors duration-300">Invalid Serial Number</h3>
          </div>
          <p className="text-red-700 dark:text-red-300 transition-colors duration-300">{deviceInfo.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white">Device Information Found</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up-delay">
            <InfoCard
              label="Device Model"
              value={deviceInfo.model}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              }
              onCopy={() => copyToClipboard(deviceInfo.model, 'model')}
              isCopied={copiedField === 'model'}
            />

            <InfoCard
              label="Generation"
              value={`${deviceInfo.generation}${deviceInfo.generation === 1 ? 'st' : 'nd'} Generation`}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              onCopy={() => copyToClipboard(`${deviceInfo.generation}`, 'generation')}
              isCopied={copiedField === 'generation'}
            />
          </div>

          <div className="animate-fade-in">
            <MacAddressDisplay
              macAddress={formatMacAddress(deviceInfo.macAddress)}
              deviceModel={deviceInfo.model}
              onCopy={() => copyToClipboard(formatMacAddress(deviceInfo.macAddress), 'mac')}
              isCopied={copiedField === 'mac'}
            />
          </div>

          <div className="animate-slide-up-delay">
            <InfoCard
              label="Serial Number"
              value={deviceInfo.serialNumber.includes('Use Device ID') || deviceInfo.serialNumber.includes('Cannot determine') 
                ? deviceInfo.serialNumber 
                : formatSerialDisplay(deviceInfo.serialNumber)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
              onCopy={deviceInfo.serialNumber.includes('Use Device ID') || deviceInfo.serialNumber.includes('Cannot determine') 
                ? undefined 
                : () => copyToClipboard(deviceInfo.serialNumber, 'serial')}
              isCopied={copiedField === 'serial'}
              isWarning={deviceInfo.serialNumber.includes('Use Device ID') || deviceInfo.serialNumber.includes('Cannot determine')}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-primary-500 animate-fade-in transition-colors duration-300">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">Description</h4>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{deviceInfo.description}</p>
          </div>

          {/* Mostrar múltiples modelos posibles si existen */}
          {deviceInfo.hasMultipleMatches && deviceInfo.possibleModels && deviceInfo.possibleModels.length > 1 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-l-4 border-amber-500 animate-fade-in transition-colors duration-300">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center transition-colors duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Multiple Possible Models
              </h4>
              <p className="text-amber-700 dark:text-amber-300 mb-3 text-sm transition-colors duration-300">
                This Device ID matches multiple device models. All possible matches:
              </p>
              <div className="space-y-2">
                {deviceInfo.possibleModels.map((model, index) => (
                  <div
                    key={`${model.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md border border-amber-200 dark:border-amber-700 transition-colors duration-300"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {model.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Generation {model.generation} • 
                        {model.modelIdRange.map(range => ` ${range.start}-${range.end}`).join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(model.name, `model-${index}`)}
                      className="ml-2 p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-90"
                      title="Copy model name"
                    >
                      {copiedField === `model-${index}` ? (
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  onCopy?: () => void;
  isCopied: boolean;
  highlight?: boolean;
  isWarning?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon, onCopy, isCopied, highlight = false, isWarning = false }) => {
  return (
    <div className={`relative group p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
      isWarning
        ? 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
        : highlight
        ? 'border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`${isWarning ? 'text-yellow-600 dark:text-yellow-400' : highlight ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'} mr-2 transition-colors duration-300`}>
              {icon}
            </span>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">{label}</label>
          </div>
          <p className={`font-mono text-lg transition-colors duration-300 ${isWarning ? 'text-yellow-800 dark:text-yellow-200 font-medium' : highlight ? 'text-primary-800 dark:text-primary-200 font-semibold' : 'text-gray-900 dark:text-gray-100'}`}>
            {value}
          </p>
        </div>

        {onCopy && (
          <button
            onClick={onCopy}
            className="ml-2 p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
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
        )}
      </div>

      {isCopied && (
        <div className="absolute -top-8 right-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded animate-fade-in transition-colors duration-300">
          Copied!
        </div>
      )}
    </div>
  );
};