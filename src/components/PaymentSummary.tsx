
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { createCustomer, createDelivery, processPayment } from '../services/api';
import { goToStep, paymentFailed, paymentSucceeded, startProcessing } from '../features/checkout/checkoutSlice';

const BASE_FEE = 500000;
const DELIVERY_FEE = 800000;

function formatPrice(cents: number): string {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		maximumFractionDigits: 0,
	}).format(cents / 100);
}

export function PaymentSummary() {
	const dispatch = useAppDispatch();
	const { selectedProduct, customerData, deliveryData, cardData } = useAppSelector((state) => state.checkout);
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!selectedProduct || !customerData || !deliveryData || !cardData) {
		return null;
	}

	const total = selectedProduct.price + BASE_FEE + DELIVERY_FEE;

	async function handlePay() {
		setIsSubmitting(true);
		dispatch(startProcessing());

		try {
			const customer = await createCustomer(customerData!);
			const delivery = await createDelivery(customer.id, deliveryData!);

			const transaction = await processPayment({
				productId: selectedProduct!.id,
				customerId: customer.id,
				customerEmail: customer.email,
				deliveryId: delivery.id,
				baseFee: BASE_FEE,
				deliveryFee: DELIVERY_FEE,
				cardNumber: cardData!.cardNumber,
				cardExpMonth: cardData!.cardExpMonth,
				cardExpYear: cardData!.cardExpYear,
				cardCvc: cardData!.cardCvc,
				cardHolder: cardData!.cardHolder,
			});

			dispatch(paymentSucceeded(transaction));
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
			dispatch(paymentFailed(message));
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className='fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4'>
			<div className='w-full rounded-t-3xl bg-white p-6 shadow-xl sm:max-w-md sm:rounded-3xl'>
				<p className='font-mono text-xs uppercase tracking-widest text-teal'>Paso 3 de 4</p>
				<h2 className='mt-1 font-display text-xl font-semibold'>Resumen de pago</h2>

				<dl className='mt-5 space-y-3 border-t border-border pt-4'>
					<div className='flex justify-between text-sm'>
						<dt className='text-ink/60'>{selectedProduct.name}</dt>
						<dd className='font-mono'>{formatPrice(selectedProduct.price)}</dd>
					</div>
					<div className='flex justify-between text-sm'>
						<dt className='text-ink/60'>Tarifa base</dt>
						<dd className='font-mono'>{formatPrice(BASE_FEE)}</dd>
					</div>
					<div className='flex justify-between text-sm'>
						<dt className='text-ink/60'>Envío</dt>
						<dd className='font-mono'>{formatPrice(DELIVERY_FEE)}</dd>
					</div>
					<div className='flex justify-between border-t border-border pt-3 text-base font-semibold'>
						<dt>Total</dt>
						<dd className='font-mono'>{formatPrice(total)}</dd>
					</div>
				</dl>

				<div className='mt-6 space-y-2'>
					<button
						type='button'
						onClick={handlePay}
						disabled={isSubmitting}
						className='w-full rounded-lg bg-teal px-4 py-3 font-medium text-white transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer'>
						{isSubmitting ? 'Procesando…' : `Pagar ${formatPrice(total)}`}
					</button>
					<button
						type='button'
						onClick={() => dispatch(goToStep('CARD_MODAL'))}
						disabled={isSubmitting}
						className='w-full rounded-lg px-4 py-2 text-sm text-ink/60 transition hover:text-ink'>
						Volver a editar
					</button>
				</div>
			</div>
		</div>
	);
}
