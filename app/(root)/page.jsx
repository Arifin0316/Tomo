import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getComments } from "@/lib/posting"; // Corrected function name

export default async function Home() {
  const session = await getServerSession(authOptions);
  const postId = "cm6qrlkvw0002dfv4zwq6c7jo"; // Your specific post ID
  
  // Fetch comments for the specific post
  const comments = await getComments(postId);
  console.log(comments)

  if (!session) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.username}!</h1>
      <p>User ID: {session.user.id}</p>
      <p>Email: {session.user.email}</p>
      
      {/* Optional: Display comments */}
      <div>
        <h2>Comments:</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <small>By: {comment.user.username}</small>
            </div>
          ))
        ) : (
          <p>No comments found</p>
        )}
      </div>
    </div>
  );
}