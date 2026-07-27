import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PaymentSummary } from './PaymentSummary.js';
import checkoutReducer, { selectProduct, submitCheckoutDetails } from '../features/checkout/checkoutSlice.js';
import * as api from '../services/api.js';
import type { Product, Transaction } from '../interfaces';

jest.mock('../services/api.js');

const product: Product = {
	id: 'product-1',
	name: 'Audífonos inalámbricos',
	description: 'Con cancelación de ruido',
	price: 25000000,
	stock: 5,
	imageUrl: null,
};

const checkoutDetails = {
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

function renderWithStore() {
	const store = configureStore({ reducer: { checkout: checkoutReducer } });
	store.dispatch(selectProduct(product));
	store.dispatch(submitCheckoutDetails(checkoutDetails));

	render(
		<Provider store={store}>
			<PaymentSummary />
		</Provider>
	);

	return store;
}

describe('PaymentSummary', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('muestra el desglose del monto total', () => {
		renderWithStore();
		expect(screen.getByText('Audífonos inalámbricos')).toBeInTheDocument();
		expect(screen.getByText('Total')).toBeInTheDocument();
	});

	it('procesa el pago exitosamente y actualiza el estado a RESULT', async () => {
		const transaction: Transaction = {
			id: 'transaction-1',
			status: 'APPROVED',
			productId: 'product-1',
			customerId: 'customer-1',
			deliveryId: 'delivery-1',
			productAmount: 25000000,
			baseFee: 500000,
			deliveryFee: 800000,
			totalAmount: 26300000,
			transactionId: 'gateway-tx-1',
			reference: null,
			failureReason: null,
		};

		jest.spyOn(api, 'createCustomer').mockResolvedValue({
			id: 'customer-1',
			...checkoutDetails.customerData,
		});
		jest.spyOn(api, 'createDelivery').mockResolvedValue({
			id: 'delivery-1',
			customerId: 'customer-1',
			...checkoutDetails.deliveryData,
			postalCode: null,
		});
		jest.spyOn(api, 'processPayment').mockResolvedValue(transaction);

		const user = userEvent.setup();
		const store = renderWithStore();

		await user.click(screen.getByRole('button', { name: /Pagar/ }));

		await waitFor(() => {
			expect(store.getState().checkout.currentStep).toBe('RESULT');
			expect(store.getState().checkout.transaction).toEqual(transaction);
		});
	});

	it('marca el pago como fallido si la API lanza un error', async () => {
		jest.spyOn(api, 'createCustomer').mockResolvedValue({
			id: 'customer-1',
			...checkoutDetails.customerData,
		});
		jest.spyOn(api, 'createDelivery').mockResolvedValue({
			id: 'delivery-1',
			customerId: 'customer-1',
			...checkoutDetails.deliveryData,
			postalCode: null,
		});
		jest.spyOn(api, 'processPayment').mockRejectedValue(new Error('Sin stock disponible'));

		const user = userEvent.setup();
		const store = renderWithStore();

		await user.click(screen.getByRole('button', { name: /Pagar/ }));

		await waitFor(() => {
			expect(store.getState().checkout.currentStep).toBe('RESULT');
			expect(store.getState().checkout.error).toBe('Sin stock disponible');
		});
	});

	it('vuelve a CARD_MODAL al hacer clic en "Volver a editar"', async () => {
		const user = userEvent.setup();
		const store = renderWithStore();

		await user.click(screen.getByRole('button', { name: 'Volver a editar' }));

		expect(store.getState().checkout.currentStep).toBe('CARD_MODAL');
	});
});
