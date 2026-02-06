import { IMediaAssetsService } from './assets/contracts/mediaAssets.js';
import { MediaAssetsService } from './assets/services/mediaAssetsService.js';
import { IMediaUploadsService } from './uploads/contracts/mediaUploads.js';
import { MediaUploadsService } from './uploads/services/mediaUploadsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerMediaDomainServices(services: ServiceCollection): void {
	services.set(IMediaUploadsService, new SyncDescriptor(MediaUploadsService));
	services.set(IMediaAssetsService, new SyncDescriptor(MediaAssetsService));
}
