import 'amazon-cognito-identity-js/dist/amazon-cognito-identity.min';

declare global {
  interface Window {
    AmazonCognitoIdentity: any;
  }
}

const { AmazonCognitoIdentity } = window;

export const { AuthenticationDetails } = AmazonCognitoIdentity;
export const { AuthenticationHelper } = AmazonCognitoIdentity;
export const { CognitoAccessToken } = AmazonCognitoIdentity;
export const { CognitoIdToken } = AmazonCognitoIdentity;
export const { CognitoRefreshToken } = AmazonCognitoIdentity;
export const { CognitoUser } = AmazonCognitoIdentity;
export const { CognitoUserAttribute } = AmazonCognitoIdentity;
export const { CognitoUserPool } = AmazonCognitoIdentity;
export const { CognitoUserSession } = AmazonCognitoIdentity;
export const { CookieStorage } = AmazonCognitoIdentity;
export const { DateHelper } = AmazonCognitoIdentity;
export const { WordArray } = AmazonCognitoIdentity;
export const { appendToCognitoUserAgent } = AmazonCognitoIdentity;
