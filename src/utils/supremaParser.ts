import { getMacPrefix, getAllDevicesByModelId, getAllDevicesByMacAddress, type DeviceModel } from '../data/deviceModels';

export interface SupremaDeviceInfo {
  serialNumber: string;
  macAddress: string;
  model: string;
  generation: 1 | 2;
  description: string;
  isValid: boolean;
  error?: string;
  // Nuevos campos para manejar múltiples matches
  possibleModels?: DeviceModel[];
  hasMultipleMatches?: boolean;
}

export const parseSupremaSerial = (serialNumber: string): SupremaDeviceInfo => {
  const cleanSerial = serialNumber.trim().replace(/[^0-9]/g, '');

  if (!cleanSerial || cleanSerial.length !== 9) {
    return {
      serialNumber,
      macAddress: '',
      model: '',
      generation: 1,
      description: '',
      isValid: false,
      error: 'Suprema serial numbers must be exactly 9 digits'
    };
  }

  try {
    const deviceId = parseInt(cleanSerial, 10);

    if (isNaN(deviceId) || deviceId <= 0) {
      return {
        serialNumber,
        macAddress: '',
        model: '',
        generation: 1,
        description: '',
        isValid: false,
        error: 'Invalid serial number format'
      };
    }

    // Buscar todos los dispositivos que coinciden con este Device ID
    const possibleDevices = getAllDevicesByModelId(deviceId);

    if (possibleDevices.length === 0) {
      const hexId = deviceId.toString(16).toUpperCase();
      const last4Hex = hexId.slice(-4).padStart(4, '0');
      
      return {
        serialNumber,
        macAddress: `Unknown-${last4Hex}`,
        model: 'Unknown Model',
        generation: 1,
        description: 'Device model not recognized',
        isValid: false,
        error: 'Device model not found in database'
      };
    }

    const hexId = deviceId.toString(16).toUpperCase();
    const last4Hex = hexId.slice(-4).padStart(4, '0');

    // Si hay múltiples matches, usamos el primero pero indicamos que hay más opciones
    const primaryDevice = possibleDevices[0];
    const macAddress = `${getMacPrefix(primaryDevice)}-${last4Hex.substring(0, 2)}-${last4Hex.substring(2, 4)}`;

    const hasMultiple = possibleDevices.length > 1;
    const modelText = hasMultiple 
      ? `${primaryDevice.name} (and ${possibleDevices.length - 1} other possible model${possibleDevices.length > 2 ? 's' : ''})`
      : primaryDevice.name;

    return {
      serialNumber,
      macAddress,
      model: modelText,
      generation: primaryDevice.generation,
      description: hasMultiple 
        ? `Multiple possible models found for this Device ID`
        : `${primaryDevice.name} - Generation ${primaryDevice.generation}`,
      isValid: true,
      possibleModels: possibleDevices,
      hasMultipleMatches: hasMultiple
    };

  } catch {
    return {
      serialNumber,
      macAddress: '',
      model: '',
      generation: 1,
      description: '',
      isValid: false,
      error: 'Failed to parse serial number'
    };
  }
};

export const parseMacAddress = (macAddress: string): SupremaDeviceInfo => {
  const cleanMac = macAddress.trim().replace(/[-:]/g, '').toUpperCase();

  if (!isValidMacAddress(cleanMac)) {
    return {
      serialNumber: '',
      macAddress: macAddress,
      model: '',
      generation: 1,
      description: '',
      isValid: false,
      error: 'Invalid MAC address format. Expected format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX'
    };
  }

  // Check if it's a Suprema device (starts with 0017FC or 0017FB)
  if (!cleanMac.startsWith('0017FC') && !cleanMac.startsWith('0017FB')) {
    return {
      serialNumber: '',
      macAddress: macAddress,
      model: '',
      generation: 1,
      description: '',
      isValid: false,
      error: 'This is not a Suprema device MAC address. Suprema devices start with 00:17:FC or 00:17:FB'
    };
  }

  try {
    // Buscar todos los dispositivos que coinciden con esta MAC
    const possibleDevices = getAllDevicesByMacAddress(macAddress);

    if (possibleDevices.length === 0) {
      return {
        serialNumber: 'Cannot determine from MAC',
        macAddress: formatMacFromClean(cleanMac),
        model: 'Unknown Model',
        generation: 1,
        description: 'Device model not recognized. Please use Device ID for identification.',
        isValid: false,
        error: 'Device model not found in database'
      };
    }

    const hasMultiple = possibleDevices.length > 1;
    const primaryDevice = possibleDevices[0];
    const modelText = hasMultiple 
      ? `${primaryDevice.name} (and ${possibleDevices.length - 1} other possible model${possibleDevices.length > 2 ? 's' : ''})`
      : primaryDevice.name;

    return {
      serialNumber: 'Use Device ID for exact identification',
      macAddress: formatMacFromClean(cleanMac),
      model: modelText,
      generation: primaryDevice.generation,
      description: hasMultiple 
        ? `Multiple possible models found. Use Device ID for exact identification.`
        : `${primaryDevice.name} - Generation ${primaryDevice.generation} (Model detected by MAC prefix)`,
      isValid: true,
      possibleModels: possibleDevices,
      hasMultipleMatches: hasMultiple
    };

  } catch {
    return {
      serialNumber: '',
      macAddress: macAddress,
      model: '',
      generation: 1,
      description: '',
      isValid: false,
      error: 'Failed to parse MAC address'
    };
  }
};

export const isValidMacAddress = (mac: string): boolean => {
  const cleanMac = mac.replace(/[-:]/g, '');
  return /^[0-9A-Fa-f]{12}$/.test(cleanMac);
};

export const formatMacFromClean = (cleanMac: string): string => {
  return cleanMac.match(/.{2}/g)?.join(':') || cleanMac;
};

export const detectInputType = (input: string): 'serial' | 'mac' | 'unknown' => {
  const clean = input.trim().replace(/[-:]/g, '');

  // Check if it looks like a MAC address (12 hex characters)
  if (/^[0-9A-Fa-f]{12}$/.test(clean)) {
    return 'mac';
  }

  // Check if it looks like a Suprema serial number (exactly 9 digits)
  if (/^\d{9}$/.test(clean)) {
    return 'serial';
  }

  return 'unknown';
};

export const parseInput = (input: string): SupremaDeviceInfo => {
  const inputType = detectInputType(input);

  switch (inputType) {
    case 'serial':
      return parseSupremaSerial(input);
    case 'mac':
      return parseMacAddress(input);
    default:
      return {
        serialNumber: input,
        macAddress: '',
        model: '',
        generation: 1,
        description: '',
        isValid: false,
        error: 'Invalid input format. Please enter a valid Device ID (9 digits) or MAC address (XX:XX:XX:XX:XX:XX). Device ID is recommended for exact identification.'
      };
  }
};

export const validateSerialNumber = (serial: string): boolean => {
  const cleanSerial = serial.trim().replace(/[^0-9]/g, '');
  return cleanSerial.length === 9;
};

export const formatMacAddress = (mac: string): string => {
  return mac.replace(/-/g, ':').toUpperCase();
};