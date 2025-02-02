import { Card, Flex, Skeleton, Text } from 'frosted-ui';

type StatsCardProps = {
  label: string;
  count?: number | string;
  unit?: string;
};

export const StatsCard = ({ label, count, unit }: StatsCardProps) => {
  return (
    <Card>
      <Flex direction="column">
        <Text size="2" weight="medium" color="gray">
          {label}
        </Text>
        {typeof count !== 'undefined' && (
          <Text size="6" weight="medium">
            {count} {unit}
          </Text>
        )}
        {typeof count === 'undefined' && (
          <Skeleton.Rect className="h-[30px] w-16 rounded-sm" />
        )}
      </Flex>
    </Card>
  );
};
