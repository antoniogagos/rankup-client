export namespace Components {
  namespace Schemas {
    export interface AuthRefresh {
      region: string;
      iotEndpoint: string;
      identityId: string;
      credentials: Credentials;
    }
    export interface AuthSignIn {
      identityId: string;
      iotEndpoint: string;
      region: string;
      isNewUser: boolean;
      credentials: Credentials;
      user: User;
    }
    export interface Commit {
      commitId: string;
      commiter: User;
      message?: string;
      createdAt: string;
      snapshot: CommitSnapshot;
    }
    export type CommitGetPolicy = {
      path: string;
      version: string;
      url: string;
      latestVersionUrl: string;
      expiresAt: string;
    }[];
    export interface CommitPushPolicy {
      signedUrls: {
        path: string;
        url: string;
        expiresAt: string;
      }[];
      commitId: string;
    }
    export type CommitSnapshot = {
      version: string;
      lastModifiedAt: string;
      branch: string;
      path: string;
      hash: string;
    }[];
    export interface Credentials {
      AccessKeyId: string;
      SecretKey: string;
      SessionToken: string;
      Expiration: string;
    }
    export interface Image {
      color?: string;
      height: number;
      width: number;
      id?: string;
      username?: string;
      urls: {
        regular: string;
        small?: string;
        thumb?: string;
        downloadAttribution?: string;
        referral?: string;
      };
    }
    export interface Project {
      projectId?: string;
      name: string;
      creatorId: string;
      ownerUsername: string;
      ownerId: string;
      ownerType: 'user' | 'organization';
      deleteScheduledAt?: string;
      updatedAt?: string;
      createdAt: string;
      isPublic: boolean;
      owner?: User;
      creator?: User;
      builds?: ProjectBuild[];
      branches?: {
        name: string;
        latestCommitId: string;
        createdAt: string;
        updatedAt: string;
        commits: Commit[];
      }[];
    }
    export interface ProjectBuild {
      buildId: string;
      projectId: string;
      createdBy: User;
      deletedBy?: User;
      buildInProgress?: {
        jobId?: string;
        startedAt: string;
        status: 'ack' | 'scheduled' | 'started';
      };
      currentVersion: number;
      versions: {
        id: number;
        createdBy: string;
        files: number;
        deletedBy?: string;
        deletedAt?: string;
      }[];
      deleteScheduledAt?: string;
    }
    export interface User {
      userId: string;
      name: string;
      username: string;
      type: 'organization' | 'user';
      usernameLowerCase: string;
      email: string;
      picture: string;
      country: string;
      emailSubscription?: {
        appUpdates?: boolean;
      };
      lastConnectionAt?: string;
      createdAt: string;
      updatedAt?: string;
    }
  }
}
export namespace Paths {
  namespace AuthRefresh {
    namespace Parameters {
      export type Provider = 'google' | 'credentials';
      export type Token = string;
    }
    export interface PathParameters {
      provider: Parameters.Provider;
    }
    export interface QueryParameters {
      token: Parameters.Token;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AuthRefresh;
    }
  }
  namespace AuthSignIn {
    namespace Parameters {
      export type Code = string;
      export type Provider = 'google' | 'credentials';
      export type Token = string;
      export type Username = string;
    }
    export interface PathParameters {
      provider: Parameters.Provider;
    }
    export interface QueryParameters {
      token: Parameters.Token;
      code?: Parameters.Code;
      username?: Parameters.Username;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AuthSignIn;
    }
  }
  namespace FeedbackSend {
    export interface RequestBody {
      text: string;
      sentiment?: 'good' | 'bad';
    }
  }
  namespace ImagesServicesUnsplashDownloadAttribution {
    export interface RequestBody {
      location: string;
    }
  }
  namespace ImagesServicesUnsplashSearch {
    namespace Parameters {
      export interface Filters {
        orientation?: 'landscape' | 'portrait' | 'squarish';
        collections?: string[];
      }
      export type Page = number;
      export type PerPage = number;
      export type Search = string;
    }
    export interface QueryParameters {
      search: Parameters.Search;
      page?: Parameters.Page;
      perPage?: Parameters.PerPage;
      filters?: Parameters.Filters;
    }
    namespace Responses {
      export interface $200 {
        total: number;
        totalPages: number;
        results: Components.Schemas.Image[];
      }
    }
  }
  namespace ProjectsBranchCommitsCreate {
    namespace Parameters {
      export type Branchname = string;
      export type CommitId = string;
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
      branchname: Parameters.Branchname;
      commitId: Parameters.CommitId;
    }
    export interface RequestBody {
      fromCommitId: string;
      message?: string;
      updates: {
        path: string;
        hash: string;
        isDeleted: boolean;
      }[];
    }
    namespace Responses {
      export interface $200 {
        commit?: Components.Schemas.Commit;
      }
    }
  }
  namespace ProjectsBranchCommitsGetAll {
    namespace Parameters {
      export type Branchname = string;
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
      branchname: Parameters.Branchname;
    }
    namespace Responses {
      export interface $200 {
        commits?: Components.Schemas.Commit[];
      }
    }
  }
  namespace ProjectsBranchCommitsGetDetails {
    namespace Parameters {
      export type Branchname = string;
      export type CommitId = string;
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
      branchname: Parameters.Branchname;
      commitId: Parameters.CommitId;
    }
    namespace Responses {
      export interface $200 {
        commit: Components.Schemas.Commit;
      }
    }
  }
  namespace ProjectsBranchCommitsGetDetailsOfLatest {
    namespace Parameters {
      export type Branchname = string;
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
      branchname: Parameters.Branchname;
    }
    namespace Responses {
      export interface $200 {
        commit: Components.Schemas.Commit;
      }
    }
  }
  namespace ProjectsBranchGetPutPolicy {
    namespace Parameters {
      export type Branchname = string;
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
      branchname: Parameters.Branchname;
    }
    export interface RequestBody {
      paths: string[];
    }
    namespace Responses {
      export interface $200 {
        policy: Components.Schemas.CommitPushPolicy;
      }
    }
  }
  namespace ProjectsBranchGetReadPolicy {
    namespace Parameters {
      export type Branchname = string;
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
      branchname: Parameters.Branchname;
    }
    export interface RequestBody {
      files: {
        path: string;
        branch: string;
        version?: string;
      }[];
    }
    namespace Responses {
      export interface $200 {
        policy: Components.Schemas.CommitGetPolicy;
      }
    }
  }
  namespace ProjectsBuildsCreate {
    namespace Parameters {
      export type BuildId = string;
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
      buildId: Parameters.BuildId;
    }
    export interface RequestBody {
      branchname: string;
      addServiceWorker?: boolean;
      bundle?: boolean;
      cssMinify?: boolean;
      htmlMinify?: boolean;
      jsCompile?: boolean;
      jsMinify?: boolean;
    }
    namespace Responses {
      export interface $200 {
        jobId: string;
        build: Components.Schemas.ProjectBuild;
        isNew: boolean;
      }
    }
  }
  namespace ProjectsBuildsGenerateUniqueBuildId {
    namespace Parameters {
      export type BuildId = string;
    }
    export interface QueryParameters {
      buildId: Parameters.BuildId;
    }
    namespace Responses {
      export interface $200 {
        buildId: string;
      }
    }
  }
  namespace ProjectsBuildsGetBuildCurrentVersion {
    namespace Parameters {
      export type BuildId = string;
    }
    export interface PathParameters {
      buildId: Parameters.BuildId;
    }
    namespace Responses {
      export interface $200 {
        currentVersion: number;
      }
    }
  }
  namespace ProjectsBuildsGetBuildInfo {
    namespace Parameters {
      export type BuildId = string;
    }
    export interface PathParameters {
      buildId: Parameters.BuildId;
    }
    namespace Responses {
      export interface $200 {
        build: Components.Schemas.ProjectBuild;
      }
    }
  }
  namespace ProjectsCreate {
    export interface RequestBody {
      name?: string;
    }
    namespace Responses {
      export interface $200 {
        project?: Components.Schemas.Project;
      }
    }
  }
  namespace ProjectsDelete {
    namespace Parameters {
      export type ProjectId = string;
    }
    export interface PathParameters {
      projectId: Parameters.ProjectId;
    }
  }
  namespace ProjectsGetAll {
    namespace Responses {
      export interface $200 {
        projects: Components.Schemas.Project[];
      }
    }
  }
}
