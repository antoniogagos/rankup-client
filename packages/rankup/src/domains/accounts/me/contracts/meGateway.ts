import type { Me, UpdateMeRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IMeGateway {
	getMe(): Promise<Me>;
	updateMe(request: UpdateMeRequest): Promise<Me>;
}

export const IMeGateway = createDecorator<IMeGateway>('meGateway');
