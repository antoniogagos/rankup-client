import { ITrustAppealsService } from './appeals/contracts/trustAppeals.js';
import { TrustAppealsService } from './appeals/services/trustAppealsService.js';
import { ITrustEnforcementService } from './enforcement/contracts/trustEnforcement.js';
import { TrustEnforcementService } from './enforcement/services/trustEnforcementService.js';
import { ITrustReportsService } from './reports/contracts/trustReports.js';
import { TrustReportsService } from './reports/services/trustReportsService.js';
import { ITrustPoliciesService } from './shared/contracts/trustPolicies.js';
import { TrustPoliciesService } from './shared/services/trustPoliciesService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerTrustSafetyDomainServices(services: ServiceCollection): void {
	services.set(ITrustPoliciesService, new SyncDescriptor(TrustPoliciesService));
	services.set(ITrustReportsService, new SyncDescriptor(TrustReportsService));
	services.set(ITrustEnforcementService, new SyncDescriptor(TrustEnforcementService));
	services.set(ITrustAppealsService, new SyncDescriptor(TrustAppealsService));
}
