export interface DeviceModel {
  name: string;
  generation: 1 | 2;
  macRange: {
    start: string; // Full MAC address like "00-17-FC-34-00-00"
    end: string;   // Full MAC address like "00-17-FC-3F-FF-FF"
  }[];
  modelIdRange: {
    start: number;
    end: number;
  }[];
}

// Según tabla de referencia de Suprema
// NO MODIFICAR
// https://kb.supremainc.com/knowledge/doku.php?id=en:tc_appnote_searching_a_device_s_ip_and_mac_address_manually
export const deviceModels: Record<string, DeviceModel> = {
  // 1st Gen
  biostation: {
    name: "BioStation",
    generation: 1,
    macRange: [{ start: "00-17-FC-34-00-00", end: "00-17-FC-3F-FF-FF" }],
    modelIdRange: [{ start: 540_278_784, end: 541_065_215 }],
  },

  bioentry_plus: {
    name: "BioEntry Plus",
    generation: 1,
    macRange: [{ start: "00-17-FC-25-00-00", end: "00-17-FC-2F-FF-FF" }],
    modelIdRange: [{ start: 539_295_744, end: 540_016_639 }],
  },

  biolite_net: {
    name: "BioLite Net",
    generation: 1,
    macRange: [{ start: "00-17-FC-11-00-00", end: "00-17-FC-1F-FF-FF" }],
    modelIdRange: [{ start: 537_985_024, end: 538_968_063 }],
  },

  xpass: {
    name: "XPass",
    generation: 1,
    macRange: [{ start: "00-17-FC-72-00-00", end: "00-17-FC-7F-FF-FF" }],
    modelIdRange: [{ start: 544_342_016, end: 545_259_519 }],
  },

  xpass_s2: {
    name: "XPass Slim/S2",
    generation: 1,
    macRange: [{ start: "00-17-FC-80-00-00", end: "00-17-FC-8F-FF-FF" }],
    modelIdRange: [{ start: 545_259_520, end: 546_308_095 }],
  },

  dstation: {
    name: "D-Station",
    generation: 1,
    macRange: [{ start: "00-17-FC-31-00-00", end: "00-17-FC-32-FF-FF" }],
    modelIdRange: [{ start: 540_082_176, end: 540_213_274 }],
  },

  xstation: {
    name: "X-Station",
    generation: 1,
    macRange: [{ start: "00-17-FC-90-00-00", end: "00-17-FC-97-FF-FF" }],
    modelIdRange: [{ start: 546_308_096, end: 546_832_383 }],
  },

  biostation_t2: {
    name: "BioStation T2",
    generation: 1,
    macRange: [{ start: "00-17-FC-41-00-00", end: "00-17-FC-4F-FF-FF" }],
    modelIdRange: [{ start: 541_130_752, end: 542_113_791 }],
  },

  facestation: {
    name: "FaceStation",
    generation: 1,
    macRange: [{ start: "00-17-FC-51-00-00", end: "00-17-FC-5F-FF-FF" }],
    modelIdRange: [{ start: 542_179_328, end: 543_162_367 }],
  },

  bioentry_plus_w: {
    name: "BioEntry Plus W",
    generation: 1,
    macRange: [{ start: "00-17-FC-61-00-00", end: "00-17-FC-6F-FF-FF" }],
    modelIdRange: [{ start: 543_227_904, end: 544_210_943 }],
  },

  // 2nd Gen
  biostation_a2_ompw: {
    name: "BioStation A2 (OMPW)",
    generation: 2,
    macRange: [{ start: "00-17-FC-98-00-00", end: "00-17-FC-9E-00-00" }],
    modelIdRange: [{ start: 546_832_384, end: 547_232_383 }],
  },

  biostation_a2_oepw: {
    name: "BioStation A2 (OEPW)",
    generation: 2,
    macRange: [{ start: "00-17-FC-9E-00-00", end: "00-17-FC-A4-00-00" }],
    modelIdRange: [{ start: 547_232_384, end: 547_632_383 }],
  },

  biostation_a2_oipw: {
    name: "BioStation A2 (OIPW)",
    generation: 2,
    macRange: [{ start: "00-17-FC-A4-00-00", end: "00-17-FC-A5-00-00" }],
    modelIdRange: [{ start: 547_632_384, end: 547_732_383 }],
  },

  biostation_a2_ohpw: {
    name: "BioStation A2 (OHPW)",
    generation: 2,
    macRange: [{ start: "00-17-FC-A5-00-00", end: "00-17-FC-A7-00-00" }],
    modelIdRange: [{ start: 547_732_384, end: 547_832_383 }],
  },

  biostation_l2: {
    name: "BioStation L2",
    generation: 2,
    macRange: [{ start: "00-17-FC-55-00-00", end: "00-17-FC-5F-00-00" }],
    modelIdRange: [{ start: 542_500_000, end: 543_159_999 }],
  },

  bioentry_w2_oap: {
    name: "BioEntry W2 (OAP)",
    generation: 2,
    macRange: [{ start: "00-17-FC-6E-00-00", end: "00-17-FC-6F-00-00" }],
    modelIdRange: [{ start: 544_108_000, end: 544_157_999 }],
  },

  bioentry_w2_odp: {
    name: "BioEntry W2 (ODP)",
    generation: 2,
    macRange: [{ start: "00-17-FC-6E-00-00", end: "00-17-FC-6F-00-00" }],
    modelIdRange: [{ start: 544_158_000, end: 544_207_999 }],
  },

  bioentry_w2_ohp: {
    name: "BioEntry W2 (OHP)",
    generation: 2,
    macRange: [{ start: "00-17-FC-6F-00-00", end: "00-17-FC-70-00-00" }],
    modelIdRange: [{ start: 544_208_000, end: 544_257_999 }],
  },

  // A2 series - Special case with different MAC prefix and multiple ID ranges
  biostation_a2: {
    name: "BioStation A2",
    generation: 2,
  macRange: [{ start: "00-17-FB-00-00-00", end: "00-17-FB-FF-FF-FF" }],
    modelIdRange: [
      { start: 939_254_096, end: 939_254_096 }, // First range from table
      { start: 553_378_128, end: 553_648_127 }  // Second range (matching hex)
    ],
  },

  corestation: {
    name: "CoreStation",
    generation: 2,
    macRange: [{ start: "00-17-FC-4F-00-00", end: "00-17-FC-50-00-00" }],
    modelIdRange: [{ start: 542_070_001, end: 542_170_000 }],
  },

  facestation2_awb: {
    name: "FaceStation 2 (AWB)",
    generation: 2,
    macRange: [{ start: "00-17-FC-51-00-00", end: "00-17-FC-51-00-00" }],
    modelIdRange: [{ start: 542_189_330, end: 542_219_329 }],
  },

  facestation2_d: {
    name: "FaceStation 2 (D)",
    generation: 2,
    macRange: [{ start: "00-17-FC-53-00-00", end: "00-17-FC-55-00-00" }],
    modelIdRange: [{ start: 542_393_930, end: 542_499_329 }],
  },

  bioentry_p2_oa: {
    name: "BioEntry P2 (OA)",
    generation: 2,
    macRange: [{ start: "00-17-FC-48-00-00", end: "00-17-FC-48-00-00" }],
    modelIdRange: [{ start: 541_150_001, end: 541_610_000 }],
  },

  bioentry_p2_od: {
    name: "BioEntry P2 (OD)",
    generation: 2,
    macRange: [{ start: "00-17-FC-48-00-00", end: "00-17-FC-4F-00-00" }],
    modelIdRange: [{ start: 541_610_001, end: 542_070_000 }],
  },
};

