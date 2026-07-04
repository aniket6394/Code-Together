function UserCard({ user }) {
  return (
    <div
      style={{
        padding: "12px",
        marginBottom: "8px",
        background: "#2d2d2d",
        borderRadius: "6px",
        color: "white",
      }}
    >
      👤 {user.username}
    </div>
  );
}

export default UserCard;
