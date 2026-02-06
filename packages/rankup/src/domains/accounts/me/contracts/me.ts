import type { Me, UpdateMeRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IMeService {
	getMe(): Promise<Me>;
	updateMe(request: UpdateMeRequest): Promise<Me>;
}

export const IMeService = createDecorator<IMeService>('meService');
