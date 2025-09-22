import { describe, test, expect } from 'vitest';
import { parseMacAddress } from '../utils/supremaParser';

describe('Real device test - XPass 544426672', () => {
  test('MAC 00:17:FC:73:4A:B0 should return serial 544426672 for real XPass device', () => {
    const realMac = '00:17:FC:73:4A:B0';
    const expectedSerial = '544426672';
    
    const result = parseMacAddress(realMac);
    
    console.log('Real device test:');
    console.log('MAC:', realMac);
    console.log('Expected Serial:', expectedSerial);
    console.log('Actual Result:', result);
    console.log('Actual Serial:', result.serialNumber);
    console.log('Model:', result.model);
    console.log('Is Valid:', result.isValid);
    
    // Verificaciones básicas
    expect(result.isValid).toBe(true);
    expect(result.model).toBe('XPass');
    expect(result.macAddress).toBe('00:17:FC:73:4A:B0');
    
    // La verificación clave - el serial debe coincidir
    expect(result.serialNumber).toBe(expectedSerial);
  });
  
  test('Verify the math behind the conversion', () => {
    const targetSerial = 544426672;
    const expectedHex = targetSerial.toString(16).toUpperCase();
    const expectedLastFour = expectedHex.slice(-4);
    
    console.log('\nMath verification:');
    console.log('Target Serial:', targetSerial);
    console.log('As Hex:', expectedHex);
    console.log('Last 4 hex digits:', expectedLastFour);
    console.log('Expected MAC ending:', expectedLastFour);
    
    // Verificar que 544426672 efectivamente termina en 4AB0
    expect(expectedLastFour).toBe('4AB0');
    
    // Verificar que está en el rango XPass
    const xpassStart = 544_342_016;
    const xpassEnd = 545_259_519;
    expect(targetSerial).toBeGreaterThanOrEqual(xpassStart);
    expect(targetSerial).toBeLessThanOrEqual(xpassEnd);
  });
});