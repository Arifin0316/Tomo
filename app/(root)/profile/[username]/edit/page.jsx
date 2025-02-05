import { getProfile } from '@/lib/profile';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { editProfile } from '@/lib/profile';
import { redirect } from 'next/navigation';

export default async function EditProfilePage({ params }) {
  const username = (await params).username;
  const user = await getProfile(username);

  if (!user) {
    return <div>User not found</div>;
  }

  const handleSubmit = async (formData) => {
    'use server';
    const result = await editProfile(username, formData);
    
    if (result.success) {
      redirect(`/profile/${username}`);
    } else {
      return { error: result.message };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <EditProfileForm 
        user={user} 
        onSave={handleSubmit} 
      />
    </div>
  );
}