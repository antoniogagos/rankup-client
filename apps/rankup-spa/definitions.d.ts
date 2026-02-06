declare module 'page/page.mjs' {
	export { default } from 'page';
}

declare module '*.css' {
	const stylesheet: CSSStyleSheet;
	export default stylesheet;
}
