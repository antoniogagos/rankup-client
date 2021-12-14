/** @typedef {import('../../types').ISessionProvider} ISessionProvider */

// @ts-ignore
// import env from '../../../../env.json' assert { type: 'json' };
// const { googleClientId: GOOGLE_CLIENT_ID } = env;

/** @type {string | null} */
let GOOGLE_CLIENT_ID = null;

/** @type {Promise<void>} */
let _apiLoadReq = null;

/** @type {Promise<void>} */
let _authApiReq = null;

/** @type {Promise<void>} */
let _initAuthApiReq = null;

/** @type {gapi.auth2.GoogleAuth} */
let _GoogleAuth = null;

/** @type {gapi.auth2.GoogleUser} */
let _user = null;

/** @implements {ISessionProvider}  */
export class GoogleSessionProvider {
  /** @param {string} googleClientId */
  constructor(googleClientId) {
    if (GOOGLE_CLIENT_ID && googleClientId !== GOOGLE_CLIENT_ID) {
      throw new Error('GoogleSessionProvider already initialized');
    }
    if (!googleClientId) {
      throw new Error('GoogleSessionProvider client id not provided');
    }
    GOOGLE_CLIENT_ID = googleClientId;
  }

  isOAuthProvider = true;

  async isLogged() {
    return isLogged();
  }

  async logIn() {
    return logIn();
  }

  async logOut() {
    return logOut();
  }

  async refresh() {
    return refresh();
  }
}

function loadGoogleApi() {
  _apiLoadReq ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://apis.google.com/js/api.js');
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.append(script);
  });
  return _apiLoadReq;
}

async function loadGoogleAuthApi() {
  await loadGoogleApi();
  _authApiReq ??= new Promise((resolve, reject) => {
    gapi.load('client:auth2', {
      callback: () => resolve(),
      onerror: () => reject(),
    });
  });
  return _authApiReq;
}

/** @param {boolean} isSignedIn */
function onSigninStatusChanged(isSignedIn) {
  if (!isSignedIn) {
    _user = null;
  }
}

/** @param {gapi.auth2.GoogleUser} user */
function onUserChanged(user) {
  _user = user;
}

async function initAuthApi() {
  if (!_GoogleAuth) {
    _initAuthApiReq ??= new Promise((resolve, reject) => {
      loadGoogleAuthApi()
        .then(() =>
          gapi.client.init({
            clientId: GOOGLE_CLIENT_ID,
            scope: 'profile',
            // apiKey: '',
          }),
        )
        .then(() => {
          _GoogleAuth = gapi.auth2.getAuthInstance();
          _GoogleAuth?.isSignedIn.listen(onSigninStatusChanged);
          _GoogleAuth?.currentUser.listen(onUserChanged);
          _user = _GoogleAuth?.currentUser.get();
          resolve();
        })
        .catch(err => {
          reject(err);
        })
        .finally(() => {
          _initAuthApiReq = null;
        });
    });
  }
  return _initAuthApiReq;
}

async function isLogged() {
  try {
    if (!_user) {
      await initAuthApi();
    }
    return _user?.isSignedIn();
  } catch {
    return false;
  }
}

/**
 * @param {gapi.auth2.GoogleUser} user
 * @returns {import('../../types').OauthLoggedUser}
 */
function getOauthLoggedUserDataFromGoogleLoggedUser(user) {
  const profile = _user.getBasicProfile();
  return {
    tokenId: user.getAuthResponse().id_token,
    pictureUrl: profile.getImageUrl(),
    email: profile.getEmail(),
    name: profile.getName(),
  };
}

/** @returns {Promise<import('../../types').OauthLoggedUser>} */
async function logIn() {
  // console.debug('sesion-google::init');
  try {
    await initAuthApi();
  } catch (/** @type {any} */ err) {
    let msg = "We can't use Google login in this environment. ";
    if (err?.error === 'idpiframe_initialization_failed') {
      if (err.details?.startsWith('Cookies')) {
        msg += err.details;
      }
    }
    window.alert(msg);
    throw new Error('InitError');
  }
  // console.debug('sesion-google::init-done');
  if (_user?.isSignedIn()) {
    // already signed-in
    await _user.reloadAuthResponse();
  } else {
    _user = await _GoogleAuth.signIn({
      prompt: 'select_account',
      ux_mode: 'redirect',
      redirect_uri: `${window.location.origin}/login?googleAuth=1`,
    });
  }
  return getOauthLoggedUserDataFromGoogleLoggedUser(_user);
}

export async function logOut() {
  await initAuthApi();
  if (_GoogleAuth.isSignedIn.get()) {
    _GoogleAuth.signOut();
  }
}

/** @returns {Promise<import('../../types').OauthLoggedUser>} */
async function refresh() {
  if (_user?.isSignedIn()) {
    await _user.reloadAuthResponse();
    return getOauthLoggedUserDataFromGoogleLoggedUser(_user);
  }
  return logIn();
}
