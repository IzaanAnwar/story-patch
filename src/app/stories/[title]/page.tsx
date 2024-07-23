import { SubmitPatch } from './submit-patch';
import { OnGoingSubmissions } from './ongoing-patches';
import { getStroyPatches } from '@/server/stories';
import moment from 'moment';

export default async function Component({
  params,
}: {
  params: { title: string };
}) {
  const { error, storyPatches } = await getStroyPatches(
    params.title.replaceAll('_', ' ')
  );

  return (
    <div className='px-4 py-6 md:px-6 lg:px-16 lg:py-16'>
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
        {storyPatches && <SubmitPatch storyId={storyPatches.id} />}
        {storyPatches && <OnGoingSubmissions storyId={storyPatches.id} />}
      </article>
    </div>
  );
}
