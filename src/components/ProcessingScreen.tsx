
export function ProcessingScreen() {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm'>
			<div className='flex flex-col items-center gap-4 rounded-3xl bg-white px-8 py-10 shadow-xl'>
				<div className='h-10 w-10 animate-spin rounded-full border-4 border-border border-t-teal' />
				<p className='font-mono text-sm text-ink/60'>Procesando tu pago…</p>
			</div>
		</div>
	);
}
