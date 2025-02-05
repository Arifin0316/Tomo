import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.username}!</h1>
      <p>User ID: {session.user.id}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
