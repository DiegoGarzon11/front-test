
import { detectCardBrand, formatCardNumber, isValidCardNumber, isValidCvc, isValidExpiry } from './cardValitation';

describe('detectCardBrand', () => {
	it('detecta Visa por el prefijo 4', () => {
		expect(detectCardBrand('4242424242424242')).toBe('VISA');
	});

	it('detecta Mastercard por el rango clásico 51-55', () => {
		expect(detectCardBrand('5412345678901234')).toBe('MASTERCARD');
	});

	it('detecta Mastercard por el rango extendido 2221-2720', () => {
		expect(detectCardBrand('2223000010000005')).toBe('MASTERCARD');
	});

	it('retorna UNKNOWN para un prefijo no reconocido', () => {
		expect(detectCardBrand('9999999999999999')).toBe('UNKNOWN');
	});
});

describe('isValidCardNumber', () => {
	it('acepta un número válido según Luhn', () => {
		expect(isValidCardNumber('4242424242424242')).toBe(true);
	});

	it('rechaza un número que no pasa Luhn', () => {
		expect(isValidCardNumber('4242424242424241')).toBe(false);
	});

	it('rechaza números demasiado cortos', () => {
		expect(isValidCardNumber('42424242')).toBe(false);
	});
});

describe('isValidExpiry', () => {
	it('acepta una fecha futura válida', () => {
		expect(isValidExpiry('12', '30')).toBe(true);
	});

	it('rechaza un mes fuera de rango', () => {
		expect(isValidExpiry('13', '30')).toBe(false);
	});

	it('rechaza una fecha ya vencida', () => {
		expect(isValidExpiry('01', '20')).toBe(false);
	});
});

describe('isValidCvc', () => {
	it('acepta CVC de 3 dígitos', () => {
		expect(isValidCvc('123')).toBe(true);
	});

	it('acepta CVC de 4 dígitos (Amex)', () => {
		expect(isValidCvc('1234')).toBe(true);
	});

	it('rechaza CVC con letras', () => {
		expect(isValidCvc('12a')).toBe(false);
	});
});

describe('formatCardNumber', () => {
	it('agrega espacios cada 4 dígitos', () => {
		expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
	});
});
