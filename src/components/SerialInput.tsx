import React, { useState, useEffect } from 'react';
import { validateSerialNumber, isValidMacAddress, detectInputType } from '../utils/supremaParser';

interface SerialInputProps {
  onSearch: (input: string) => void;
  isLoading?: boolean;
}

export const SerialInput: React.FC<SerialInputProps> = ({ onSearch, isLoading = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [inputType, setInputType] = useState<'serial' | 'mac' | 'unknown'>('unknown');
  const [lastSearched, setLastSearched] = useState('');

  const validateInput = (value: string): boolean => {
    const type = detectInputType(value);
    setInputType(type);

    switch (type) {
      case 'serial':
        return validateSerialNumber(value);
      case 'mac':
        return isValidMacAddress(value);
      default:
        return false;
    }
  };

  // Auto-search effect when input becomes valid
  useEffect(() => {
    if (inputValue.trim() && isValid && inputValue !== lastSearched && !isLoading) {
      const timer = setTimeout(() => {
        if (validateInput(inputValue)) {
          onSearch(inputValue);
          setLastSearched(inputValue);
        }
      }, 500); // 500ms delay to avoid too many requests while typing

      return () => clearTimeout(timer);
    }
  }, [inputValue, isValid, lastSearched, isLoading, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      setIsValid(validateInput(value));
    } else {
      setIsValid(true);
      setInputType('unknown');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateInput(inputValue)) {
      onSearch(inputValue);
    } else {
      setIsValid(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="device-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
            Device ID (Serial Number) - Recommended
          </label>
          <input
            id="device-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter Device ID (e.g., 544426672) or MAC Address (e.g., 00:17:FC:73:4A:B0)"
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 ${
              !isValid && inputValue.trim()
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400'
                : inputType === 'serial'
                ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                : inputType === 'mac'
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-500'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-primary-500 dark:focus:border-primary-400'
            }`}
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Input type indicator */}
          {inputValue.trim() && isValid && (
            <div className={`absolute right-3 top-11 px-2 py-1 rounded text-xs font-medium animate-scale-in transition-colors duration-300 ${
                inputType === 'serial'
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                  : inputType === 'mac'
                  ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {inputType === 'serial' ? 'Device ID ✓' : inputType === 'mac' ? 'MAC (Model Only)' : 'Unknown'}
            </div>
          )}

          {!isValid && inputValue.trim() && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in transition-colors duration-300">
              Please enter a valid Device ID (9 digits) or MAC address (XX:XX:XX:XX:XX:XX)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            isLoading || !inputValue.trim()
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </div>
          ) : (
            'Find Device Info'
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          <strong>Recommended:</strong> Device ID (544426672) for exact identification<br/>
          <span className="text-xs">MAC Address provides model info only</span>
        </p>
      </div>
    </div>
  );
};