import { getDeviceInfoByModelByte, getMacPrefix, type DeviceModel } from '../data/deviceModels';

export interface SupremaDeviceInfo {
  serialNumber: string;
  macAddress: string;
  model: string;
  generation: 1 | 2;
  description: string;
  isValid: boolean;
  error?: string;
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

    const hexId = deviceId.toString(16).toUpperCase();
    const last4Hex = hexId.slice(-4).padStart(4, '0');

    const deviceInfo = findDeviceBySerialPattern(cleanSerial, hexId);

    if (!deviceInfo) {
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

    const macAddress = `${getMacPrefix(deviceInfo)}-${last4Hex.substring(0, 2)}-${last4Hex.substring(2, 4)}`;

    return {
      serialNumber,
      macAddress,
      model: deviceInfo.name,
      generation: deviceInfo.generation,
      description: `${deviceInfo.name} - Generation ${deviceInfo.generation}`,
      isValid: true
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

const findDeviceBySerialPattern = (serial: string, hexId: string): DeviceModel | null => {

  // Use the model byte from the hex conversion to determine device type
  const last4Hex = hexId.slice(-4).padStart(4, '0');
  const modelByte = last4Hex.substring(0, 2);

  // Try to find device by model byte first
  const device = getDeviceInfoByModelByte(modelByte);

  if (device) {
    return device;
  }

  // Fallback to serial number patterns for older devices
  if (serial.startsWith('1') && serial.length >= 9) {
    return getDeviceInfoByModelByte('47'); // BioStation A2 range
  }

  if (serial.startsWith('2') && serial.length >= 8) {
    return getDeviceInfoByModelByte('50'); // BioStation T2 range
  }

  if (serial.startsWith('3') && serial.length >= 8) {
    return getDeviceInfoByModelByte('80'); // FaceStation 2 range
  }

  if (serial.startsWith('4') && serial.length >= 8) {
    return getDeviceInfoByModelByte('90'); // BioStation 2 range
  }

  if (serial.startsWith('5') && serial.length >= 8) {
    return getDeviceInfoByModelByte('D0'); // XPass 2 range
  }

  // Default to X-Station for unknown patterns
  return getDeviceInfoByModelByte('00');
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

  // Check if it's a Suprema device (starts with 0017FC)
  if (!cleanMac.startsWith('0017FC')) {
    return {
      serialNumber: '',
      macAddress: macAddress,
      model: '',
      generation: 1,
      description: '',
      isValid: false,
      error: 'This is not a Suprema device MAC address. Suprema devices start with 00:17:FC'
    };
  }

  try {
    const modelByte = cleanMac.substring(6, 8);
    const lastFourHex = cleanMac.substring(8, 12); // Últimos 4 dígitos hex según documentación Suprema
    
    const partialDeviceId = parseInt(lastFourHex, 16);
    const deviceInfo = getDeviceInfoByModelByte(modelByte);

    if (!deviceInfo) {
      return {
        serialNumber: partialDeviceId.toString(),
        macAddress: formatMacFromClean(cleanMac),
        model: 'Unknown Model',
        generation: 1,
        description: 'Device model not recognized',
        isValid: false,
        error: 'Device model not found in database'
      };
    }

    // Buscar el Device ID correcto usando patrones de datos reales
    let reconstructedSerial = partialDeviceId; // fallback
    
    for (const range of deviceInfo.modelIdRange) {
      const rangeStart = range.start;
      const rangeEnd = range.end;
      
      // Para cada bloque de 65536 en el rango, verificar si el candidato está dentro
      const firstBlockStart = Math.floor(rangeStart / 65536) * 65536;
      const lastBlockStart = Math.floor(rangeEnd / 65536) * 65536;
      
      // Buscar en todos los bloques posibles
      for (let blockStart = firstBlockStart; blockStart <= lastBlockStart; blockStart += 65536) {
        const candidate = blockStart + partialDeviceId;
        
        // Verificar si el candidato está dentro del rango válido del modelo
        if (candidate >= rangeStart && candidate <= rangeEnd) {
          reconstructedSerial = candidate;
          break;
        }
      }
      
      // Si encontramos una coincidencia válida, usar esa
      if (reconstructedSerial !== partialDeviceId) {
        break;
      }
    }

    return {
      serialNumber: reconstructedSerial.toString(),
      macAddress: formatMacFromClean(cleanMac),
      model: deviceInfo.name,
      generation: deviceInfo.generation,
      description: `${deviceInfo.name} - Generation ${deviceInfo.generation}`,
      isValid: true
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
        error: 'Invalid input format. Please enter a valid Suprema serial number (9 digits) or MAC address (XX:XX:XX:XX:XX:XX)'
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