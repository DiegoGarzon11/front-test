
import type { RootState } from './store';

const STORAGE_KEY = 'checkout-state';

export function loadState(): Partial<RootState> | undefined {
	try {
		const serialized = localStorage.getItem(STORAGE_KEY);
		if (!serialized) return undefined;

		const parsed = JSON.parse(serialized) as RootState;

		const stepsNeedingCard: RootState['checkout']['currentStep'][] = ['PAYMENT_SUMMARY', 'PROCESSING'];

		if (stepsNeedingCard.includes(parsed.checkout.currentStep)) {
			parsed.checkout.currentStep = 'CARD_MODAL';
		}

		return parsed;
	} catch {
		return undefined;
	}
}

export function saveState(state: RootState): void {
	try {
		const { cardData: _cardData, ...checkoutWithoutCard } = state.checkout;

		const stateToPersist: RootState = {
			...state,
			checkout: { ...checkoutWithoutCard, cardData: null },
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
	} catch {
		throw new Error('error')
	}
}
