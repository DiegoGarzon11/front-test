
export type CardBrand = 'VISA' | 'MASTERCARD' | 'UNKNOWN';

export function detectCardBrand(cardNumber: string): CardBrand {
	const digits = cardNumber.replace(/\D/g, '');

	if (/^4/.test(digits)) {
		return 'VISA';
	}

	if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) {
		return 'MASTERCARD';
	}

	return 'UNKNOWN';
}

export function isValidCardNumber(cardNumber: string): boolean {
	const digits = cardNumber.replace(/\D/g, '');

	if (digits.length < 13 || digits.length > 19) {
		return false;
	}

	let sum = 0;
	let shouldDouble = false;

	for (let i = digits.length - 1; i >= 0; i--) {
		let digit = parseInt(digits[i], 10);

		if (shouldDouble) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}

		sum += digit;
		shouldDouble = !shouldDouble;
	}

	return sum % 10 === 0;
}

export function isValidExpiry(month: string, year: string): boolean {
	const monthNum = parseInt(month, 10);
	const yearNum = parseInt(year, 10);

	if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
		return false;
	}

	const now = new Date();
	const currentYear = now.getFullYear() % 100;
	const currentMonth = now.getMonth() + 1;

	if (yearNum < currentYear) return false;
	if (yearNum === currentYear && monthNum < currentMonth) return false;

	return true;
}

export function isValidCvc(cvc: string): boolean {
	return /^[0-9]{3,4}$/.test(cvc);
}

export function formatCardNumber(cardNumber: string): string {
	const digits = cardNumber.replace(/\D/g, '').slice(0, 19);
	return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}
