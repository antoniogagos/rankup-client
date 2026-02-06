export type RecapCard = {
	cardId: string;
	type: string;
	title: string;
	subtitle?: string;
	value?: string | number;
	valueLabel?: string;
	imageUrl?: string;
	payload?: Record<string, unknown>;
};
