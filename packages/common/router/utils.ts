export async function enterPageCallback(
	this: HTMLElement,
	containerSelector = '.router-container',
): Promise<boolean> {
	// the router only renders one element at a time so we have to wait a bit to animate out on all pages
	const container = this.shadowRoot!.querySelector(containerSelector) ?? this.shadowRoot!;
	const component = container.firstElementChild;
	if (component) {
		component.setAttribute('animation', 'exit');
		await new Promise(resolve => {
			setTimeout(resolve, 140);
		});
	}
	return true;
}
