function UserCard({ user }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 0",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: user.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        {user.username[0].toUpperCase()}
      </div>

      <span>{user.username}</span>
    </div>
  );
}

export default UserCard;
