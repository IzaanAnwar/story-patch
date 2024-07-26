import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProfileDetails } from '@/server/users';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Link from 'next/link';

const Profile = async ({ params }: { params: { userid: string } }) => {
  const { error, data } = await getProfileDetails(params.userid);
  if (error) {
    return (
      <main className='flex justify-center items-center h-screen'>
        <Card>
          <CardContent>
            <div>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }
  return (
    <div className=' px-4 md:px-16 py-16 lg:px-32 min-h-screen space-y-12'>
      <div className='flex justify-start items-center gap-4'>
        <Avatar className='border-primary border-2'>
          <AvatarImage
            src={data?.user.image || ''}
            alt={data?.user.name + 'image'}
          />
          <AvatarFallback className='flex justify-center items-center text-center w-fit mx-auto'>
            CN
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{data?.user?.name}</CardTitle>
          <CardDescription>{data?.user.email}</CardDescription>
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold mb-4'>Stories written</h2>
        {data?.stories?.map(story => (
          <Card key={story.id} className='mb-6 p-4 shadow-lg'>
            <CardHeader className='flex flex-row   justify-between items-center'>
              <CardTitle>
                <Link href={`/stories/${story.name}`} className='min-w-fit'>
                  <h3 className='text-xl font-bold hover:text-primary duration-200'>
                    {story.name}
                  </h3>
                </Link>
              </CardTitle>
              <p>
                {story.likes} {story.likes < 2 ? 'Like' : 'Likes'}
              </p>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600 mb-4'>{story.content}</p>
            </CardContent>
          </Card>
        ))}
        {data?.stories.length === 0 && <p>No Stories started yet</p>}
      </div>
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold mb-4'>Contribution</h2>
        {data?.patches?.map(patch => (
          <Card key={patch.id} className='mb-6 p-4 shadow-lg'>
            <CardContent>
              <p className='text-gray-600 mb-4'>{patch.content}</p>
            </CardContent>
          </Card>
        ))}
        {data?.patches.length === 0 && <p>No contributions yet</p>}
      </div>
    </div>
  );
};

export default Profile;
