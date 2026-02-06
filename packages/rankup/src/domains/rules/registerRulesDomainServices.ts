import { IGameModesService } from './gameModes/contracts/gameModes.js';
import { GameModesService } from './gameModes/services/gameModesService.js';
import { IRulesetsService } from './rulesets/contracts/rulesets.js';
import { RulesetsService } from './rulesets/services/rulesetsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerRulesDomainServices(services: ServiceCollection): void {
	services.set(IGameModesService, new SyncDescriptor(GameModesService));
	services.set(IRulesetsService, new SyncDescriptor(RulesetsService));
}
