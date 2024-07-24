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
        <section className='bg-zinc-100 rounded p-4 my-6 space-y-6'>
          <h5 className='text-xl font-bold'>Overview</h5>
          <div dangerouslySetInnerHTML={{ __html: storyPatches?.overview! }} />
        </section>
        {storyPatches && <SubmitPatch storyId={storyPatches.id} />}
        {storyPatches && <OnGoingSubmissions storyId={storyPatches.id} />}
      </article>
    </div>
  );
}
