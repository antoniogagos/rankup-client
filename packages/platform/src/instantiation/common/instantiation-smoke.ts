import { createDecorator } from './decorators.js';
import { InstantiationService } from './instantiationService.js';
import { ServiceCollection } from './serviceCollection.js';

interface IExampleService {
	readonly name: string;
}

const IExampleService = createDecorator<IExampleService>('exampleService');

class ExampleConsumer {
	public constructor(@IExampleService private readonly service: IExampleService) {}

	public getName(): string {
		return this.service.name;
	}
}

export function runInstantiationSmoke(): string {
	const services = new ServiceCollection();
	services.set(IExampleService, { name: 'example' });

	const instantiationService = new InstantiationService(services);
	const consumer = instantiationService.createInstance(ExampleConsumer);

	return consumer.getName();
}
