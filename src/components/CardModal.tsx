
import { useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { submitCheckoutDetails } from '../features/checkout/checkoutSlice';
import { detectCardBrand, formatCardNumber, isValidCardNumber, isValidCvc, isValidExpiry } from '../utils/cardValitation';

interface FormErrors {
	[key: string]: string;
}

export function CardModal() {
	const dispatch = useAppDispatch();
	const product = useAppSelector((state) => state.checkout.selectedProduct);

	const [cardNumber, setCardNumber] = useState('');
	const [cardExpMonth, setCardExpMonth] = useState('');
	const [cardExpYear, setCardExpYear] = useState('');
	const [cardCvc, setCardCvc] = useState('');
	const [cardHolder, setCardHolder] = useState('');

	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');

	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [region, setRegion] = useState('');
	const [postalCode, setPostalCode] = useState('');

	const [errors, setErrors] = useState<FormErrors>({});

	const brand = detectCardBrand(cardNumber);

	function validate(): boolean {
		const newErrors: FormErrors = {};

		if (!isValidCardNumber(cardNumber)) {
			newErrors.cardNumber = 'Número de tarjeta inválido';
		}
		if (!isValidExpiry(cardExpMonth, cardExpYear)) {
			newErrors.cardExpiry = 'Fecha de expiración inválida';
		}
		if (!isValidCvc(cardCvc)) {
			newErrors.cardCvc = 'CVC inválido';
		}
		if (cardHolder.trim().length < 3) {
			newErrors.cardHolder = 'Ingresa el nombre del titular';
		}
		if (!/^\S+@\S+\.\S+$/.test(email)) {
			newErrors.email = 'Correo inválido';
		}
		if (fullName.trim().length < 3) {
			newErrors.fullName = 'Ingresa tu nombre completo';
		}
		if (!/^[0-9]{7,15}$/.test(phone)) {
			newErrors.phone = 'Teléfono inválido';
		}
		if (address.trim().length < 5) {
			newErrors.address = 'Ingresa una dirección válida';
		}
		if (city.trim().length < 2) {
			newErrors.city = 'Ingresa una ciudad válida';
		}
		if (region.trim().length < 2) {
			newErrors.region = 'Ingresa un departamento/región válido';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSubmit(event: FormEvent) {
		event.preventDefault();

		if (!validate()) return;

		dispatch(
			submitCheckoutDetails({
				cardData: {
					cardNumber: cardNumber.replace(/\D/g, ''),
					cardExpMonth,
					cardExpYear,
					cardCvc,
					cardHolder,
				},
				customerData: { email, fullName, phone },
				deliveryData: {
					address,
					city,
					region,
					postalCode: postalCode || undefined,
				},
			})
		);
	}

	if (!product) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4'>
			<div className='max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:max-w-lg sm:rounded-3xl'>
				<div className='mb-5'>
					<p className='font-mono text-xs uppercase tracking-widest text-teal'>Paso 2 de 4</p>
					<h2 className='mt-1 font-display text-xl font-semibold'>Datos de pago y entrega</h2>
					<p className='mt-1 text-sm text-ink/60'>
						Comprando: <span className='font-medium text-ink'>{product.name}</span>
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className='space-y-5'>
					<fieldset className='space-y-3'>
						<legend className='font-display text-sm font-semibold'>Tarjeta</legend>

						<div>
							<div className='flex items-center justify-between'>
								<label className='text-xs font-medium text-ink/70'>Número de tarjeta</label>
								{brand !== 'UNKNOWN' && <span className='font-mono text-xs font-semibold text-teal'>{brand}</span>}
							</div>
							<input
								type='text'
								inputMode='numeric'
								value={formatCardNumber(cardNumber)}
								onChange={(e) => setCardNumber(e.target.value)}
								placeholder='4242 4242 4242 4242'
								className='mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm outline-none focus:border-teal'
							/>
							{errors.cardNumber && <p className='mt-1 text-xs text-error'>{errors.cardNumber}</p>}
						</div>

						<div className='grid grid-cols-3 gap-2'>
							<div>
								<label className='text-xs font-medium text-ink/70'>Mes</label>
								<input
									type='text'
									inputMode='numeric'
									maxLength={2}
									value={cardExpMonth}
									onChange={(e) => setCardExpMonth(e.target.value)}
									placeholder='12'
									className='mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm outline-none focus:border-teal'
								/>
							</div>
							<div>
								<label className='text-xs font-medium text-ink/70'>Año</label>
								<input
									type='text'
									inputMode='numeric'
									maxLength={2}
									value={cardExpYear}
									onChange={(e) => setCardExpYear(e.target.value)}
									placeholder='29'
									className='mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm outline-none focus:border-teal'
								/>
							</div>
							<div>
								<label className='text-xs font-medium text-ink/70'>CVC</label>
								<input
									type='text'
									inputMode='numeric'
									maxLength={4}
									value={cardCvc}
									onChange={(e) => setCardCvc(e.target.value)}
									placeholder='123'
									className='mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm outline-none focus:border-teal'
								/>
							</div>
						</div>
						{(errors.cardExpiry || errors.cardCvc) && <p className='text-xs text-error'>{errors.cardExpiry || errors.cardCvc}</p>}

						<div>
							<label className='text-xs font-medium text-ink/70'>Nombre del titular</label>
							<input
								type='text'
								value={cardHolder}
								onChange={(e) => setCardHolder(e.target.value)}
								placeholder='Pedro Pérez'
								className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
							/>
							{errors.cardHolder && <p className='mt-1 text-xs text-error'>{errors.cardHolder}</p>}
						</div>
					</fieldset>

					<fieldset className='space-y-3'>
						<legend className='font-display text-sm font-semibold'>Contacto</legend>

						<div>
							<label className='text-xs font-medium text-ink/70'>Correo</label>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='tucorreo@ejemplo.com'
								className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
							/>
							{errors.email && <p className='mt-1 text-xs text-error'>{errors.email}</p>}
						</div>

						<div>
							<label className='text-xs font-medium text-ink/70'>Nombre completo</label>
							<input
								type='text'
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder='Pedro Pérez'
								className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
							/>
							{errors.fullName && <p className='mt-1 text-xs text-error'>{errors.fullName}</p>}
						</div>

						<div>
							<label className='text-xs font-medium text-ink/70'>Teléfono</label>
							<input
								type='tel'
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder='3001234567'
								className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
							/>
							{errors.phone && <p className='mt-1 text-xs text-error'>{errors.phone}</p>}
						</div>
					</fieldset>

					<fieldset className='space-y-3'>
						<legend className='font-display text-sm font-semibold'>Entrega</legend>

						<div>
							<label className='text-xs font-medium text-ink/70'>Dirección</label>
							<input
								type='text'
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder='Calle 123 #45-67'
								className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
							/>
							{errors.address && <p className='mt-1 text-xs text-error'>{errors.address}</p>}
						</div>

						<div className='grid grid-cols-2 gap-2'>
							<div>
								<label className='text-xs font-medium text-ink/70'>Ciudad</label>
								<input
									type='text'
									value={city}
									onChange={(e) => setCity(e.target.value)}
									placeholder='Bogotá'
									className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
								/>
								{errors.city && <p className='mt-1 text-xs text-error'>{errors.city}</p>}
							</div>
							<div>
								<label className='text-xs font-medium text-ink/70'>Región</label>
								<input
									type='text'
									value={region}
									onChange={(e) => setRegion(e.target.value)}
									placeholder='Cundinamarca'
									className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
								/>
								{errors.region && <p className='mt-1 text-xs text-error'>{errors.region}</p>}
							</div>
						</div>

						<div>
							<label className='text-xs font-medium text-ink/70'>Código postal (opcional)</label>
							<input
								type='text'
								value={postalCode}
								onChange={(e) => setPostalCode(e.target.value)}
								placeholder='110111'
								className='mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal'
							/>
						</div>
					</fieldset>

					<button
						type='submit'
						className='w-full rounded-lg bg-teal px-4 py-3 font-medium text-white transition hover:bg-teal-dark'>
						Continuar
					</button>
				</form>
			</div>
		</div>
	);
}
