// somebody also did https://github.com/mhart/aws4fetch/tree/master/dist
// which does retries and some other checks

/** @typedef {{[key: string]: string}} stringsObj */
/**
 * @typedef {Object} FetchParams
 * @property {string} [opts.method='GET']
 * @property {string} [opts.body]
 * @property {stringsObj} [opts.params]
 * @property {stringsObj} [opts.headers]
 * @property {Boolean} [opts.signed]
 * @property {RequestMode} [opts.mode='cors']
 * @property {RequestCredentials} [opts.credentials]
 * @property {'json'|'text'|'blob'} [opts.decodeResponse='json'] If not defined or false, it will return the Response object
 */

export class AWSSV4Fetch {
  /**
   * If region, accessKeyId, secretKey, or sessionToken is not passed, a non signed request will be
   * performed.
   * @param {Object} params
   * @param {string}  params.apiEndpoint Api endpoint
   * @param {string} [params.region] AWS region
   * @param {string} [params.accessKeyId] User session AccessKeyId
   * @param {string} [params.secretKey] User session secretKey
   * @param {string} [params.sessionToken] User session token
   * @param {Date}   [params.sessionExpiration] Session is valid up to this date.
   * @param {stringsObj} [params.headers = {}]
   */
  constructor(params) {
    this.region = params.region;
    this.accessKeyId = params.accessKeyId;
    this.secretKey = params.secretKey;
    this.sessionToken = params.sessionToken;
    this.sessionExpiration = params.sessionExpiration;
    this.apiEndpoint = params.apiEndpoint;
    this.headers = params.headers ?? {};
  }

