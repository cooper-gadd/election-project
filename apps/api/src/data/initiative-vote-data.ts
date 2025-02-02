import { CreateInitiativeVote } from '../db/schema';
import { db } from '../db';
import { initiativeVote, electionInitiative, election } from '../db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';

export type Create = {
  initiativeVoteData: CreateInitiativeVote;
};

/**
 * Creates a new entry in the initiative vote vote table.
 */
export const create = async ({ initiativeVoteData }: Create) => {
  try {
    const [newInitiativeVote] = await db.transaction(
      async (dbClient) =>
        await dbClient
          .insert(initiativeVote)
          .values(initiativeVoteData)
          .returning(),
    );
    return newInitiativeVote!;
  } catch (err) {
    throw new Error('Something went wrong creating a initiative vote.');
  }
};

export type List = {
  electionId: number;
  societyId: number;
};

/**
 * Lists a society's election's initiative votes.
 */
export const list = async ({ electionId, societyId }: List) => {
  try {
    const initiativeVoteData = await db
      .select({
        ...getTableColumns(initiativeVote),
      })
      .from(initiativeVote)
      .innerJoin(
        electionInitiative,
        eq(initiativeVote.electionInitiativeId, electionInitiative.id),
      )
      .innerJoin(election, eq(electionInitiative.electionId, election.id))
      .where(
        and(eq(election.id, electionId), eq(election.societyId, societyId)),
      );
    return initiativeVoteData!;
  } catch (err) {
    throw new Error('Something went wrong listing election initative votes.');
  }
};
