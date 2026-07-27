import { render, screen } from '@testing-library/react';
import { ProcessingScreen } from './ProcessingScreen.js';

describe('ProcessingScreen', () => {
	it('muestra el mensaje de procesamiento', () => {
		render(<ProcessingScreen />);
		expect(screen.getByText('Procesando tu pago…')).toBeInTheDocument();
	});
});
