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
    GetRanking: this.GetRanking,
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
        name: 'The Squad Team',
        // tourney info
        ownerId: 'user-phoga',
        isPublic: false,
        invitationCode: '?',
        open: false,
        chatEnabled: true,
        totalPlayers: 18,
        competitionId: 'laliga',
        season: 2021,
        format: 'FULL_SEASON',
        pointsVersion: 1,
      },
    ];
  }

  private async GetRanking() {
    return [
      {
        position: 1,
        points: 1264,
        user: {
          userId: 'antonio-id',
          username: 'Antonio',
          picture: 'rocket.svg',
        },
      },
      {
        position: 2,
        points: 1180,
        user: {
          userId: 'cristiano-ronaldo-id',
          username: 'Cristiano_Ronaldo',
          picture: 'tree.svg',
        },
      },
      {
        position: 3,
        points: 950,
        user: {
          userId: 'nacho-id',
          username: 'nacho',
          picture: 'ironman.svg',
        },
      },
      {
        position: 4,
        points: 778,
        user: {
          userId: 'alvaro-id',
          username: 'alvaro',
          picture: 'fighter.svg',
        },
      },
      {
        position: 5,
        points: 734,
        user: {
          userId: 'elbichito-id',
          username: 'ElBichito',
          picture: 'bulbasaur.svg',
        },
      },
    ];
  }
}
