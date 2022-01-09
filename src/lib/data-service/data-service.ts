import type { ReactiveElement } from 'lit';
import env from '../../env.json' assert { type: 'json' };

const { ApiURL } = env;

type onUserChangedCallback = (loggedUser: any) => void;

type ParamsLocation = {
  path?: string[];
  query?: string[];
  body?: string[];
  header?: string[];
};

type strMap = { [key: string]: string };

export class DataService {
  host: ReactiveElement = null;

  onUserChanged: onUserChangedCallback | null = null;

  authorizationToken: string | null = null;

  userId: string | null = null;

  constructor(
    host: ReactiveElement,
    { onUserChanged }: { onUserChanged?: onUserChangedCallback } = {},
  ) {
    this.host = host;
    this.onUserChanged = onUserChanged;
    host.addController(this);
  }

  // TODO remove as controller
  hostConnected() {}

  hostDisconnected() {}

  async GetUser() {
    return this._fetch(`${ApiURL}/user/{userId}`, {
      method: 'GET',
      params: {
        userId: this.userId,
      },
      paramsLocation: {
        path: ['userId'],
      },
    });
  }

  async GetAllCompetitions() {
    return [
      {
        competitionId: 'competition-1',
        name: 'La Liga',
        sport: 'FOOTBALL',
        game: 'SCORE_BETS',
        season: 2021,
        type: 'DOMESTIC',
        status: 'LIVE',
        groupPhase: false,
        knockoutPhase: false,
        knockoutPhaseSingleMatch: false,
        totalMatchdays: 38,
        totalParticipants: 20,
        currentMatchday: 18,
        currentMatchdayStatus: 'TIMED',
        startsAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 5).toISOString(),
        // list of code-name of each of the matchdays, ordered from first to last for non full seasons
        matchdays: null as string[] | null,
      },
    ];
  }

  async GetUserTourneys() {
    return [
      {
        // user-tourney info
        tourneyId: 'tourney-1',
        role: 'ADMIN',
        group: 'ACTIVE',
        chatReadCount: 2,
        pushChatEnabled: true,
        rankingPosition: 3,
        // tourney info
        ownerId: 'user-phoga',
        isPublic: false,
        invitationCode: '?',
        open: false,
        chatEnabled: true,
        totalPlayers: 18,
        competitionId: 'competitiond-1',
        season: 2021,
        format: 'FULL_SEASON',
        pointsVersion: 1,
      },
    ];
  }

  private async _fetch(
    path: string,
    {
      method = 'GET',
      params = {},
      paramsLocation = {},
    }: {
      method?: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
      params?: { [x: string]: any };
      paramsLocation?: ParamsLocation;
    } = {},
  ): Promise<any> {
    const pathParams = filterParams(params, paramsLocation.path);
    const resolvedPath = computePath(path, pathParams);
    if (resolvedPath.match(/\{[^}]+\}/)) {
      throw new Error('InvalidPath');
    }
    const headers = {
      ...filterParams(params, paramsLocation.header),
    };
    if (this.authorizationToken) {
      headers.Authorization = this.authorizationToken;
    }
    const body = stringifyParams(filterParams(params, paramsLocation.body)) ?? '';
    return fetch(resolvedPath, {
      method,
      body: body || undefined,
      headers: {
        ...filterParams(params, paramsLocation.header),
        ...headers,
      },
    });
  }
}

function computePath(pathWithParams: string, pathParams: strMap): string {
  let path = pathWithParams;
  Object.entries(pathParams).forEach(([paramName, paramValue]) => {
    path = path.replace(new RegExp(`{${paramName}}`), paramValue);
  });
  return path;
}

function filterParams(params: strMap, whiteList: string[]): strMap {
  const res: strMap = {};
  whiteList?.forEach(key => {
    const value = params[key];
    if (value != null) {
      res[key] = value;
    }
  });
  return res;
}

function stringifyParams(params: strMap): string | undefined {
  if (params && Object.keys(params).length > 0) {
    return JSON.stringify(params);
  }
  return undefined;
}
