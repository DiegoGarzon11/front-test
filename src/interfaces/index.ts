export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	imageUrl: string | null;
}

export interface Customer {
	id: string;
	email: string;
	fullName: string;
	phone: string;
}

export interface Delivery {
	id: string;
	customerId: string;
	address: string;
	city: string;
	region: string;
	postalCode: string | null;
}

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';

export interface Transaction {
	id: string;
	status: TransactionStatus;
	productId: string;
	customerId: string;
	deliveryId: string;
	productAmount: number;
	baseFee: number;
	deliveryFee: number;
	totalAmount: number;
	transactionId: string | null;
	reference: string | null;
	failureReason: string | null;
}

export type CheckoutStep = 'PRODUCT' | 'CARD_MODAL' | 'PAYMENT_SUMMARY' | 'PROCESSING' | 'RESULT';

export interface CardFormData {
	cardNumber: string;
	cardExpMonth: string;
	cardExpYear: string;
	cardCvc: string;
	cardHolder: string;
}

export interface DeliveryFormData {
	address: string;
	city: string;
	region: string;
	postalCode?: string;
}

export interface CustomerFormData {
	email: string;
	fullName: string;
	phone: string;
}
