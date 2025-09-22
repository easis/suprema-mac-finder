import { describe, test, expect } from 'vitest';
import { getAllDevicesByModelId } from '../data/deviceModels';

describe('Debug serial to MAC conversion', () => {
  test('Check what models match serial 544426672', () => {
    const serial = 544426672;
    const matches = getAllDevicesByModelId(serial);
    
    console.log('Serial:', serial);
    console.log('Matches:', matches.map(m => m.name));
    
    // Verificar el rango XPass
    const xpassStart = 544_342_016;
    const xpassEnd = 545_259_519;
    console.log('XPass range:', xpassStart, 'to', xpassEnd);
    console.log('Is serial in XPass range?', serial >= xpassStart && serial <= xpassEnd);
    
    // Conversión manual
    const hex = serial.toString(16).toUpperCase();
    console.log('Serial as hex:', hex);
    console.log('Last 4 hex digits:', hex.slice(-4));
    
    // Si el último 4 dígitos son 4AB0, entonces la MAC sería 00-17-FC-73-4A-B0
    expect(hex.slice(-4)).toBe('4AB0');
  });
  
  test('What serial would generate MAC 00:17:FC:73:1B:70?', () => {
    // Si la MAC fuera 00:17:FC:73:1B:70, el serial sería:
    const lastFour = '1B70';
    const partialSerial = parseInt(lastFour, 16);
    console.log('Partial serial from 1B70:', partialSerial);
    
    // Buscar en el rango XPass
    const xpassStart = 544_342_016;
    const xpassEnd = 545_259_519;
    
    // Calcular qué serials completos tendrían 1B70 como últimos 4 dígitos
    const baseValue = Math.floor(xpassStart / 65536) * 65536;
    const candidate1 = baseValue + partialSerial;
    const candidate2 = (baseValue + 65536) + partialSerial;
    
    console.log('Candidate 1:', candidate1, '(in range?)', candidate1 >= xpassStart && candidate1 <= xpassEnd);
    console.log('Candidate 2:', candidate2, '(in range?)', candidate2 >= xpassStart && candidate2 <= xpassEnd);
  });
});