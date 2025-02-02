import * as User from '../data/user-data';
import * as Session from '../data/session-data';
import { v4 as uuid } from 'uuid';

/**
 * Creates a new entry in the user table.
 */
export const create = async (userCreateParams: User.Create) => {
  const newUser = await User.create(userCreateParams);
  if (newUser.admin) throw new Error('Admin users cannot be created');
  return newUser;
};

/**
 * Updates a user.
 */

export const update = async (userUpdateParams: User.Update) => {
  const updatedUser = await User.update(userUpdateParams);
  return updatedUser;
};

/**
 * Retrieves a user by ID.
 */
export const retrieve = async (userRetrieveParams: User.Retrieve) => {
  // Enforce some business logic
  const user = await User.retrieve(userRetrieveParams);
  return user;
};

/**
 * Lists users.
 */
export const list = async (userListParams: User.List) => {
  const users = await User.list(userListParams);
  return users;
};

/**
 * Login a user.
 */
export const login = async (userLoginParams: User.Login) => {
  const loginUser = await User.login(userLoginParams);
  const token = await Session.create({
    userId: loginUser.user.id,
    token: uuid(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) /** 1 week */,
  });

  return {
    ...loginUser,
    token: token.token,
  };
};
