const Leaderboard = () => {
  const leaderboard = [
    { id: 1, name: "John Doe", points: 2500 },
    { id: 2, name: "Jane Smith", points: 2350 },
    { id: 3, name: "Mike Johnson", points: 2100 },
    { id: 4, name: "Sarah Williams", points: 1950 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Leaderboard</h2>

      {leaderboard.map((user, index) => (
        <div
          key={user.id}
          className="flex justify-between py-3 border-b last:border-none"
        >
          <div className="flex gap-3">
            <span className="font-bold text-gray-500">{index + 1}</span>

            <span>{user.name}</span>
          </div>

          <span className="font-semibold">{user.points} pts</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
