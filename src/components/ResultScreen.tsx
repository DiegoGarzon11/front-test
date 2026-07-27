import { useAppDispatch, useAppSelector } from '../app/hook';
import { backToProductStep } from '../features/checkout/checkoutSlice';

function formatPrice(cents: number): string {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		maximumFractionDigits: 0,
	}).format(cents / 100);
}

export function ResultScreen() {
	const dispatch = useAppDispatch();
	const { transaction, error } = useAppSelector((state) => state.checkout);

	const isApproved = transaction?.status === 'APPROVED';
	const isDeclined = transaction?.status === 'DECLINED';
	const isError = Boolean(error) || transaction?.status === 'ERROR';

	function handleBack() {
		dispatch(backToProductStep());
		window.location.reload();
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4'>
			<div className='w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl'>
				{isApproved && (
					<>
						<div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10'>
							<span className='text-2xl text-success'>✓</span>
						</div>
						<h2 className='mt-4 font-display text-xl font-semibold'>Pago aprobado</h2>
						<p className='mt-1 text-sm text-ink/60'>Tu compra fue procesada correctamente.</p>
					</>
				)}

				{isDeclined && (
					<>
						<div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10'>
							<span className='text-2xl text-error'>✕</span>
						</div>
						<h2 className='mt-4 font-display text-xl font-semibold'>Pago rechazado</h2>
						<p className='mt-1 text-sm text-ink/60'>{transaction?.failureReason ?? 'Tu banco rechazó la transacción.'}</p>
					</>
				)}

				{isError && !isDeclined && (
					<>
						<div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10'>
							<span className='text-2xl text-error'>!</span>
						</div>
						<h2 className='mt-4 font-display text-xl font-semibold'>Algo salió mal</h2>
						<p className='mt-1 text-sm text-ink/60'>{error ?? 'No pudimos procesar tu pago. Intenta de nuevo.'}</p>
					</>
				)}

				{transaction && (
					<dl className='mt-6 space-y-2 rounded-xl bg-bone p-4 text-left text-sm'>
						<div className='flex justify-between'>
							<dt className='text-ink/60'>Referencia</dt>
							<dd className='font-mono text-xs'>{transaction.id}</dd>
						</div>
						<div className='flex justify-between'>
							<dt className='text-ink/60'>Total</dt>
							<dd className='font-mono'>{formatPrice(transaction.totalAmount)}</dd>
						</div>
					</dl>
				)}

				<button
					type='button'
					onClick={handleBack}
					className='mt-6 w-full rounded-lg bg-teal px-4 py-3 font-medium text-white transition hover:bg-teal-dark'>
					Volver al catálogo
				</button>
			</div>
		</div>
	);
}
