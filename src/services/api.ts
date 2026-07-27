
import type { Customer, CustomerFormData, Delivery, DeliveryFormData, Product, Transaction } from '../interfaces';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function handleResponse<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
		const message = Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? 'Error inesperado al comunicarse con el servidor');
		throw new Error(message);
	}
	return res.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
	const res = await fetch(`${API_URL}/products`);
	return handleResponse<Product[]>(res);
}

export async function createCustomer(data: CustomerFormData): Promise<Customer> {
	const res = await fetch(`${API_URL}/customers`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return handleResponse<Customer>(res);
}

export async function createDelivery(customerId: string, data: DeliveryFormData): Promise<Delivery> {
	const res = await fetch(`${API_URL}/deliveries`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ customerId, ...data }),
	});
	return handleResponse<Delivery>(res);
}

export interface ProcessPaymentInput {
	productId: string;
	customerId: string;
	customerEmail: string;
	deliveryId: string;
	baseFee: number;
	deliveryFee: number;
	cardNumber: string;
	cardExpMonth: string;
	cardExpYear: string;
	cardCvc: string;
	cardHolder: string;
}

export async function processPayment(data: ProcessPaymentInput): Promise<Transaction> {
	const res = await fetch(`${API_URL}/transactions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return handleResponse<Transaction>(res);
}
