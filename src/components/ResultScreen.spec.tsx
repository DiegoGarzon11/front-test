// src/components/ResultScreen.spec.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ResultScreen } from './ResultScreen.js';
import checkoutReducer, { paymentSucceeded, paymentFailed } from '../features/checkout/checkoutSlice.js';
import type { Transaction } from '../interfaces';

const baseTransaction: Transaction = {
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

function renderWithState(action: ReturnType<typeof paymentSucceeded> | ReturnType<typeof paymentFailed>) {
	const store = configureStore({ reducer: { checkout: checkoutReducer } });
	store.dispatch(action);

	render(
		<Provider store={store}>
			<ResultScreen />
		</Provider>
	);

	return store;
}

describe('ResultScreen', () => {
	it('muestra "Pago aprobado" cuando la transacción fue exitosa', () => {
		renderWithState(paymentSucceeded(baseTransaction));
		expect(screen.getByText('Pago aprobado')).toBeInTheDocument();
	});

	it('muestra "Pago rechazado" con el motivo cuando la transacción fue declinada', () => {
		renderWithState(
			paymentSucceeded({
				...baseTransaction,
				status: 'DECLINED',
				failureReason: 'Fondos insuficientes',
			})
		);
		expect(screen.getByText('Pago rechazado')).toBeInTheDocument();
		expect(screen.getByText('Fondos insuficientes')).toBeInTheDocument();
	});

	it('muestra un mensaje de error genérico cuando falla la comunicación con el backend', () => {
		renderWithState(paymentFailed('No pudimos conectar con el servidor'));
		expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
		expect(screen.getByText('No pudimos conectar con el servidor')).toBeInTheDocument();
	});

	it('reinicia el estado del checkout al volver al catálogo', async () => {
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		const user = userEvent.setup();
		const store = renderWithState(paymentSucceeded(baseTransaction));

		await user.click(screen.getByRole('button', { name: 'Volver al catálogo' }));

		expect(store.getState().checkout.currentStep).toBe('PRODUCT');
		consoleErrorSpy.mockRestore();
	});
});
