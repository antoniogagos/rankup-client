import { __require as requireAmazonCognitoIdentity } from 'amazon-cognito-identity-js/dist/amazon-cognito-identity.min';

type CognitoIdentityBundle = Pick<
	typeof import('amazon-cognito-identity-js'),
	'AuthenticationDetails' | 'CognitoIdToken' | 'CognitoRefreshToken' | 'CognitoUser' | 'CognitoUserAttribute' | 'CognitoUserPool'
>;

type BrowserGlobal = {
	AmazonCognitoIdentity?: unknown;
};

const AmazonCognitoIdentity = resolveAmazonCognitoIdentity();

export const {
	AuthenticationDetails,
	CognitoIdToken,
	CognitoRefreshToken,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
} = AmazonCognitoIdentity;

function resolveAmazonCognitoIdentity(): CognitoIdentityBundle {
	const moduleBundle = requireAmazonCognitoIdentity();
	if (isCognitoIdentityBundle(moduleBundle)) {
		return moduleBundle;
	}

	const browserBundle = getBrowserGlobal().AmazonCognitoIdentity;
	if (isCognitoIdentityBundle(browserBundle)) {
		return browserBundle;
	}

	throw new Error('Failed to load Amazon Cognito browser bundle');
}

function getBrowserGlobal(): BrowserGlobal {
	if (typeof globalThis !== 'undefined') {
		return globalThis as BrowserGlobal;
	}
	if (typeof self !== 'undefined') {
		return self as BrowserGlobal;
	}
	if (typeof window !== 'undefined') {
		return window as BrowserGlobal;
	}
	return {};
}

function isCognitoIdentityBundle(value: unknown): value is CognitoIdentityBundle {
	if (!value || typeof value !== 'object') {
		return false;
	}
	const candidate = value as Partial<Record<keyof CognitoIdentityBundle, unknown>>;
	return (
		typeof candidate.AuthenticationDetails === 'function' &&
		typeof candidate.CognitoIdToken === 'function' &&
		typeof candidate.CognitoRefreshToken === 'function' &&
		typeof candidate.CognitoUser === 'function' &&
		typeof candidate.CognitoUserAttribute === 'function' &&
		typeof candidate.CognitoUserPool === 'function'
	);
}
