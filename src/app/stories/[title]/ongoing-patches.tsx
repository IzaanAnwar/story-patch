import { getPendingPatches } from '@/server/stories';
import moment from 'moment';
import VoteBtn from './VoteBtn';
import { getCurrUser } from '@/server/users';
import { redirect } from 'next/navigation';

export async function OnGoingSubmissions({ storyId }: { storyId: string }) {
  const user = await getCurrUser();

  const { error, patches } = await getPendingPatches(storyId);
  if (error) return <div>{error}</div>;
  return (
    <section className='mt-8 bg-muted p-4 space-y-3 rounded-md'>
      <h5>Submitted Patches</h5>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-muted-foreground text-sm'>
          Time remaining before merging: 2 hours
        </p>
      </div>
      <div className='grid gap-4'>
        {patches?.map(patch => {
          const userHasVoted = !!patch.votes.find(
            item => item.userId === user?.id
          );
          return (
            <div className='' key={patch.id}>
              <p>{patch.content}</p>
              <p className='text-muted-foreground text-sm'>
                By {patch.author} • {moment(patch.createdAt).fromNow()}
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground text-sm'>
                  {patch.votes.length} votes
                </span>
                <VoteBtn
                  patchId={patch.id}
                  storyId={patch.storyId}
                  fill={userHasVoted}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}