import { describe, test, expect } from "vitest";
import {
  getDeviceInfoByModelId,
  getDeviceInfoByMacAddress,
  getAllDevicesByModelId,
  getAllDevicesByMacAddress,
  getDeviceInfoByMacAndSerial,
} from "../data/deviceModels";

// Rellena este array con tus dispositivos reales
const testDevices = [
  // XPass
  { name: "XPass", serial: 544_385_059, mac: "00-17-FC-72-A8-23" },

  // XPass 2
  { name: "XPass", serial: 544_426_687, mac: "00-17-FC-73-4A-BF" },
  { name: "XPass", serial: 544_426_672, mac: "00-17-FC-73-4A-B0" },
  { name: "XPass", serial: 544_420_824, mac: "00-17-FC-73-33-D8" },

  // BioStation
  { name: "BioStation T2", serial: 541_142_410, mac: "00-17-FC-41-2D-8A" },
  { name: "BioStation T2", serial: 541_140_972, mac: "00-17-FC-41-30-6C" },

  // BioEntry W2
  { name: "BioEntry W2 (ODP)", serial: 544_205_354, mac: "00-17-FC-71-58-1D" },
  { name: "BioEntry W2 (ODP)", serial: 544_299_039, mac: "00-17-FC-71-58-1F" },

  // BioLite N2
  { name: "BioLite Net", serial: 538_119_122, mac: "00-17-FC-1E-8B-77" },
];

describe("Device detection integration", () => {
  test("Validar dispositivos reales usando MAC + Serial combinados", () => {
    testDevices.forEach((device) => {
      console.log(`\nTesting device: ${device.name} (Serial: ${device.serial}, MAC: ${device.mac})`);
      
      // Verificar detección por serial
      const bySerial = getDeviceInfoByModelId(device.serial);
      const allBySerial = getAllDevicesByModelId(device.serial);
      console.log(`By Serial: ${bySerial?.name || 'null'} (${allBySerial.length} matches: ${allBySerial.map(d => d.name).join(', ')})`);
      
      // Verificar detección por MAC
      const byMac = getDeviceInfoByMacAddress(device.mac);
      const allByMac = getAllDevicesByMacAddress(device.mac);
      console.log(`By MAC: ${byMac?.name || 'null'} (${allByMac.length} matches: ${allByMac.map(d => d.name).join(', ')})`);
      
      // Verificar detección combinada (MAC + Serial)
      const byMacAndSerial = getDeviceInfoByMacAndSerial(device.mac, device.serial);
      console.log(`By MAC+Serial: ${byMacAndSerial?.name || 'null'}`);
      
      // Assertion principal usando la detección combinada
      expect(byMacAndSerial).toBeTruthy();
      expect(byMacAndSerial?.name).toBe(device.name);
    });
  });

  test("Detectar ambigüedades en los datos", () => {
    testDevices.forEach((device) => {
      const serialMatches = getAllDevicesByModelId(device.serial);
      const macMatches = getAllDevicesByMacAddress(device.mac);
      
      if (serialMatches.length > 1) {
        console.log(`⚠️  Ambigüedad por Serial ${device.serial}: ${serialMatches.map(d => d.name).join(', ')}`);
      }
      
      if (macMatches.length > 1) {
        console.log(`⚠️  Ambigüedad por MAC ${device.mac}: ${macMatches.map(d => d.name).join(', ')}`);
      }
    });
  });
});