// Helper function to extract model byte ranges from MAC ranges
export const getModelByteRanges = (device: DeviceModel): { start: string; end: string }[] => {
  return device.macRange.map(range => {
    const startParts = range.start.split('-');
    const endParts = range.end.split('-');
    return {
      start: startParts[3], // 4th octet (model byte)
      end: endParts[3]
    };
  });
};

export const getDeviceInfoByModelByte = (
  modelByte: string
): DeviceModel | null => {
  const normalizedByte = modelByte.toUpperCase();
  const byteValue = parseInt(normalizedByte, 16);

  for (const device of Object.values(deviceModels)) {
    // Extract model byte ranges from macRange
    const modelByteRanges = getModelByteRanges(device);
    
    // Iterate through all byte ranges for this device
    for (const range of modelByteRanges) {
      const startValue = parseInt(range.start, 16);
      const endValue = parseInt(range.end, 16);

      if (byteValue >= startValue && byteValue <= endValue) {
        return device;
      }
    }
  }

  return null;
};

// Helper function to extract MAC prefix from device's macRange
export const getMacPrefix = (device: DeviceModel): string | null => {
  if (device.macRange.length === 0) return null;
  const macStart = device.macRange[0].start;
  return macStart.split('-').slice(0, 3).join('-'); // Extract first 3 octets
};

export const getMacPrefixFromHex = (hexPrefix: string): string | null => {
  const device = getDeviceInfoByModelByte(hexPrefix.slice(-2));
  return device ? getMacPrefix(device) : null;
};

export const getDeviceInfo = (hexPrefix: string): DeviceModel | null => {
  return getDeviceInfoByModelByte(hexPrefix.slice(-2));
};

export const getDeviceInfoByModelId = (
  modelId: number
): DeviceModel | null => {
  for (const device of Object.values(deviceModels)) {
    // Check all model ID ranges for this device
    for (const range of device.modelIdRange) {
      if (modelId >= range.start && modelId <= range.end) {
        return device;
      }
    }
  }

  return null;
};

// Nueva función que devuelve TODOS los dispositivos que coinciden con un modelId
export const getAllDevicesByModelId = (
  modelId: number
): DeviceModel[] => {
  const matches: DeviceModel[] = [];
  for (const device of Object.values(deviceModels)) {
    for (const range of device.modelIdRange) {
      if (modelId >= range.start && modelId <= range.end) {
        matches.push(device);
        break; // Evitar duplicados del mismo dispositivo
      }
    }
  }
  return matches;
};

