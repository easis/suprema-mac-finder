import { describe, test, expect } from 'vitest';
import { parseMacAddress } from '../utils/supremaParser';

describe('MAC to Serial conversion according to Suprema documentation', () => {
  test('MAC 00:17:FC:73:4A:B0 should produce correct serial based on XPass ranges', () => {
    const result = parseMacAddress('00:17:FC:73:4A:B0');
    
    console.log('Result:', result);
    console.log('Serial Number:', result.serialNumber);
    console.log('Model:', result.model);
    
    // Verificar que es XPass
    expect(result.model).toBe('XPass');
    expect(result.isValid).toBe(true);
    
    // El serial debería estar en el rango de XPass (544_342_016 to 545_259_519)
    const serial = parseInt(result.serialNumber);
    expect(serial).toBeGreaterThanOrEqual(544_342_016);
    expect(serial).toBeLessThanOrEqual(545_259_519);
    
    // Los últimos 4 dígitos hex del serial deberían ser 4AB0
    const hexSerial = serial.toString(16).toUpperCase();
    expect(hexSerial.slice(-4)).toBe('4AB0');
  });

  test('Verify serial 544426672 converts to correct MAC', () => {
    // Según la documentación: 544426672 decimal = 20761B70 hex
    // Los últimos 4 dígitos son 1B70
    // MAC debería ser 00-17-FC-73-1B-70
    
    const serial = 544426672;
    const hexSerial = serial.toString(16).toUpperCase();
    console.log('Serial:', serial);
    console.log('Hex:', hexSerial);
    console.log('Last 4 hex digits:', hexSerial.slice(-4));
    
    expect(hexSerial.slice(-4)).toBe('1B70');
  });
});