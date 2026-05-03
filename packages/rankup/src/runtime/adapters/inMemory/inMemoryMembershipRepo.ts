import type { MembershipRepo } from '../../ports/membershipRepo.js';
import type { EngineMembership } from '../../types.js';

function toKey(tournamentId: string, userId: string): string {
	return `${tournamentId}:${userId}`;
}

export class InMemoryMembershipRepo implements MembershipRepo {
	private readonly memberships = new Map<string, EngineMembership>();

	public constructor(seed: EngineMembership[] = []) {
		for (const membership of seed) {
			this.memberships.set(toKey(membership.tournamentId, membership.userId), { ...membership });
		}
	}

	public async getByTournamentAndUser(tournamentId: string, userId: string): Promise<EngineMembership | null> {
		const membership = this.memberships.get(toKey(tournamentId, userId));
		return membership ? { ...membership } : null;
	}

	public async add(membership: EngineMembership): Promise<boolean> {
		const key = toKey(membership.tournamentId, membership.userId);
		if (this.memberships.has(key)) {
			return false;
		}
		this.memberships.set(key, { ...membership });
		return true;
	}

	public async countByTournament(tournamentId: string): Promise<number> {
		let count = 0;
		for (const membership of this.memberships.values()) {
			if (membership.tournamentId === tournamentId) {
				count += 1;
			}
		}
		return count;
	}

	public async listByTournament(tournamentId: string): Promise<EngineMembership[]> {
		const members: EngineMembership[] = [];
		for (const membership of this.memberships.values()) {
			if (membership.tournamentId === tournamentId) {
				members.push({ ...membership });
			}
		}
		return members;
	}
}
