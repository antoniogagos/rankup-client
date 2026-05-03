import type { DomainEvent } from '../types.js';

export type EventMetadataInput = {
	requestId?: string;
	correlationId?: string;
	causationId?: string;
};

export function resolveEventMetadata(input: EventMetadataInput): Pick<DomainEvent, 'requestId' | 'correlationId' | 'causationId'> {
	const metadata: Pick<DomainEvent, 'requestId' | 'correlationId' | 'causationId'> = {};

	if (input.requestId) {
		metadata.requestId = input.requestId;
	}

	const resolvedCorrelationId = input.correlationId ?? input.requestId;
	if (resolvedCorrelationId) {
		metadata.correlationId = resolvedCorrelationId;
	}

	const resolvedCausationId = input.causationId ?? input.requestId;
	if (resolvedCausationId) {
		metadata.causationId = resolvedCausationId;
	}

	return metadata;
}
