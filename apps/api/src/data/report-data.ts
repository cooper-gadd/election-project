import {
  countDistinct,
  gt,
  count,
  and,
  lte,
  gte,
  eq,
  lt,
  or,
  sql,
} from 'drizzle-orm';
import { db } from '../db';
import {
  session,
  election,
  candidateVote,
  societyMember,
  electionOffice,
  electionCandidate,
  society,
  user,
  officeResultsView,
  initiativeResultsView,
} from '../db/schema';
import { calculate } from '../helpers/log-helper';

export type Society = {
  societyId: number;
};

/**
 * Reports the number of active and inactive ballots, number of users per society, avgerage number of members voting in each election.
 */
export const societyReport = async ({ societyId }: Society) => {
  try {
    const [
      [activeBallots],
      [inActiveBallots],
      [societyUsers],
      [votingMembers],
    ] = await Promise.all([
      db
        .select({ count: count() })
        .from(election)
        .where(
          and(
            eq(election.societyId, societyId),
            lte(election.startDate, new Date().toString()),
            gte(election.endDate, new Date().toString()),
          ),
        ),
      db
        .select({ count: count() })
        .from(election)
        .where(
          and(
            eq(election.societyId, societyId),
            or(
              gt(election.startDate, new Date().toString()),
              lt(election.endDate, new Date().toString()),
            ),
          ),
        ),
      db
        .select({ count: count() })
        .from(societyMember)
        .where(eq(societyMember.societyId, societyId)),
      db
        .select({ count: countDistinct(candidateVote.memberId) })
        .from(candidateVote)
        .innerJoin(societyMember, eq(societyMember.societyId, societyId)),
    ]);

    const elections =
      (activeBallots?.count ?? 0) + (inActiveBallots?.count ?? 0);

    const averageVotingMembers = Math.ceil(
      (votingMembers?.count ?? 0) / elections,
    );

    return {
      activeBallots: activeBallots?.count || 0,
      inActiveBallots: inActiveBallots?.count || 0,
      societyUsers: societyUsers?.count || 0,
      averageVotingMembers,
    };
  } catch (err) {
    throw new Error('Something went wrong with the report.');
  }
};

/**
 * Reports the number of currently logged in users, number of active elections, avgerage query response time, avgerage http response time.
 */
export const systemReport = async () => {
  try {
    const [
      loggedInUsers,
      activeElections,
      { averageRequestTime, averageResponseTime },
    ] = await Promise.all([
      db.execute<{
        count: number;
      }>(sql`SELECT count from loggedInUsersFunction()`),
      db.execute<{
        count: number;
      }>(sql`SELECT count from activeElectionsFunction()`),
      calculate(),
    ]);

    return {
      loggedInUsers: loggedInUsers.count,
      activeElections: activeElections.count,
      averageRequestTime,
      averageResponseTime,
    };
  } catch (err) {
    throw new Error('Something went wrong with the report.');
  }
};

export type Status = {
  electionId: number;
};

/**
 * View Current Election Status
 */
export const statusReport = async ({ electionId }: Status) => {
  try {
    const [[totalVotes], votingMembers, members] = await Promise.all([
      db
        .select({ count: count() })
        .from(candidateVote)
        .innerJoin(
          electionCandidate,
          eq(electionCandidate.id, candidateVote.electionCandidateId),
        )
        .innerJoin(
          electionOffice,
          eq(electionOffice.id, electionCandidate.electionOfficeId),
        )
        .where(eq(electionOffice.electionId, electionId)),
      db
        .selectDistinctOn([user.id], {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        })
        .from(user)
        .innerJoin(societyMember, eq(societyMember.userId, user.id))
        .innerJoin(society, eq(society.id, societyMember.societyId))
        .innerJoin(election, eq(election.societyId, society.id))
        .innerJoin(electionOffice, eq(electionOffice.electionId, election.id))
        .innerJoin(
          electionCandidate,
          eq(electionCandidate.electionOfficeId, electionOffice.id),
        )
        .innerJoin(
          candidateVote,
          eq(candidateVote.electionCandidateId, electionCandidate.id),
        )
        .where(eq(election.id, electionId)),
      db
        .selectDistinctOn([user.id], {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        })
        .from(user)
        .innerJoin(societyMember, eq(societyMember.userId, user.id))
        .innerJoin(society, eq(society.id, societyMember.societyId))
        .innerJoin(election, eq(election.societyId, society.id))
        .where(eq(election.id, electionId)),
    ]);

    const nonVotingMembers = members.filter(
      (member) =>
        !votingMembers.some((votingMember) => votingMember.id === member.id),
    );

    const totalMembers =
      (votingMembers?.length ?? 0) + (nonVotingMembers?.length ?? 0);

    const votingMemberPercentage = Math.ceil(
      ((votingMembers?.length ?? 0) / totalMembers) * 100,
    );

    return {
      totalVotes: totalVotes?.count || 0,
      votingMembers,
      nonVotingMembers,
      votingMemberPercentage,
    };
  } catch (err) {
    throw new Error('Something went wrong with the report.');
  }
};

export type Results = {
  electionId: number;
};

/**
 * View Finished Election Results
 */
export const resultsReport = async ({ electionId }: Results) => {
  try {
    await Promise.all([
      db.refreshMaterializedView(officeResultsView),
      db.refreshMaterializedView(initiativeResultsView),
    ]);

    const [officeResults, initiativeResults] = await Promise.all([
      db.execute<{
        candidate: {
          name: string;
          office: string;
          voteCount: number;
        };
      }>(sql`SELECT candidate from officeResultsFunction(${electionId})`),
      db.execute<{
        option: {
          title: string;
          initiative: string;
          voteCount: number;
        };
      }>(sql`SELECT option from initiativeResultsFunction(${electionId})`),
    ]);

    return {
      officeResults,
      initiativeResults,
    };
  } catch (err) {
    console.error(err);
    throw new Error('Something went wrong with the report.');
  }
};
