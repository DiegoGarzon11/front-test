import checkoutReducer, {
	selectProduct,
	submitCheckoutDetails,
	startProcessing,
	paymentSucceeded,
	paymentFailed,
	backToProductStep,
	goToStep,
} from './checkoutSlice.js';
import type { Product, Transaction } from '../../interfaces';

describe('checkoutSlice', () => {
	const product: Product = {
		id: 'product-1',
		name: 'Producto de prueba',
		description: 'Descripción',
		price: 10000000,
		stock: 5,
		imageUrl: null,
	};

	const checkoutDetailsPayload = {
		customerData: { email: 'test@test.com', fullName: 'Pedro Pérez', phone: '3001234567' },
		deliveryData: { address: 'Calle 123', city: 'Bogotá', region: 'Cundinamarca' },
		cardData: {
			cardNumber: '4242424242424242',
			cardExpMonth: '12',
			cardExpYear: '29',
			cardCvc: '123',
			cardHolder: 'Pedro Perez',
		},
	};

	const transaction: Transaction = {
		id: 'transaction-1',
		status: 'APPROVED',
		productId: 'product-1',
		customerId: 'customer-1',
		deliveryId: 'delivery-1',
		productAmount: 10000000,
		baseFee: 500000,
		deliveryFee: 800000,
		totalAmount: 11300000,
		transactionId: 'gateway-tx-1',
		reference: null,
		failureReason: null,
	};

	it('retorna el estado inicial', () => {
		const state = checkoutReducer(undefined, { type: 'unknown' });
		expect(state.currentStep).toBe('PRODUCT');
		expect(state.selectedProduct).toBeNull();
	});

	it('selectProduct avanza a CARD_MODAL y guarda el producto', () => {
		const state = checkoutReducer(undefined, selectProduct(product));
		expect(state.currentStep).toBe('CARD_MODAL');
		expect(state.selectedProduct).toEqual(product);
	});

	it('submitCheckoutDetails guarda los datos y avanza a PAYMENT_SUMMARY', () => {
		const state = checkoutReducer(undefined, submitCheckoutDetails(checkoutDetailsPayload));
		expect(state.currentStep).toBe('PAYMENT_SUMMARY');
		expect(state.customerData).toEqual(checkoutDetailsPayload.customerData);
		expect(state.deliveryData).toEqual(checkoutDetailsPayload.deliveryData);
		expect(state.cardData).toEqual(checkoutDetailsPayload.cardData);
	});

	it('startProcessing avanza a PROCESSING y limpia el error', () => {
		const state = checkoutReducer({ currentStep: 'PAYMENT_SUMMARY', error: 'error viejo' } as never, startProcessing());
		expect(state.currentStep).toBe('PROCESSING');
		expect(state.error).toBeNull();
	});

	it('paymentSucceeded guarda la transacción, limpia cardData y avanza a RESULT', () => {
		const state = checkoutReducer({ cardData: checkoutDetailsPayload.cardData } as never, paymentSucceeded(transaction));
		expect(state.currentStep).toBe('RESULT');
		expect(state.transaction).toEqual(transaction);
		expect(state.cardData).toBeNull();
	});

	it('paymentFailed guarda el error, limpia cardData y avanza a RESULT', () => {
		const state = checkoutReducer({ cardData: checkoutDetailsPayload.cardData } as never, paymentFailed('Fondos insuficientes'));
		expect(state.currentStep).toBe('RESULT');
		expect(state.error).toBe('Fondos insuficientes');
		expect(state.cardData).toBeNull();
	});

	it('backToProductStep reinicia todo el estado', () => {
		const state = checkoutReducer({ currentStep: 'RESULT', selectedProduct: product, transaction } as never, backToProductStep());
		expect(state.currentStep).toBe('PRODUCT');
		expect(state.selectedProduct).toBeNull();
		expect(state.transaction).toBeNull();
	});

	it('goToStep cambia el paso actual', () => {
		const state = checkoutReducer(undefined, goToStep('CARD_MODAL'));
		expect(state.currentStep).toBe('CARD_MODAL');
	});
});
