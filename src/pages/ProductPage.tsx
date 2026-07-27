import { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/hook';
import { getProducts } from '../services/api';
import { selectProduct } from '../features/checkout/checkoutSlice';
import type { Product } from '../interfaces';

const PRODUCT_IMAGES: Record<string, string> = {
	'Audífonos inalámbricos':
		'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8QUlSUE9EU3xlbnwwfHwwfHx8MA%3D%3D',
	'Mochila urbana':
		'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXJiYW4lMjBiYWNrcGFja3xlbnwwfHwwfHx8MA%3D%3D',
	'Reloj inteligente':
		'https://images.unsplash.com/photo-1722445423163-f57f92ea9f78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2FybWlufGVufDB8fDB8fHww',
};

function withImages(products: Product[]): Product[] {
	return products.map((product) => ({
		...product,
		imageUrl: PRODUCT_IMAGES[product.name] ?? product.imageUrl,
	}));
}

function formatPrice(cents: number): string {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		maximumFractionDigits: 0,
	}).format(cents / 100);
}

export function ProductPage() {
	const dispatch = useAppDispatch();
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getProducts()
			.then((data) => {
				setProducts(withImages(data));
			})
			.catch(() => setError('No pudimos cargar los productos. Intenta de nuevo.'))
			.finally(() => setIsLoading(false));
	}, []);

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p className='font-mono text-sm text-ink/60'>Cargando productos…</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex min-h-screen items-center justify-center px-4'>
				<p className='font-mono text-sm text-error'>{error}</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen px-4 py-10 sm:py-16'>
			<header className='mx-auto mb-10 max-w-4xl text-center'>
				<p className='font-mono text-xs uppercase tracking-widest text-teal'>Catálogo</p>
				<h1 className='mt-2 font-display text-3xl font-semibold sm:text-4xl'>Elige tu producto</h1>
			</header>

			<div className='mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
				{products.map((product) => (
					<article
						key={product.id}
						className='flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md'>
						<div className='mb-4 aspect-square overflow-hidden rounded-xl bg-bone'>
							{product.imageUrl ? (
								<img
									src={product.imageUrl}
									alt={product.name}
									loading='lazy'
									decoding='async'
									className='h-full w-full object-cover'
									onError={(e) => {
										e.currentTarget.style.display = 'none';
										e.currentTarget.nextElementSibling?.classList.remove('hidden');
									}}
								/>
							) : null}
							<div className={`flex h-full w-full items-center justify-center text-ink/20 ${product.imageUrl ? 'hidden' : ''}`}>
								<span className='font-mono text-xs'>Sin imagen</span>
							</div>
						</div>

						<h2 className='font-display text-lg font-semibold leading-tight'>{product.name}</h2>
						<p className='mt-1 flex-1 text-sm text-ink/60'>{product.description}</p>

						<div className='mt-4 flex items-center justify-between'>
							<span className='font-mono text-lg font-semibold text-ink'>{formatPrice(product.price)}</span>
							<span className={`font-mono text-xs ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
								{product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
							</span>
						</div>

						<button
							type='button'
							disabled={product.stock === 0}
							onClick={() => dispatch(selectProduct(product))}
							className='mt-4 rounded-lg bg-teal px-4 py-2.5 font-medium text-white transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:bg-ink/20 cursor-pointer'>
							{product.stock > 0 ? 'Comprar' : 'Sin stock'}
						</button>
					</article>
				))}
			</div>
		</div>
	);
}
