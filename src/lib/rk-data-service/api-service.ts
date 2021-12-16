import type {
  ApiServiceConfig,
  IApiService,
  LoggedUser,
  SignInResponse,
} from '../data-service/types.js';

export class RkApiService implements IApiService {
  config: ApiServiceConfig = {};

  constructor(config?: ApiServiceConfig) {
    this.config = config ?? {};
  }

  updateConfig(config: ApiServiceConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  Auth = {
    SignIn: this.SignIn,
  };

  Competitions = {
    GetAllCompetitions: this.GetAllCompetitions,
  };

  Tourneys = {
    GetUserTourneys: this.GetUserTourneys,
  };

  private async SignIn({
    token,
    provider,
    username,
    password,
  }: {
    token?: string;
    provider?: string;
    username?: string;
    password?: string;
  }): Promise<SignInResponse> {
    return {
      credentials: {
        AccessKeyId: 'access-key-id',
        Expiration: new Date(new Date().getTime() + 1000 * 60 * 60).toISOString(),
        SecretKey: 'secret-key',
        SessionToken: 'session-token',
      },
      user: {
        userId: 'user-phoga',
        email: 'phoga@rankup.app',
        createdAt: new Date().toISOString(),
        username: 'phoga',
        picture: null,
      },
      isNewUser: false,
    };
  }

  private async GetAllCompetitions() {
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

  private async GetUserTourneys() {
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
}
