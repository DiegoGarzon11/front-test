import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from '../features/checkout/checkoutSlice.js';
import * as api from '../services/api.js';
import type { Product } from '../interfaces/index.js';
import { ProductPage } from './ProductPage.js';
import { Provider } from 'react-redux';
jest.mock('../services/api.js');

function renderWithStore() {
	const store = configureStore({ reducer: { checkout: checkoutReducer } });
	render(
		<Provider store={store}>
			<ProductPage />
		</Provider>
	);
	return store;
}

describe('ProductPage', () => {
	const products: Product[] = [
		{
			id: 'product-1',
			name: 'Audífonos inalámbricos',
			description: 'Con cancelación de ruido',
			price: 25000000,
			stock: 5,
			imageUrl: null,
		},
		{
			id: 'product-2',
			name: 'Mochila urbana',
			description: 'Resistente al agua',
			price: 12000000,
			stock: 0,
			imageUrl: null,
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('muestra los productos obtenidos de la API', async () => {
		jest.spyOn(api, 'getProducts').mockResolvedValue(products);

		renderWithStore();

		expect(await screen.findByText('Audífonos inalámbricos')).toBeInTheDocument();
		expect(screen.getByText('Mochila urbana')).toBeInTheDocument();
	});

	it('muestra un mensaje de error si la API falla', async () => {
		jest.spyOn(api, 'getProducts').mockRejectedValue(new Error('fallo de red'));

		renderWithStore();

		expect(await screen.findByText('No pudimos cargar los productos. Intenta de nuevo.')).toBeInTheDocument();
	});

	it('deshabilita el botón de comprar cuando no hay stock', async () => {
		jest.spyOn(api, 'getProducts').mockResolvedValue(products);

		renderWithStore();
		await screen.findByText('Mochila urbana');

		const buttons = screen.getAllByRole('button', { name: /sin stock|comprar/i });
		const outOfStockButton = buttons.find((btn) => btn.textContent === 'Sin stock');

		expect(outOfStockButton).toBeDisabled();
	});

	it('selecciona un producto y avanza el estado al hacer clic en comprar', async () => {
		jest.spyOn(api, 'getProducts').mockResolvedValue(products);
		const user = userEvent.setup();

		const store = renderWithStore();
		await screen.findByText('Audífonos inalámbricos');

		const buyButtons = screen.getAllByRole('button', { name: 'Comprar' });
		await user.click(buyButtons[0]);

		await waitFor(() => {
			expect(store.getState().checkout.currentStep).toBe('CARD_MODAL');
			expect(store.getState().checkout.selectedProduct?.id).toBe('product-1');
		});
	});
});
