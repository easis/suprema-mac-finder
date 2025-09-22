import { describe, test, expect } from 'vitest';

describe('Analyze real device data patterns', () => {
  test('Analyze all real XPass devices to understand the pattern', () => {
    const realXPassDevices = [
      { serial: 544_385_059, mac: "00-17-FC-72-A8-23" },
      { serial: 544_426_687, mac: "00-17-FC-73-4A-BF" },
      { serial: 544_426_672, mac: "00-17-FC-73-4A-B0" },
      { serial: 544_420_824, mac: "00-17-FC-73-33-D8" },
    ];

    console.log('Real XPass device analysis:');
    realXPassDevices.forEach(device => {
      const hex = device.serial.toString(16).toUpperCase();
      const lastFour = hex.slice(-4);
      const macLastFour = device.mac.replace(/[-:]/g, '').slice(-4).toUpperCase();
      const baseValue = Math.floor(device.serial / 65536) * 65536;
      
      console.log(`Serial: ${device.serial}`);
      console.log(`  Hex: ${hex}`);
      console.log(`  Last 4: ${lastFour}`);
      console.log(`  MAC Last 4: ${macLastFour}`);
      console.log(`  Base (floor): ${baseValue}`);
      console.log(`  Offset: ${device.serial - baseValue}`);
      console.log(`  Match: ${lastFour === macLastFour ? '✅' : '❌'}`);
      console.log('---');
    });

    // Verificar que todos coinciden
    realXPassDevices.forEach(device => {
      const hex = device.serial.toString(16).toUpperCase();
      const lastFour = hex.slice(-4);
      const macLastFour = device.mac.replace(/[-:]/g, '').slice(-4).toUpperCase();
      
      expect(lastFour).toBe(macLastFour);
    });
  });

  test('Check XPass range distribution', () => {
    const xpassStart = 544_342_016;
    const xpassEnd = 545_259_519;
    
    console.log('\nXPass range analysis:');
    console.log(`Range: ${xpassStart} to ${xpassEnd}`);
    console.log(`Start hex: ${xpassStart.toString(16).toUpperCase()}`);
    console.log(`End hex: ${xpassEnd.toString(16).toUpperCase()}`);
    
    // Calcular cuántos bloques de 65536 caben en el rango
    const rangeSize = xpassEnd - xpassStart;
    const numBlocks = Math.ceil(rangeSize / 65536);
    console.log(`Range size: ${rangeSize}`);
    console.log(`Number of 65536 blocks: ${numBlocks}`);
    
    // Mostrar los bloques
    for (let i = 0; i < numBlocks; i++) {
      const blockStart = xpassStart + (i * 65536);
      const blockEnd = Math.min(blockStart + 65535, xpassEnd);
      const blockStartHex = blockStart.toString(16).toUpperCase();
      const blockEndHex = blockEnd.toString(16).toUpperCase();
      
      console.log(`Block ${i}: ${blockStart} - ${blockEnd} (${blockStartHex} - ${blockEndHex})`);
    }
  });
});