// Nueva función que devuelve TODOS los dispositivos que coinciden con una MAC
export const getAllDevicesByMacAddress = (
  macAddress: string
): DeviceModel[] => {
  const cleanMac = macAddress.replace(/[-:]/g, '').toUpperCase();
  
  // Check if it's a Suprema device (0017FC or 0017FB)
  if (!cleanMac.startsWith('0017FC') && !cleanMac.startsWith('0017FB')) {
    return [];
  }
  
  const matches: DeviceModel[] = [];
  for (const device of Object.values(deviceModels)) {
    for (const range of device.macRange) {
      if (isMacInRange(macAddress, range)) {
        matches.push(device);
        break; // Evitar duplicados del mismo dispositivo
      }
    }
  }
  return matches;
};

export const getDeviceInfoByByteAndId = (
  modelByte: string,
  modelId?: number
): DeviceModel | null => {
  // First check by byte
  const deviceByByte = getDeviceInfoByModelByte(modelByte);
  
  // If no model ID is provided, return the byte-based result
  if (modelId === undefined) {
    return deviceByByte;
  }
  
  // Get all devices that match the ID
  const devicesByIdAll = getAllDevicesByModelId(modelId);
  
  // If byte-based result exists and is in the ID matches, prefer it
  if (deviceByByte && devicesByIdAll.some(d => d.name === deviceByByte.name)) {
    return deviceByByte;
  }
  
  // If no byte match but we have ID matches, return the most specific one
  // (smallest range = most specific)
  if (devicesByIdAll.length > 0) {
    return devicesByIdAll.reduce((most_specific, current) => {
      // Calculate total range size for each device (sum of all ranges)
      const currentRangeSize = current.modelIdRange.reduce((sum, range) => 
        sum + (range.end - range.start), 0
      );
      const specificRangeSize = most_specific.modelIdRange.reduce((sum, range) => 
        sum + (range.end - range.start), 0
      );
      return currentRangeSize < specificRangeSize ? current : most_specific;
    });
  }
  
  // Fallback to byte-based result
  return deviceByByte;
};

// Nueva función que resuelve ambigüedades usando tanto MAC como serial
export const getDeviceInfoByMacAndSerial = (
  macAddress: string,
  serial: number
): DeviceModel | null => {
  const devicesByMac = getAllDevicesByMacAddress(macAddress);
  const devicesBySerial = getAllDevicesByModelId(serial);
  
  // Buscar coincidencias entre MAC y serial
  const intersection = devicesByMac.filter(macDevice => 
    devicesBySerial.some(serialDevice => serialDevice.name === macDevice.name)
  );
  
  if (intersection.length === 1) {
    return intersection[0];
  }
  
  if (intersection.length > 1) {
    // Si aún hay múltiples coincidencias, devolver la más específica
    return intersection.reduce((most_specific, current) => {
      const currentRangeSize = current.modelIdRange.reduce((sum, range) => 
        sum + (range.end - range.start), 0
      );
      const specificRangeSize = most_specific.modelIdRange.reduce((sum, range) => 
        sum + (range.end - range.start), 0
      );
      return currentRangeSize < specificRangeSize ? current : most_specific;
    });
  }
  
  // Si no hay intersección, priorizar el resultado por serial
  return devicesBySerial.length > 0 ? devicesBySerial[0] : 
         (devicesByMac.length > 0 ? devicesByMac[0] : null);
};

export const getAllDeviceModels = (): DeviceModel[] => {
  return Object.values(deviceModels);
};

// Helper function to generate MAC range from model byte range (legacy compatibility)
export const generateMacRange = (modelByteStart: string, modelByteEnd: string, prefix: string = "00-17-FC"): { start: string; end: string } => {
  return {
    start: `${prefix}-${modelByteStart}-00-00`,
    end: `${prefix}-${modelByteEnd}-FF-FF`
  };
};

// Helper function to check if a MAC address falls within a range
export const isMacInRange = (mac: string, range: { start: string; end: string }): boolean => {
  const cleanMac = mac.replace(/[-:]/g, '').toUpperCase();
  const cleanStart = range.start.replace(/[-:]/g, '').toUpperCase();
  const cleanEnd = range.end.replace(/[-:]/g, '').toUpperCase();
  
  return cleanMac >= cleanStart && cleanMac <= cleanEnd;
};

// Function to find device by complete MAC address
export const getDeviceInfoByMacAddress = (macAddress: string): DeviceModel | null => {
  const cleanMac = macAddress.replace(/[-:]/g, '').toUpperCase();
  
  // Check if it's a Suprema device (0017FC or 0017FB)
  if (!cleanMac.startsWith('0017FC') && !cleanMac.startsWith('0017FB')) {
    return null;
  }
  
  for (const device of Object.values(deviceModels)) {
    for (const range of device.macRange) {
      if (isMacInRange(macAddress, range)) {
        return device;
      }
    }
  }
  
  return null;
};