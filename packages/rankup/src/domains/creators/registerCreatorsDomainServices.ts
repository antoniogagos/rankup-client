import { ICreatorsCatalogService } from './catalog/contracts/creatorsCatalog.js';
import { CreatorsCatalogService } from './catalog/services/creatorsCatalogService.js';
import { ICreatorsDirectoryService } from './directory/contracts/creatorsDirectory.js';
import { CreatorsDirectoryService } from './directory/services/creatorsDirectoryService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerCreatorsDomainServices(services: ServiceCollection): void {
	services.set(ICreatorsDirectoryService, new SyncDescriptor(CreatorsDirectoryService));
	services.set(ICreatorsCatalogService, new SyncDescriptor(CreatorsCatalogService));
}
