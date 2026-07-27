import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CardFormData, CheckoutStep, CustomerFormData, DeliveryFormData, Product, Transaction } from '../../interfaces';

interface CheckoutState {
	currentStep: CheckoutStep;
	selectedProduct: Product | null;
	customerData: CustomerFormData | null;
	deliveryData: DeliveryFormData | null;
	cardData: CardFormData | null;
	transaction: Transaction | null;
	error: string | null;
}

const initialState: CheckoutState = {
	currentStep: 'PRODUCT',
	selectedProduct: null,
	customerData: null,
	deliveryData: null,
	cardData: null,
	transaction: null,
	error: null,
};

const checkoutSlice = createSlice({
	name: 'checkout',
	initialState,
	reducers: {
		selectProduct(state, action: PayloadAction<Product>) {
			state.selectedProduct = action.payload;
			state.currentStep = 'CARD_MODAL';
			state.error = null;
		},
		submitCheckoutDetails(
			state,
			action: PayloadAction<{
				customerData: CustomerFormData;
				deliveryData: DeliveryFormData;
				cardData: CardFormData;
			}>
		) {
			state.customerData = action.payload.customerData;
			state.deliveryData = action.payload.deliveryData;
			state.cardData = action.payload.cardData;
			state.currentStep = 'PAYMENT_SUMMARY';
		},
		startProcessing(state) {
			state.currentStep = 'PROCESSING';
			state.error = null;
		},
		paymentSucceeded(state, action: PayloadAction<Transaction>) {
			state.transaction = action.payload;
			state.cardData = null;
			state.currentStep = 'RESULT';
		},
		paymentFailed(state, action: PayloadAction<string>) {
			state.error = action.payload;
			state.cardData = null;
			state.currentStep = 'RESULT';
		},
		backToProductStep() {
			return { ...initialState };
		},
		goToStep(state, action: PayloadAction<CheckoutStep>) {
			state.currentStep = action.payload;
		},
	},
});

export const { selectProduct, submitCheckoutDetails, startProcessing, paymentSucceeded, paymentFailed, backToProductStep, goToStep } =
	checkoutSlice.actions;

export default checkoutSlice.reducer;
