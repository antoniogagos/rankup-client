export interface ProcessedEventRepo {
	has(eventKey: string): Promise<boolean>;
	mark(eventKey: string): Promise<void>;
	markIfAbsent(eventKey: string): Promise<boolean>;
}
