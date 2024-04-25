import useSWR from 'swr';

export type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  societies: {
    society: {
      id: number;
      name: string;
      ownerId: number;
    };
  }[];
  role: 'admin' | 'member' | 'officer' | 'employee';
};

export const useSession = () => {
  const { data, error, isLoading } = useSWR<User>('/ajax/auth/session');

  return {
    data,
    error,
    isLoading,
  };
};
