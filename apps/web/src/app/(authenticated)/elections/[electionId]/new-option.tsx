import { Plus16 } from '@frosted-ui/icons';
import { Button, DialogContent, DialogRoot, DialogTrigger } from 'frosted-ui';

type NewOptionProps = {
  electionId: string;
};

export const NewOption = ({ electionId }: NewOptionProps) => {
  return (
    <DialogRoot>
      <DialogTrigger>
        <Button color="gray" variant="classic">
          <Plus16 />
          Add option
        </Button>
      </DialogTrigger>
      <DialogContent>new option for {electionId}</DialogContent>
    </DialogRoot>
  );
};
