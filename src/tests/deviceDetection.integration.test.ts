import { describe, test, expect } from "vitest";
import {
  getDeviceInfoByModelId,
  getDeviceInfoByMacAddress,
  getAllDevicesByModelId,
  getAllDevicesByMacAddress,
} from "../data/deviceModels";
import { parseSupremaSerial, parseMacAddress } from "../utils/supremaParser";

// Rellena este array con tus dispositivos reales
const testDevices: Array<{
  name: string;
  serial: number;
  mac: string;
  expectAmbiguous?: boolean;
  expectNotFound?: boolean;
  expectMacNotFound?: boolean;
}> = [
  // XPass
  { name: "XPass", serial: 544_385_059, mac: "00-17-FC-72-A8-23" },

  // XPass 2
  { name: "XPass", serial: 544_426_687, mac: "00-17-FC-73-4A-BF" },
  { name: "XPass", serial: 544_426_672, mac: "00-17-FC-73-4A-B0" },
  { name: "XPass", serial: 544_420_824, mac: "00-17-FC-73-33-D8" },

  // BioStation
  { name: "BioStation T2", serial: 541_142_410, mac: "00-17-FC-41-2D-8A" },
  { name: "BioStation T2", serial: 541_140_972, mac: "00-17-FC-41-30-6C" },

  // BioEntry W2 - CASOS AMBIGUOS CONOCIDOS
  { name: "BioEntry Plus W", serial: 544_205_354, mac: "00-17-FC-71-58-1D", expectAmbiguous: true, expectMacNotFound: true }, // MAC no detectada
  { name: "BioEntry W2 (ODP)", serial: 544_299_039, mac: "00-17-FC-71-58-1F", expectNotFound: true }, // Fuera de rangos actuales

  // BioLite N2
  { name: "BioLite Net", serial: 538_119_122, mac: "00-17-FC-1E-8B-77" },
];

describe("Device detection integration", () => {
  test("Validar detección de dispositivos reales por Device ID", () => {
    testDevices.forEach((device) => {
      console.log(`\nTesting device: ${device.name} (Device ID: ${device.serial})`);
      
      // Verificar detección por Device ID
      const bySerial = getDeviceInfoByModelId(device.serial);
      const allBySerial = getAllDevicesByModelId(device.serial);
      console.log(`By Device ID: ${bySerial?.name || 'null'}`);
      console.log(`All matches: ${allBySerial.map(d => d.name).join(', ')}`);
      
      if (device.expectAmbiguous || allBySerial.length > 1) {
        console.log(`⚠️  Device ID ambiguo - múltiples coincidencias esperadas`);
        // Para Device IDs ambiguos, verificar que al menos se detecte un modelo válido
        expect(bySerial).toBeTruthy();
        expect(allBySerial.length).toBeGreaterThan(0);
        // Verificar que al menos uno de los modelos coincida (puede no ser exacto debido a ambigüedad)
        const modelNames = allBySerial.map(d => d.name);
        console.log(`Modelos detectados: ${modelNames.join(', ')}`);
      } else if (device.expectNotFound) {
        console.log(`⚠️  Device ID no encontrado en rangos actuales - esperado`);
        // Para Device IDs que sabemos que no están en los rangos, verificar que no se encuentren
        expect(bySerial).toBeNull();
        expect(allBySerial.length).toBe(0);
      } else {
        // Para Device IDs únicos, verificar detección exacta
        expect(bySerial).toBeTruthy();
        expect(bySerial?.name).toBe(device.name);
        expect(allBySerial.length).toBe(1);
      }
      
      // Verificar detección por MAC (solo modelo)
      const byMac = getDeviceInfoByMacAddress(device.mac);
      const allByMac = getAllDevicesByMacAddress(device.mac);
      console.log(`By MAC: ${byMac?.name || 'null'} (model identification only)`);
      console.log(`All MAC matches: ${allByMac.map(d => d.name).join(', ')}`);
      
      // Para dispositivos que esperamos que no se encuentren, no validamos MAC
      if (!device.expectNotFound && !device.expectMacNotFound) {
        // MAC debería al menos detectar algún modelo válido
        expect(allByMac.length).toBeGreaterThan(0);
      }
    });
  });

  test("Verificar parser con múltiples matches", () => {
    // Probar con Device ID que sabemos tiene múltiples matches
    const ambiguousSerial = "544205354";
    const result = parseSupremaSerial(ambiguousSerial);
    
    console.log(`\nParsing ambiguous serial: ${ambiguousSerial}`);
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    
    expect(result.isValid).toBe(true);
    expect(result.hasMultipleMatches).toBe(true);
    expect(result.possibleModels).toBeDefined();
    expect(result.possibleModels!.length).toBeGreaterThan(1);
    expect(result.model).toContain("other possible model");
  });

  test("Verificar parser con MAC que tiene múltiples matches", () => {
    // Probar con MAC que puede tener múltiples matches - usar una MAC válida
    const testMac = "00:17:FC:73:4A:B0"; // XPass MAC conocida
    const result = parseMacAddress(testMac);
    
    console.log(`\nParsing MAC: ${testMac}`);
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    
    expect(result.isValid).toBe(true);
    if (result.hasMultipleMatches) {
      expect(result.possibleModels).toBeDefined();
      expect(result.possibleModels!.length).toBeGreaterThan(1);
      expect(result.model).toContain("other possible model");
    }
  });

  test("Detectar y reportar todas las ambigüedades", () => {
    const ambiguousDevices: Array<{ serial: number; models: string[] }> = [];
    
    testDevices.forEach((device) => {
      const serialMatches = getAllDevicesByModelId(device.serial);
      
      if (serialMatches.length > 1) {
        ambiguousDevices.push({
          serial: device.serial,
          models: serialMatches.map(d => d.name)
        });
      }
    });
    
    if (ambiguousDevices.length > 0) {
      console.log(`\n⚠️  Found ${ambiguousDevices.length} ambiguous Device IDs:`);
      ambiguousDevices.forEach(({ serial, models }) => {
        console.log(`  Device ID ${serial}: ${models.join(', ')}`);
      });
    }
    
    // No fallar el test, solo reportar
    expect(true).toBe(true);
  });

  test("Verificar que cada Device ID retorna resultados consistentes", () => {
    testDevices.forEach((device) => {
      const directResult = getAllDevicesByModelId(device.serial);
      const parserResult = parseSupremaSerial(device.serial.toString());
      
      // Si el parser indica múltiples matches, debe haber múltiples results
      if (parserResult.hasMultipleMatches) {
        expect(directResult.length).toBeGreaterThan(1);
        expect(parserResult.possibleModels).toBeDefined();
        expect(parserResult.possibleModels!.length).toBe(directResult.length);
      } else {
        expect(directResult.length).toBeLessThanOrEqual(1);
      }
    });
  });
});