export class HadronHttpApi {
  /** @param {Configuration} [config={}] */
  constructor(config = {}) {
    this.config = config ?? {};
    this.Auth = {
      SignIn:
        /** @type {function(import('./api.types').Paths.AuthSignIn.QueryParameters & import('./api.types').Paths.AuthSignIn.PathParameters):Promise<import('./api.types').Paths.AuthSignIn.Responses.$200>} */
        (this.#Auth_SignIn.bind(this)),
      Refresh:
        /** @type {function(import('./api.types').Paths.AuthRefresh.QueryParameters & import('./api.types').Paths.AuthRefresh.PathParameters):Promise<import('./api.types').Paths.AuthRefresh.Responses.$200>} */
        (this.#Auth_Refresh.bind(this)),
    };
    this.Projects = {
      GetAll:
        /** @type {function():Promise<import('./api.types').Paths.ProjectsGetAll.Responses.$200>} */
        (this.#Projects_GetAll.bind(this)),
      Create:
        /** @type {function(import('./api.types').Paths.ProjectsCreate.RequestBody | void):Promise<import('./api.types').Paths.ProjectsCreate.Responses.$200>} */
        (this.#Projects_Create.bind(this)),
      Delete:
        /** @type {function(import('./api.types').Paths.ProjectsDelete.PathParameters):Promise} */
        (this.#Projects_Delete.bind(this)),
      Builds: {
        Create:
          /** @type {function(import('./api.types').Paths.ProjectsBuildsCreate.PathParameters & import('./api.types').Paths.ProjectsBuildsCreate.RequestBody):Promise<import('./api.types').Paths.ProjectsBuildsCreate.Responses.$200>} */
          (this.#Projects_Builds_Create.bind(this)),
        GetBuildInfo:
          /** @type {function(import('./api.types').Paths.ProjectsBuildsGetBuildInfo.PathParameters):Promise<import('./api.types').Paths.ProjectsBuildsGetBuildInfo.Responses.$200>} */
          (this.#Projects_Builds_GetBuildInfo.bind(this)),
        GenerateUniqueBuildId:
          /** @type {function(import('./api.types').Paths.ProjectsBuildsGenerateUniqueBuildId.QueryParameters | void):Promise<import('./api.types').Paths.ProjectsBuildsGenerateUniqueBuildId.Responses.$200>} */
          (this.#Projects_Builds_GenerateUniqueBuildId.bind(this)),
        GetBuildCurrentVersion:
          /** @type {function(import('./api.types').Paths.ProjectsBuildsGetBuildCurrentVersion.PathParameters):Promise<import('./api.types').Paths.ProjectsBuildsGetBuildCurrentVersion.Responses.$200>} */
          (this.#Projects_Builds_GetBuildCurrentVersion.bind(this)),
      },
      Branch: {
        Commits: {
          GetAll:
            /** @type {function(import('./api.types').Paths.ProjectsBranchCommitsGetAll.PathParameters):Promise<import('./api.types').Paths.ProjectsBranchCommitsGetAll.Responses.$200>} */
            (this.#Projects_Branch_Commits_GetAll.bind(this)),
          GetDetailsOfLatest:
            /** @type {function(import('./api.types').Paths.ProjectsBranchCommitsGetDetailsOfLatest.PathParameters):Promise<import('./api.types').Paths.ProjectsBranchCommitsGetDetailsOfLatest.Responses.$200>} */
            (this.#Projects_Branch_Commits_GetDetailsOfLatest.bind(this)),
          GetDetails:
            /** @type {function(import('./api.types').Paths.ProjectsBranchCommitsGetDetails.PathParameters):Promise<import('./api.types').Paths.ProjectsBranchCommitsGetDetails.Responses.$200>} */
            (this.#Projects_Branch_Commits_GetDetails.bind(this)),
          Create:
            /** @type {function(import('./api.types').Paths.ProjectsBranchCommitsCreate.PathParameters & import('./api.types').Paths.ProjectsBranchCommitsCreate.RequestBody):Promise<import('./api.types').Paths.ProjectsBranchCommitsCreate.Responses.$200>} */
            (this.#Projects_Branch_Commits_Create.bind(this)),
        },
        GetPutPolicy:
          /** @type {function(import('./api.types').Paths.ProjectsBranchGetPutPolicy.PathParameters & import('./api.types').Paths.ProjectsBranchGetPutPolicy.RequestBody):Promise<import('./api.types').Paths.ProjectsBranchGetPutPolicy.Responses.$200>} */
          (this.#Projects_Branch_GetPutPolicy.bind(this)),
        GetReadPolicy:
          /** @type {function(import('./api.types').Paths.ProjectsBranchGetReadPolicy.PathParameters & import('./api.types').Paths.ProjectsBranchGetReadPolicy.RequestBody):Promise<import('./api.types').Paths.ProjectsBranchGetReadPolicy.Responses.$200>} */
          (this.#Projects_Branch_GetReadPolicy.bind(this)),
      },
    };
    this.ImagesServices = {
      Unsplash: {
        Search:
          /** @type {function(import('./api.types').Paths.ImagesServicesUnsplashSearch.QueryParameters):Promise<import('./api.types').Paths.ImagesServicesUnsplashSearch.Responses.$200>} */
          (this.#ImagesServices_Unsplash_Search.bind(this)),
        DownloadAttribution:
          /** @type {function(import('./api.types').Paths.ImagesServicesUnsplashDownloadAttribution.RequestBody | void):Promise} */
          (this.#ImagesServices_Unsplash_DownloadAttribution.bind(this)),
      },
    };
    this.Feedback = {
      Send:
        /** @type {function(import('./api.types').Paths.FeedbackSend.RequestBody | void):Promise} */
        (this.#Feedback_Send.bind(this)),
    };
  }
  /** @type {Configuration} */
  #config = null;
  set config(config) {
    this.#config = config;
    if (config?.credentials) {
      _aws.accessKeyId = config.credentials.AccessKeyId;
      _aws.sessionExpiration = new Date(config.credentials.Expiration);
      _aws.secretKey = config.credentials.SecretKey;
      _aws.sessionToken = config.credentials.SessionToken;
      _aws.region = config.region;
    }
  }
  get config() {
    return this.#config;
  }
  async #Auth_SignIn(params) {
    return fetch('/auth/signin/{provider}', {
      ...this.config,
      method: 'get',
      signed: false,
      params,
      paramsLocation: {
        path: ['provider'],
        query: ['token', 'code', 'username'],
      },
    });
  }
  async #Auth_Refresh(params) {
    return fetch('/auth/refresh/{provider}', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {path: ['provider'], query: ['token']},
    });
  }
  async #Projects_GetAll() {
    return fetch('/projects', {
      ...this.config,
      method: 'get',
      signed: true,
    });
  }
  async #Projects_Create(params) {
    return fetch('/projects', {
      ...this.config,
      method: 'post',
      signed: true,
      params,
      paramsLocation: {body: ['name']},
    });
  }
  async #Projects_Delete(params) {
    return fetch('/projects/{projectId}', {
      ...this.config,
      method: 'delete',
      signed: true,
      params,
      paramsLocation: {path: ['projectId']},
    });
  }
  async #Projects_Builds_Create(params) {
    return fetch('/projects/{projectId}/{buildId}', {
      ...this.config,
      method: 'post',
      signed: true,
      params,
      paramsLocation: {
        path: ['projectId', 'buildId'],
        body: [
          'branchname',
          'addServiceWorker',
          'bundle',
          'cssMinify',
          'htmlMinify',
          'jsCompile',
          'jsMinify',
        ],
      },
    });
  }
  async #Projects_Branch_Commits_GetAll(params) {
    return fetch('/projects/{projectId}/{branchname}/commits', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {path: ['projectId', 'branchname']},
    });
  }
  async #Projects_Branch_GetPutPolicy(params) {
    return fetch('/projects/{projectId}/{branchname}/put-policy', {
      ...this.config,
      method: 'post',
      signed: true,
      params,
      paramsLocation: {path: ['projectId', 'branchname'], body: ['paths']},
    });
  }
  async #Projects_Branch_GetReadPolicy(params) {
    return fetch('/projects/{projectId}/{branchname}/read-policy', {
      ...this.config,
      method: 'post',
      signed: true,
      params,
      paramsLocation: {path: ['projectId', 'branchname'], body: ['files']},
    });
  }
  async #Projects_Branch_Commits_GetDetailsOfLatest(params) {
    return fetch('/projects/{projectId}/{branchname}/commits/current', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {path: ['projectId', 'branchname']},
    });
  }
  async #Projects_Branch_Commits_GetDetails(params) {
    return fetch('/projects/{projectId}/{branchname}/{commitId}', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {path: ['projectId', 'branchname', 'commitId']},
    });
  }
  async #Projects_Branch_Commits_Create(params) {
    return fetch('/projects/{projectId}/{branchname}/{commitId}', {
      ...this.config,
      method: 'post',
      signed: true,
      params,
      paramsLocation: {
        path: ['projectId', 'branchname', 'commitId'],
        body: ['fromCommitId', 'message', 'updates'],
      },
    });
  }
  async #Projects_Builds_GetBuildInfo(params) {
    return fetch('/builds/{buildId}', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {path: ['buildId']},
    });
  }
  async #Projects_Builds_GenerateUniqueBuildId(params) {
    return fetch('/builds/generate-build-id', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {query: ['buildId']},
    });
  }
  async #Projects_Builds_GetBuildCurrentVersion(params) {
    return fetch('/builds/{buildId}/current-version', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {path: ['buildId']},
    });
  }
  async #ImagesServices_Unsplash_Search(params) {
    return fetch('/images-services/unsplash', {
      ...this.config,
      method: 'get',
      signed: true,
      params,
      paramsLocation: {query: ['search', 'page', 'perPage', 'filters']},
    });
  }
  async #ImagesServices_Unsplash_DownloadAttribution(params) {
    return fetch('/images-services/unsplash/download-attribution', {
      ...this.config,
      method: 'post',
      signed: true,
      params,
      paramsLocation: {body: ['location']},
    });
  }
  async #Feedback_Send(params) {
    return fetch('/feedback', {
      ...this.config,
      method: 'post',
      signed: true,
      params,
      paramsLocation: {body: ['text', 'sentiment']},
    });
  }
}

