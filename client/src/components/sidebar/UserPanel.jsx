import UserCard from "./Usercard";

function UserPanel({ users }) {
  return (
    <>
      <h3>Users</h3>

      {users.map((user) => (
        <UserCard key={user.socketId} user={user} />
      ))}
    </>
  );
}

export default UserPanel;