  get #canDoSignedRequest() {
    return Boolean(
      this.region &&
        this.accessKeyId &&
        this.secretKey &&
        this.sessionToken &&
        !this.#isSessionExpired,
    );
  }

  get #isSessionExpired() {
    return !this.sessionExpiration || Date.now() > this.sessionExpiration.getTime();
  }

  /**
   * @param {string} path
   * @param {FetchParams} [opts]
   * @returns {Promise<Response|string|Blob|Object>} Depends on the decodeResponse param
   */
  async fetch(path, opts = {}) {
    /** @type {FetchParams} */
    const _opts = {
      method: 'GET',
      mode: 'cors',
      decodeResponse: 'json',
      signed: false,
      ...opts,
    };
    if (_opts.signed && !this.#canDoSignedRequest) {
      throw new Error('Forbidden');
    }
    const response = _opts.signed
      ? await this.#privateFetch(path, _opts)
      : await this.#publicFetch(path, _opts);
    return _opts.decodeResponse ? response[_opts.decodeResponse]() : response;
  }

  /**
   * @param {string} path
   * @param {FetchParams} [opts]
   * @returns {Promise<Response>} Depends on the decodeResponse param
   */
  async #publicFetch(path, opts = {}) {
    /** @type {FetchParams} */
    const _opts = {
      method: 'GET',
      mode: 'cors',
      decodeResponse: 'json',
      ...opts,
    };
    let url = this.#joinPath(this.apiEndpoint, path);
    if (_opts.params && Object.keys(_opts.params).length) {
      url += `?${new URLSearchParams(_opts.params).toString()}`;
    }
    const myheaders = { ...this.headers, ..._opts.headers };
    /** @type {FetchParams} */
    const fetchParams = {
      method: _opts.method,
      headers: myheaders,
      mode: _opts.mode,
    };
    if (_opts.body) {
      fetchParams.body = _opts.body ? JSON.stringify(_opts.body) : '';
    }
    return fetch(url, fetchParams);
  }

  /**
   * @param {string} path
   * @param {FetchParams} [opts]
   * @returns {Promise<Response>} Depends on the decodeResponse param
   */
  async #privateFetch(path, opts = {}) {
    const [_, pathWithoutParams, pathParamsStr] = path.match(/([^?]*)(?:\?(.*))?/) || [];
    const _opts = opts;
    if (pathParamsStr) {
      const pathParams = new URLSearchParams(pathParamsStr);
      for (const [name, value] of pathParams.entries()) {
        _opts.params[name] = value;
      }
    }
    const signedHeaders = await this.#generateSignedHeaders({
      path: pathWithoutParams,
      method: _opts.method,
      params: _opts.params,
      headers: _opts.headers,
      body: _opts.body,
    });
    let url = this.#joinPath(this.apiEndpoint, path);
    if (_opts.params && Object.keys(_opts.params).length) {
      url += `?${new URLSearchParams(_opts.params).toString()}`;
    }
    /** @type {FetchParams} */
    const fetchParams = {
      method: _opts.method,
      // headers: new Headers(signedHeaders),
      headers: signedHeaders,
      mode: _opts.mode,
      credentials: _opts.credentials,
    };
    // If body is received it will always be included in the signed headers
    // so we have to send it event for GET requests
    if (_opts.body) {
      fetchParams.body = typeof _opts.body === 'string' ? _opts.body : JSON.stringify(_opts.body);
    }
    return fetch(url, fetchParams);
  }

  /** @param {string} url */
  #getOriginFromURL(url) {
    return /(^https?:\/\/[^/]+)/g.exec(url)[1];
  }

  /** @param {string} url */
  #getPathFromURL(url) {
    return (/(^https?:\/\/[^/]+)\/(.*)/g.exec(url) || [])[2] || '';
  }

  #generateDateString() {
    return new Date()
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z')
      .replace(/[:-]|\.\d{3}/g, '');
  }

  /**
   * @param {Object} param0
   * @param {string} param0.path
   * @param {string} [param0.method='GET']
   * @param {stringsObj} [param0.params]
   * @param {stringsObj} [param0.headers]
   * @param {string} [param0.body='']
   * @returns {Promise<stringsObj>}
   */
  async #generateSignedHeaders({ path, method = 'GET', params = {}, headers = {}, body = '' }) {
    /** @type {stringsObj} */
    const myheaders = { ...this.headers, ...headers };
    /** @type {string} */
    let _body = body;
    if (!_body) {
      delete myheaders['content-type'];
    } else if (typeof _body === 'object') {
      _body = JSON.stringify(_body);
    }
    const datetime = this.#generateDateString();
    myheaders['x-amz-date'] = datetime;
    const origin = this.#getOriginFromURL(this.apiEndpoint);
    const pathFromEndpoint = this.#getPathFromURL(this.apiEndpoint);
    const _path = `/${this.#joinPath(pathFromEndpoint, path)}`;
    const parser = document.createElement('a');
    parser.href = origin;
    myheaders.host = parser.hostname;
    const _method = method.toUpperCase();
    const canonicalRequest = await this.#buildCanonicalRequest(
      _method,
      _path,
      params,
      myheaders,
      _body,
    );
    const hashedCanonicalRequest = await this.#hashCanonicalRequest(canonicalRequest);
    const credentialScope = this.#buildCredentialScope(datetime, this.region, 'execute-api');
    const stringToSign = this.#buildStringToSign(datetime, credentialScope, hashedCanonicalRequest);
    const signingKey = await this.#calculateSigningKey(
      this.secretKey,
      datetime,
      this.region,
      'execute-api',
    );
    const signature = this.#buff2hex(await this.#calculateSignature(signingKey, stringToSign));
    myheaders.Authorization = this.#buildAuthorizationHeader(
      this.accessKeyId,
      credentialScope,
      myheaders,
      signature,
    );
    if (this.sessionToken /*  !== undefined && this.sessionToken !== '' */) {
      myheaders['x-amz-security-token'] = this.sessionToken;
    }
    delete myheaders.host;
    // Need to re-attach content-type if it is not specified at this point
    if (myheaders['content-type'] == null) {
      if (headers['content-type']) {
        myheaders['content-type'] = headers['content-type'];
      } else if (this.headers['content-type']) {
        myheaders['content-type'] = this.headers['content-type'];
      }
    }
    return myheaders;
  }

  /** @param {...string} paths */
  #joinPath(...paths) {
    const parts = paths
      .join('/')
      .split('/')
      .filter(x => !!x);
    if (parts[0].match(/http/)) {
      parts.splice(1, 0, '');
    }
    return parts.join('/');
  }

  /**
   * @param {string} method
   * @param {string} path
   * @param {stringsObj} queryParams
   * @param {stringsObj} headers
   * @param {string} payload
   * @returns
   */
  async #buildCanonicalRequest(method, path, queryParams, headers, payload) {
    return (
      method +
      '\n' +
      this.#buildCanonicalUri(path) +
      '\n' +
      this.#buildCanonicalQueryString(queryParams) +
      '\n' +
      this.#buildCanonicalHeaders(headers) +
      '\n' +
      this.#buildCanonicalSignedHeaders(headers) +
      '\n' +
      (await this.#hashSha256(payload))
    );
  }

  /**
   * @param {stringsObj} queryParams
   * @returns {string}
   */
  #buildCanonicalQueryString(queryParams) {
    if (Object.keys(queryParams).length < 1) {
      return '';
    }
    const sortedQueryParams = [];
    for (const property of Object.keys(queryParams)) {
      if (Object.prototype.hasOwnProperty.call(queryParams, property)) {
        sortedQueryParams.push(property);
      }
    }
    sortedQueryParams.sort();
    let canonicalQueryString = '';
    for (let i = 0; i < sortedQueryParams.length; i += 1) {
      canonicalQueryString +=
        sortedQueryParams[i] + '=' + encodeURIComponent(queryParams[sortedQueryParams[i]]) + '&';
    }
    return canonicalQueryString.substring(0, canonicalQueryString.length - 1);
  }

  /**
   * @param {stringsObj} headers
   * @returns {string}
   */
  #buildCanonicalHeaders(headers) {
    let canonicalHeaders = '';
    const sortedKeys = [];
    // for (let property in headers) {
    //   if (headers.hasOwnProperty(property)) {
    //     sortedKeys.push(property);
    //   }
    // }
    for (const property of Object.keys(headers)) {
      if (Object.prototype.hasOwnProperty.call(headers, property)) {
        sortedKeys.push(property);
      }
    }
    sortedKeys.sort();
    for (let i = 0; i < sortedKeys.length; i += 1) {
      canonicalHeaders += sortedKeys[i].toLowerCase() + ':' + headers[sortedKeys[i]] + '\n';
    }
    return canonicalHeaders;
  }

  /**
   * @param {string} request
   * @returns {Promise<string>}
   */
  async #hashCanonicalRequest(request) {
    return this.#hashSha256(request);
  }

  /** @param {string} uri */
  #buildCanonicalUri(uri) {
    return encodeURI(uri);
  }

  /**
   * @param {stringsObj} headers
   * @returns {string}
   */
  #buildCanonicalSignedHeaders(headers) {
    const sortedKeys = [];
    // for (let property in headers) {
    //   if (headers.hasOwnProperty(property)) {
    //     sortedKeys.push(property.toLowerCase());
    //   }
    // }
    for (const property of Object.keys(headers)) {
      if (Object.prototype.hasOwnProperty.call(headers, property)) {
        sortedKeys.push(property.toLocaleLowerCase());
      }
    }
    return sortedKeys.sort().join(';');
  }

  /**
   * @param {string} datetime
   * @param {string} credentialScope
   * @param {string} hashedCanonicalRequest
   * @returns
   */
  #buildStringToSign(datetime, credentialScope, hashedCanonicalRequest) {
    return 'AWS4-HMAC-SHA256\n' + datetime + '\n' + credentialScope + '\n' + hashedCanonicalRequest;
  }

  /**
   * @param {string} datetime
   * @param {string} region
   * @param {string} service
   * @returns {string}
   */
  #buildCredentialScope(datetime, region, service) {
    return `${datetime.substr(0, 8)}/${region}/${service}/aws4_request`;
  }

  /**
   * @param {string} secretKey
   * @param {string} datetime
   * @param {string} region
   * @param {string} service
   * @returns {Promise<ArrayBuffer>}
   */
  async #calculateSigningKey(secretKey, datetime, region, service) {
    const a = await this.#hmac('AWS4' + secretKey, datetime.substr(0, 8));
    const b = await this.#hmac(a, region);
    const c = await this.#hmac(b, service);
    return this.#hmac(c, 'aws4_request');
  }

  /**
   * @param {ArrayBuffer} key
   * @param {string} stringToSign
   * @returns {Promise<ArrayBuffer>}
   */
  async #calculateSignature(key, stringToSign) {
    return this.#hmac(key, stringToSign);
  }

  /**
   *
   * @param {string} accessKeyId
   * @param {string} credentialScope
   * @param {stringsObj} headers
   * @param {string} signature
   * @returns {string}
   */
  #buildAuthorizationHeader(accessKeyId, credentialScope, headers, signature) {
    const canonicalHeaders = this.#buildCanonicalSignedHeaders(headers);
    return (
      'AWS4-HMAC-SHA256' +
      ' Credential=' +
      accessKeyId +
      '/' +
      credentialScope +
      ', SignedHeaders=' +
      canonicalHeaders +
      ', Signature=' +
      signature
    );
  }

  /**
   * @param {string} value
   * @returns {Promise<string>} hex sha256
   */
  async #hashSha256(value) {
    const msgBuffer = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return this.#buff2hex(hashBuffer);
  }

  /**
   * @param {string | ArrayBuffer} key
   * @param {string} message
   * @returns {Promise<ArrayBuffer>}
   */
  async #hmac(key, message) {
    const k = typeof key === 'string' ? this.#getUtf8Bytes(key) : key;
    const m = typeof message === 'string' ? this.#getUtf8Bytes(message) : message;
    const c = await crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' }, true, [
      'sign',
    ]);
    return crypto.subtle.sign('HMAC', c, m);
  }

  /**
   * @param {ArrayBuffer} buffer
   * @returns {string}
   */
  #buff2hex(buffer) {
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  /**
   * @param {string} str
   * @returns {ArrayBuffer}
   */
  #getUtf8Bytes(str) {
    return new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0)));
  }
}
