import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CardModal } from './CardModal.js';
import checkoutReducer, { selectProduct } from '../features/checkout/checkoutSlice.js';
import type { Product } from '../interfaces';

function renderWithStore() {
	const store = configureStore({ reducer: { checkout: checkoutReducer } });

	const product: Product = {
		id: 'product-1',
		name: 'Audífonos inalámbricos',
		description: 'Con cancelación de ruido',
		price: 25000000,
		stock: 5,
		imageUrl: null,
	};

	store.dispatch(selectProduct(product));

	render(
		<Provider store={store}>
			<CardModal />
		</Provider>
	);

	return store;
}

describe('CardModal', () => {
	it('muestra el nombre del producto que se está comprando', () => {
		renderWithStore();
		expect(screen.getByText(/Audífonos inalámbricos/)).toBeInTheDocument();
	});

	it('detecta y muestra la marca VISA al escribir un número que empieza en 4', async () => {
		const user = userEvent.setup();
		renderWithStore();

		const cardNumberInput = screen.getByPlaceholderText('4242 4242 4242 4242');
		await user.type(cardNumberInput, '4242424242424242');

		expect(screen.getByText('VISA')).toBeInTheDocument();
	});

	it('muestra errores de validación si se envía el formulario vacío', async () => {
		const user = userEvent.setup();
		renderWithStore();

		const submitButton = screen.getByRole('button', { name: 'Continuar' });
		await user.click(submitButton);

		expect(await screen.findByText('Número de tarjeta inválido')).toBeInTheDocument();
		expect(screen.getByText('Correo inválido')).toBeInTheDocument();
	});

	it('avanza a PAYMENT_SUMMARY cuando todos los datos son válidos', async () => {
		const user = userEvent.setup();
		const store = renderWithStore();

		await user.type(screen.getByPlaceholderText('4242 4242 4242 4242'), '4242424242424242');
		await user.type(screen.getByPlaceholderText('12'), '12');
		await user.type(screen.getByPlaceholderText('29'), '29');
		await user.type(screen.getByPlaceholderText('123'), '123');

		const pedroPerezInputs = screen.getAllByPlaceholderText('Pedro Pérez');
		await user.type(pedroPerezInputs[0], 'Pedro Pérez'); // titular de la tarjeta
		await user.type(pedroPerezInputs[1], 'Pedro Pérez'); // nombre completo del contacto

		await user.type(screen.getByPlaceholderText('tucorreo@ejemplo.com'), 'test@test.com');
		await user.type(screen.getByPlaceholderText('3001234567'), '3001234567');
		await user.type(screen.getByPlaceholderText('Calle 123 #45-67'), 'Calle 123 #45-67');
		await user.type(screen.getByPlaceholderText('Bogotá'), 'Bogotá');
		await user.type(screen.getByPlaceholderText('Cundinamarca'), 'Cundinamarca');

		await user.click(screen.getByRole('button', { name: 'Continuar' }));

		expect(store.getState().checkout.currentStep).toBe('PAYMENT_SUMMARY');
		expect(store.getState().checkout.cardData?.cardNumber).toBe('4242424242424242');
	});
});