import {AWSSV4Fetch} from './aws-sv4-fetch.js';
// @ts-ignore
import env from '../../../env.json' assert {type: 'json'};
const {apiUrl, apiVersion} = env;

const _aws = new AWSSV4Fetch({
  apiEndpoint: apiUrl,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
    'user-api-version': apiVersion,
  },
});

/**
 * @param {string} path
 * @param {Object} p1
 * @param {'get' | 'put' | 'post' | 'delete' | 'patch'} [p1.method]
 * @param {Boolean} [p1.signed]
 * @param {Object} [p1.params]
 * @param {ParamsLocation} [p1.paramsLocation]
 * @returns {Promise<Object | string>}
 */
async function fetch(path, {method, signed, params = {}, paramsLocation = {}}) {
  const pathParams = filterParams(params, paramsLocation.path);
  const resolvedPath = computePath(path, pathParams);
  if (resolvedPath.match(/\{[^}]+\}/)) {
    throw new Error('InvalidPath');
  }
  const body = stringifyParams(filterParams(params, paramsLocation.body)) ?? '';
  const headers = {...filterParams(params, paramsLocation.header)};
  return _aws.fetch(resolvedPath, {
    method,
    body,
    headers,
    params,
    signed,
  });
}

/**
 * @param {string} pathWithParams
 * @param {Object<string, string>} pathParams
 * @returns {string}
 */
function computePath(pathWithParams, pathParams) {
  var path = pathWithParams;
  Object.entries(pathParams).forEach(([paramName, paramValue]) => {
    path = path.replace(new RegExp(`{${paramName}}`), paramValue);
  });
  return path;
}

/**
 * @param {Object<string, string>} params
 * @param {string[]} [whiteList]
 * @returns {Object}
 */
function filterParams(params, whiteList) {
  const res = {};
  whiteList?.forEach(key => {
    const value = params[key];
    if (value != null) {
      res[key] = value;
    }
  });
  return res;
}

/**
 * @param {Object<string, string>} params
 * @returns {string?}
 */
function stringifyParams(params) {
  if (params && Object.keys(params).length > 0) {
    return JSON.stringify(params);
  }
}

/**
 * @typedef {{
 *   path?: string[],
 *   query?: string[],
 *   body?: string[],
 *   header?: string[],
 * }} ParamsLocation Param list grouped by location in the request
 */

/**
 * @typedef {{
 *   credentials?: import('../types').Credentials,
 *   region?: string,
 *   fetchMethod?: function,
 * }} Configuration
 */
