import useSWR from 'swr';

type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  admin: boolean;
};

export const useUser = (userId: string) => {
  const { data, error, isLoading } = useSWR<User>(`/api/v1/user/${userId}`);

  return {
    data,
    error,
    isLoading,
  };
};
