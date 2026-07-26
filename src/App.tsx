import { useAppSelector } from './app/hook';
import { ProductPage } from './pages/ProductPage';
import { CardModal } from './components/CardModal';
import { PaymentSummary } from './components/PaymentSummary';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ResultScreen } from './components/ResultScreen';

function App() {
	const currentStep = useAppSelector((state) => state.checkout.currentStep);

	return (
		<>
			<ProductPage />

			{currentStep === 'CARD_MODAL' && <CardModal />}
			{currentStep === 'PAYMENT_SUMMARY' && <PaymentSummary />}
			{currentStep === 'PROCESSING' && <ProcessingScreen />}
			{currentStep === 'RESULT' && <ResultScreen />}
		</>
	);
}

export default App;
