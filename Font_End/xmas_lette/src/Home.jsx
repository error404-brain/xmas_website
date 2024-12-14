import { useState, useRef, useEffect } from "react";
import Snowfall from "react-snowfall";

function Home() {
  const [showLetter, setShowLetter] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [shuffledPieces, setShuffledPieces] = useState([]);
  const [currentGrid, setCurrentGrid] = useState(Array(9).fill(null)); // Lưới 3x3

  const musicRef = useRef(new Audio("/song.mp3")); // Quản lý nhạc

  // Tạo các mảnh ghép và xáo trộn vị trí
  useEffect(() => {
    if (showGame) {
      const pieces = [
        { id: "0_0", img: "/piece_0_0.png" },
        { id: "0_1", img: "/piece_0_1.png" },
        { id: "0_2", img: "/piece_0_2.png" },
        { id: "1_0", img: "/piece_1_0.png" },
        { id: "1_1", img: "/piece_1_1.png" },
        { id: "1_2", img: "/piece_1_2.png" },
        { id: "2_0", img: "/piece_2_0.png" },
        { id: "2_1", img: "piece_2_1.png" },
        { id: "2_2", img: "piece_2_2.png" },
      ];

      // Xáo trộn các mảnh ghép
      setShuffledPieces([...pieces].sort(() => Math.random() - 0.5));
      setCurrentGrid(Array(9).fill(null));
    }
  }, [showGame]);

  const handleOpenLetter = () => {
    setShowLetter(true);
    const music = musicRef.current;
    music.play();
    music.loop = true; // Lặp nhạc
  };

  const handleStopMusic = () => {
    setShowLetter(false);
    const music = musicRef.current;
    music.pause();
    music.currentTime = 0; // Đặt lại thời gian phát nhạc
  };

  const handleScheduleGift = () => {
    setShowScheduleForm(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setShowScheduleForm(false);
    alert(`Quà sẽ được gửi vào: ${scheduledTime}`); // Hoặc thêm xử lý gửi thông báo
  };

  const handleDrop = (index) => (event) => {
    const pieceId = event.dataTransfer.getData("pieceId");

    const piece = shuffledPieces.find((p) => p.id === pieceId);
    if (piece) {
      const newGrid = [...currentGrid];
      newGrid[index] = piece;
      setCurrentGrid(newGrid);

      // Loại bỏ mảnh ghép khỏi danh sách chưa đặt
      setShuffledPieces(shuffledPieces.filter((p) => p.id !== pieceId));
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (pieceId) => (event) => {
    event.dataTransfer.setData("pieceId", pieceId);
  };

  const isPuzzleSolved = () => {
    const solution = [
      "0_0", "0_1", "0_2",
      "1_0", "1_1", "1_2",
      "2_0", "2_1", "2_2",
    ];
    return solution.every((id, idx) => currentGrid[idx]?.id === id);
  };

  const handleStopGame = () => {
    if (isPuzzleSolved()) {
      alert("Chúc mừng! Bạn đã hoàn thành bức hình 🎉");
    } else {
      alert("Chưa hoàn thành. Tiếp tục nhé!");
    }
    setShowGame(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-green-500 flex justify-center items-center text-white relative">
      <Snowfall />

      {!showLetter && !showGame ? (
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Merry Christmas Gấu 🎄</h1>
          <p className="mb-8 text-base sm:text-lg">Đây là thông điệp cho bạn nè</p>
          <div className="space-x-4">
            <button
              onClick={handleOpenLetter}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-lg"
            >
              Mở Thiệp 🎁
            </button>
            <button
              onClick={handleScheduleGift}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-lg"
            >
              Lên Lịch 📅
            </button>
            <button
              onClick={() => setShowGame(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-lg"
            >
              Chơi Ghép Hình 🧩
            </button>
          </div>
        </div>
      ) : null}

      {showLetter && (
        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-romantic text-red-500 mb-4">Chào bạn Gấu,</h1>
          <p className="text-base sm:text-lg leading-relaxed">
            Nhân dịp Giáng Sinh, mình chỉ muốn nói rằng bạn là người đặc biệt nhất. Nụ cười của bạn làm sáng bừng cả ngày của mình, và mỗi khoảnh khắc bên bạn đều thật kỳ diệu. Cảm ơn bạn vì tất cả! 🎅🎄
          </p>
          <p className="mt-4 text-base sm:text-lg">
            Chúc bạn một mùa Giáng Sinh an lành, tràn đầy niềm vui và hạnh phúc. 😊💖
          </p>
          <div className="mt-6">
            <button
              onClick={handleStopMusic}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Trở về Trang Chủ
            </button>
          </div>
        </div>
      )}

      {showScheduleForm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Chọn Ngày Và Giờ Gửi Quà 🎁</h2>
            <form onSubmit={handleScheduleSubmit}>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="border rounded-lg p-2 mb-4 w-full"
                required
              />
              <div className="space-x-4">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  Xác Nhận
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGame && (
        <div className="bg-black bg-opacity-50 flex flex-col justify-center items-center absolute inset-0">
          <div
            className="grid grid-cols-3 gap-2 bg-gray-200 p-4 rounded-lg"
            style={{ width: "300px", height: "300px" }}
          >
            {currentGrid.map((piece, index) => (
              <div
                key={index}
                onDrop={handleDrop(index)}
                onDragOver={allowDrop}
                className="border border-gray-400 flex items-center justify-center"
                style={{ width: "100px", height: "100px" }}
              >
                {piece && (
                  <img
                    src={piece.img}
                    alt={`piece-${piece.id}`}
                    style={{ width: "100px", height: "100px" }}
                    draggable="false"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Các mảnh ghép chưa đặt */}
          <div className="flex justify-center mt-6 gap-2">
            {shuffledPieces.map((piece) => (
              <div
                key={piece.id}
                draggable
                onDragStart={handleDragStart(piece.id)}
                className="cursor-pointer"
              >
                <img
                  src={piece.img}
                  alt={`piece-${piece.id}`}
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleStopGame}
            className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Kết Thúc Game
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
