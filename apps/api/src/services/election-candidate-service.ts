import { Handler } from 'express';
import { z } from 'zod';
import * as electionCandidate from '../controllers/election-candidate-controller';
import { BadRequestError } from '../errors/BadRequestError';

const ElectionCandidateSchema = z.object({
  electionOfficeId: z.number(),
  name: z.string(),
  photoURL: z.string().optional(),
  description: z.string(),
});

export const create: Handler = async (req, res, next) => {
  try {
    if (!req.society) {
      throw new BadRequestError('Society ID missing from headers');
    }

    const electionCandidateData = ElectionCandidateSchema.parse(req.body);

    const newElectionCandidate = await electionCandidate.create({
      electionCandidateData: {
        ...electionCandidateData,
        societyId: req.society.id,
      },
    });

    res.send(newElectionCandidate);
  } catch (err) {
    next(err);
  }
};

const ListElectionCandidateParamsSchema = z.object({
  election_id: z.string().transform((id) => parseInt(id)),
});

export const list: Handler = async (req, res, next) => {
  try {
    if (!req.society) {
      throw new BadRequestError('Society ID missing from headers');
    }

    const { election_id: electionId } = ListElectionCandidateParamsSchema.parse(
      req.params,
    );

    const listElectionCandidates = await electionCandidate.list({
      electionId,
      societyId: req.society.id,
    });

    res.send(listElectionCandidates);
  } catch (err) {
    next(err);
  }
};

const RetrieveElectionCandidateParamsSchema = z.object({
  electionCandidateId: z.string().transform((id) => parseInt(id)),
});

export const retrieve: Handler = async (req, res, next) => {
  try {
    if (!req.society) {
      throw new BadRequestError('Society ID missing from headers');
    }

    const { electionCandidateId: electionCandidateId } =
      RetrieveElectionCandidateParamsSchema.parse(req.params);

    const retrieveElectionCandidate = await electionCandidate.retrieve({
      electionCandidateId,
    });

    res.send(retrieveElectionCandidate);
  } catch (err) {
    next(err);
  }
};

const UpdateElectionCandidateParamsSchema = z.object({
  electionCandidateId: z.string().transform((id) => parseInt(id)),
});

export const update: Handler = async (req, res, next) => {
  try {
    if (!req.society) {
      throw new BadRequestError('Society ID missing from headers');
    }

    const { electionCandidateId: electionCandidateId } =
      UpdateElectionCandidateParamsSchema.parse(req.params);

    const electionCandidateData = ElectionCandidateSchema.parse(req.body);

    const updatedElectionCandidate = await electionCandidate.update({
      electionCandidateId,
      electionCandidateData: {
        ...electionCandidateData,
        societyId: req.society.id,
      },
    });

    res.send(updatedElectionCandidate);
  } catch (err) {
    next(err);
  }
};

const RemoveElectionCandidateParamsSchema = z.object({
  electionCandidateId: z.string().transform((id) => parseInt(id)),
});

export const remove: Handler = async (req, res, next) => {
  try {
    if (!req.society) {
      throw new BadRequestError('Society ID missing from headers');
    }

    const { electionCandidateId: electionCandidateId } =
      RemoveElectionCandidateParamsSchema.parse(req.params);

    await electionCandidate.remove({
      electionCandidateId,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
