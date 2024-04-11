import useSWR from 'swr';

type SocietyMember = {
  id: number;
  userId: number;
  societyId: number;
  role: 'member' | 'officer' | 'employee';
  user: {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    admin: boolean;
  } | null;
};

export const useSocietyMembers = (society_id: string) => {
  const { data, error, isLoading } = useSWR<SocietyMember[]>(
    `/api/v1/society_members/${society_id}`,
  );

  return {
    data,
    error,
    isLoading,
  };
};
