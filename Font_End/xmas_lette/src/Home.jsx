import { useState, useRef, useEffect } from "react";
import Snowfall from "react-snowfall";
import html2canvas from "html2canvas";

function Home() {
  const [showLetter, setShowLetter] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [shuffledPieces, setShuffledPieces] = useState([]);
  const [currentGrid, setCurrentGrid] = useState(Array(9).fill(null));
  const [showCongratsMessage, setShowCongratsMessage] = useState(false);
  const [showConfirmationCard, setShowConfirmationCard] = useState(false);

  const musicRef = useRef(new Audio("/song.mp3"));
  const draggedPiece = useRef(null);
  const formRef = useRef(null);

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
        { id: "2_1", img: "/piece_2_1.png" },
        { id: "2_2", img: "/piece_2_2.png" },
      ];

      setShuffledPieces([...pieces].sort(() => Math.random() - 0.5));
      setCurrentGrid(Array(9).fill(null));
    }
  }, [showGame]);

  const handleOpenLetter = () => {
    setShowLetter(true);
    const music = musicRef.current;
    music.play();
    music.loop = true;
  };

  const handleStopMusic = () => {
    setShowLetter(false);
    const music = musicRef.current;
    music.pause();
    music.currentTime = 0;
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setShowScheduleForm(false);
    captureForm(); // Gọi hàm lưu ảnh
  };

  const captureForm = () => {
    if (formRef.current) {
      html2canvas(formRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        // Tự động tải ảnh
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "form_capture.png";
        link.click();
        setShowConfirmationCard(true); // Hiển thị thiệp xác nhận
      });
    }
  };

  const handleDragStart = (piece) => (event) => {
    draggedPiece.current = piece;
    event.dataTransfer.setData("pieceId", piece.id);
  };

  const handleTouchStart = (piece) => () => {
    draggedPiece.current = piece;
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    placePiece(index);
  };

  const handleTouchEnd = (index) => () => {
    placePiece(index);
  };

  const placePiece = (index) => {
    const piece = draggedPiece.current;
    if (piece) {
      const newGrid = [...currentGrid];
      if (!newGrid[index]) {
        newGrid[index] = piece;
        setCurrentGrid(newGrid);
        setShuffledPieces(shuffledPieces.filter((p) => p.id !== piece.id));
        draggedPiece.current = null;
      }
    }
  };

  const isPuzzleSolved = () => {
    const solution = ["0_0", "0_1", "0_2", "1_0", "1_1", "1_2", "2_0", "2_1", "2_2"];
    return solution.every((id, idx) => currentGrid[idx]?.id === id);
  };

  const handleStopGame = () => {
    setShowGame(false);
  };

  const handleResetGame = () => {
    setCurrentGrid(Array(9).fill(null));
    setShuffledPieces([
      { id: "0_0", img: "/piece_0_0.png" },
      { id: "0_1", img: "/piece_0_1.png" },
      { id: "0_2", img: "/piece_0_2.png" },
      { id: "1_0", img: "/piece_1_0.png" },
      { id: "1_1", img: "/piece_1_1.png" },
      { id: "1_2", img: "/piece_1_2.png" },
      { id: "2_0", img: "/piece_2_0.png" },
      { id: "2_1", img: "/piece_2_1.png" },
      { id: "2_2", img: "/piece_2_2.png" },
    ].sort(() => Math.random() - 0.5));
  };

  const handleCompletePuzzle = () => {
    if (isPuzzleSolved()) {
      setShowCongratsMessage(true);
      alert("Chúc mừng! Bạn đã hoàn thành bức hình bấm kết thúc để đọc thiệp nhá 🎉");
    } else {
      alert("Puzzle chưa hoàn thành!");
    }
  };

  const formatDateTime = (dateTime) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateTime));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-green-500 flex justify-center items-center text-white relative">
      <Snowfall />
     
      <div className="absolute top-0 left-0 p-4">
        <img src="/bear_icon.jpg" alt="Icon 1" className="animate-bounce w-20 h-20" />
      </div>
      <div className="absolute top-0 right-0 p-4">
        <img src="/bear_icon.jpg" alt="Icon 2" className="animate-bounce w-20 h-20" />
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <img src="/bear_icon.jpg" alt="Icon 3" className="animate-bounce w-20 h-20" />
      </div>
      <div className="absolute bottom-0 right-0 p-4">
        <img src="/bear_icon.jpg" alt="Icon 4" className="animate-bounce w-20 h-20" />
      </div>

      {!showLetter && !showGame ? (
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Merry Christmas Gấu 🎄</h1>
          <p className="mb-8 text-base sm:text-lg">Đây là thông điệp cho bạn này</p>
          <div className="space-x-4">
            <button
              onClick={handleOpenLetter}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-lg"
            >
              Mở Thiệp 🎁
            </button>
            <button
              onClick={() => setShowScheduleForm(true)}
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
            Nhân dịp sắp tới là dịp Giáng Sinh, mình chỉ muốn nói rằng bạn là người đặc biệt nhất. Nụ cười của bạn làm sáng bừng cả ngày của mình, và mỗi khoảnh khắc được nhìn bạn đều thật kỳ diệu. Cảm ơn bạn vì tất cả! 🎅🎄
          </p>
          <p className="mt-4 text-base sm:text-lg">
            Chúc bạn một mùa Giáng Sinh an lành, tràn đầy niềm vui và hạnh phúc, mau mau hết bệnh nha. 😊💖
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

      {/* Chúc mừng sau khi hoàn thành game */}
      {showCongratsMessage && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-60">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-center p-10 rounded-lg shadow-2xl max-w-lg mx-auto transition-transform transform hover:scale-105">
            <h2 className="text-4xl font-bold text-white mb-4">Chúc Mừng Bạn! 🎉</h2>
            <p className="text-lg text-white mb-6">Bạn không những là cô gái xinh đẹp mà còn thông minh nữa nè</p>
            <p className="text-lg text-white mb-6">"Giáng sinh này, em không chỉ muốn gửi lời chúc, mà còn muốn gửi cả trái tim mình. Mong rằng mỗi khoảnh khắc của mùa lễ này sẽ mang lại cho chị niềm vui và hạnh phúc. Em hy vọng rằng ánh sáng của Giáng sinh sẽ chiếu sáng con đường mà chị đang đi, và những giấc mơ của chị sẽ trở thành hiện thực. Chúc chị một mùa Giáng sinh ấm áp và tràn đầy yêu thương!" 🧩🎄</p>
            <button
              onClick={() => setShowCongratsMessage(false)}
              className="mt-4 bg-white hover:bg-gray-200 text-green-600 font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showScheduleForm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-xl shadow-2xl text-center max-w-md w-full" ref={formRef}>
            <h2 className="text-3xl font-semibold mb-6 text-blue-800">Lên Lịch Gửi Quà 🎁</h2>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full border border-blue-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition"
                >
                  Xác Nhận
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmationCard && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <h2 className="text-3xl font-semibold mb-4 flex items-center justify-center">
              <span className="mr-2 text-green-500">🎁</span>
              Xác Nhận Gửi Quà 🎉
            </h2>
            <p className="text-lg mb-4">Mình hồi hộp quá khi chuẩn bị tặng quà cho bạn quáaaaaaa àaaaaaa !</p>
            <p className="text-lg mb-4">Hy vọng món quà này sẽ mang lại cho bạn nụ cười và niềm vui!</p>
            <p className="text-lg mb-4">Quà sẽ được gửi vào:</p>
            <div className="flex items-center justify-center bg-blue-100 p-4 rounded-lg shadow-md">
              <span className="text-xl font-bold text-blue-600 mr-2">
                ⏰
              </span>
              <span className="text-xl font-bold text-blue-600">
                {formatDateTime(scheduledTime)}
              </span>
            </div>
            <div className="mt-4">
              <img src="/bear_icon2.png" alt="Celebration" className="w-16 mx-auto" />
            </div>
            <button
              onClick={() => setShowConfirmationCard(false)}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Đóng
            </button>
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
                onDragOver={(e) => e.preventDefault()}
                onTouchEnd={handleTouchEnd(index)}
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
          <div className="flex justify-center mt-6 gap-2">
            {shuffledPieces.map((piece) => (
              <div
                key={piece.id}
                draggable
                onDragStart={handleDragStart(piece)}
                onTouchStart={handleTouchStart(piece)}
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

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleResetGame}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
            >
              Sếp Lại 
            </button>

            <button
              onClick={handleCompletePuzzle}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Hoàn Thành
            </button>

            <button
              onClick={handleStopGame}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Kết Thúc 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;