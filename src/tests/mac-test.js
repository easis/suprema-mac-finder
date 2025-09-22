import { parseMacAddress } from '../utils/supremaParser';

// Test rápido para verificar la corrección
const testMac = '00:17:FC:73:4A:B0';
const result = parseMacAddress(testMac);

console.log('MAC Address:', testMac);
console.log('Parsed Result:', result);
console.log('Serial Number:', result.serialNumber);
console.log('Model:', result.model);

// También probar con la MAC del test original
const testMac2 = '00-17-FC-73-4A-BF';
const result2 = parseMacAddress(testMac2);

console.log('\nMAC Address 2:', testMac2);
console.log('Parsed Result 2:', result2);
console.log('Serial Number 2:', result2.serialNumber);
console.log('Model 2:', result2.model);