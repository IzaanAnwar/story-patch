import { SubmitPatch } from './submit-patch';
import { OnGoingSubmissions } from './ongoing-patches';
import { getStoryContributors, getStroyPatches } from '@/server/stories';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LikeButton } from './like-btn';
import { getCurrUser } from '@/server/users';

export default async function Component({
  params,
}: {
  params: { title: string };
}) {
  const user = await getCurrUser();
  const { error, storyPatches } = await getStroyPatches(
    params.title.replaceAll('_', ' ')
  );

  return (
    <div className='px-2 py-6 md:px-16 lg:px-32 lg:py-16'>
      <article className='prose prose-gray mx-auto dark:prose-invert'>
        <div className='space-y-2 not-prose'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]'>
            {storyPatches?.title}
          </h1>
          <p className='text-muted-foreground'>{storyPatches?.author}</p>
        </div>
        <div className='grid gap-6 mt-4'>
          <div>
            <p>{storyPatches?.content}</p>
            <p className='text-muted-foreground text-sm'>
              By {storyPatches?.author} •{' '}
              {moment(storyPatches?.createdAt).fromNow()}
            </p>
          </div>
          {storyPatches?.patches.map(patch => (
            <div key={patch.id}>
              <p>{patch.content}</p>
              <p className='text-muted-foreground text-sm'>
                By {patch.author} • {moment(patch.createdAt).fromNow()}
              </p>
            </div>
          ))}
        </div>
        <div className='flex justify-start items-center gap-2 py-4 border-t mt-4'>
          <LikeButton
            user={user}
            stroyId={storyPatches?.id!}
            allLikes={storyPatches?.allikes}
            likes={storyPatches?.likes ?? 0}
          />
        </div>
        <section className='bg-zinc-100 rounded p-4 my-6 space-y-6'>
          <ContributorsSection storyId={storyPatches?.id!} />
          <h5 className='text-xl font-bold'>Story Overview</h5>
          <div dangerouslySetInnerHTML={{ __html: storyPatches?.overview! }} />
        </section>
        {storyPatches && <SubmitPatch storyId={storyPatches.id} />}
        {storyPatches && <OnGoingSubmissions storyId={storyPatches.id} />}
      </article>
    </div>
  );
}
async function ContributorsSection(props: { storyId: string }) {
  const { contributors, error } = await getStoryContributors(props.storyId);
  if (error) {
    return <Card className='text-destructive'>{error}</Card>;
  }

  return (
    <div className=''>
      <h5 className='text-xl font-bold'>Contributors</h5>
      <div className='mt-4'>
        {contributors?.length ? (
          <div className='flex flex-wrap gap-6 justify-start items-center'>
            {contributors.map(contributor => (
              <div
                key={contributor.id}
                className=' flex justify-start items-center gap-4 p-1 group'
              >
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-gray-800 group-hover:text-primary duration-200'>
                    {contributor.author}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {moment(contributor.createdAt).format('MMM D YYYY hA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500'>No contributors yet.</p>
        )}
      </div>
    </div>
  );
}
