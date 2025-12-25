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
  const [gamePieces, setGamePieces] = useState([]);

  const musicRef = useRef(new Audio("/song.mp3"));
  const draggedPiece = useRef(null);
  const formRef = useRef(null);
  const canvasRef = useRef(null);

  // Tự động cắt ảnh thành 9 mảnh khi mở game
  useEffect(() => {
    if (showGame && gamePieces.length === 0) {
      splitImageIntoPieces();
    }
  }, [showGame]);

  const splitImageIntoPieces = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/picture_game.png";

    img.onload = () => {
      const pieceWidth = img.width / 3;
      const pieceHeight = img.height / 3;
      const pieces = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const canvas = document.createElement("canvas");
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          pieces.push({
            id: `${row}_${col}`,
            img: canvas.toDataURL("image/png"),
          });
        }
      }

      setGamePieces(pieces);
      setShuffledPieces([...pieces].sort(() => Math.random() - 0.5));
      setCurrentGrid(Array(9).fill(null));
    };
  };

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
    const solution = [
      "0_0",
      "0_1",
      "0_2",
      "1_0",
      "1_1",
      "1_2",
      "2_0",
      "2_1",
      "2_2",
    ];
    return solution.every((id, idx) => currentGrid[idx]?.id === id);
  };

  const handleStopGame = () => {
    setShowGame(false);
  };

  const handleResetGame = () => {
    setCurrentGrid(Array(9).fill(null));
    if (gamePieces.length > 0) {
      setShuffledPieces([...gamePieces].sort(() => Math.random() - 0.5));
    }
  };

  const handleCompletePuzzle = () => {
    if (isPuzzleSolved()) {
      setShowCongratsMessage(true);
      alert(
        "Chúc mừng! Bạn đã hoàn thành bức hình bấm kết thúc để đọc thiệp nhá 🎉"
      );
    } else {
      alert("Puzzle chưa hoàn thành!");
    }
  };

  const formatDateTime = (dateTime) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("vi-VN", options).format(new Date(dateTime));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-green-500 flex justify-center items-center text-white relative">
      <Snowfall />

      <div className="absolute top-0 left-0 p-4">
        <img
          src="/bear_icon.jpg"
          alt="Icon 1"
          className="animate-bounce w-12 h-12 sm:w-20 sm:h-20"
        />
      </div>
      <div className="absolute top-0 right-0 p-4">
        <img
          src="/bear_icon.jpg"
          alt="Icon 2"
          className="animate-bounce w-12 h-12 sm:w-20 sm:h-20"
        />
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <img
          src="/bear_icon.jpg"
          alt="Icon 3"
          className="animate-bounce w-12 h-12 sm:w-20 sm:h-20"
        />
      </div>
      <div className="absolute bottom-0 right-0 p-4">
        <img
          src="/bear_icon.jpg"
          alt="Icon 4"
          className="animate-bounce w-12 h-12 sm:w-20 sm:h-20"
        />
      </div>

      {!showLetter && !showGame ? (
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Merry Christmas Em Iu Của Anh 🎄
          </h1>
          <p className="mb-8 text-sm sm:text-base">
            Đây là thông điệp cho bạn này
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 gap-3 items-center justify-center">
            <button
              onClick={handleOpenLetter}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg sm:text-xl font-semibold shadow-lg w-full sm:w-auto"
            >
              Mở Thiệp 🎁
            </button>

            <button
              onClick={() => setShowGame(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-lg sm:text-xl font-semibold shadow-lg w-full sm:w-auto"
            >
              Chơi Ghép Hình 🧩
            </button>
          </div>
        </div>
      ) : null}

      {showLetter && (
        <div className="bg-white text-gray-800 p-6 sm:p-8 rounded-lg shadow-lg text-center max-w-md sm:max-w-lg mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-romantic text-red-500 mb-4">
            Em yêu của anh
          </h1>
          <p className="text-base sm:text-lg leading-relaxed">
            Anh xin lỗi vì đã có lúc làm em buồn và khiến em phải suy nghĩ
            nhiều. Anh biết mình chưa đủ tinh tế, chưa đủ khéo léo để bảo vệ cảm
            xúc của em. Nhưng tình cảm anh dành cho em là thật lòng và chưa bao
            giờ thay đổi. 🎄
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Giáng Sinh này, anh chỉ mong em mỉm cười nhiều hơn, mong những điều
            buồn sẽ dần trôi qua, và anh có cơ hội được bù đắp cho em bằng sự
            chân thành của mình. 💖
          </p>

          <div className="mt-6">
            <button
              onClick={handleStopMusic}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg w-full sm:w-auto"
            >
              Trở về Trang Chủ
            </button>
          </div>
        </div>
      )}

      {/* Chúc mừng sau khi hoàn thành game */}
      {showCongratsMessage && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-60">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-center p-6 sm:p-10 rounded-lg shadow-2xl max-w-md sm:max-w-lg mx-auto transition-transform transform hover:scale-105">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Chúc Mừng Em Iu 🎉
            </h2>
            <p className="text-lg text-white mb-6">
              Em không những là cô gái xinh đẹp mà còn thông minh nữa nè
            </p>
            <p className="text-lg text-white mb-6">
              "Giáng sinh này, Anh không chỉ muốn gửi lời chúc, mà còn muốn gửi
              cả trái tim mình. Mong rằng mỗi khoảnh khắc của mùa lễ này sẽ mang
              lại cho Em niềm vui và hạnh phúc. Anh hy vọng rằng ánh sáng của
              Giáng sinh sẽ chiếu sáng con đường mà Em đang đi, và những giấc mơ
              của Em sẽ trở thành hiện thực. Chúc Em một mùa Giáng sinh ấm áp và
              tràn đầy yêu thương!" 🧩🎄
            </p>
            <button
              onClick={() => setShowCongratsMessage(false)}
              className="mt-4 bg-white hover:bg-gray-200 text-green-600 font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showGame && (
        <div className="bg-black bg-opacity-50 flex flex-col justify-center items-center absolute inset-0 p-4">
          {gamePieces.length === 0 ? (
            <div className="text-white text-2xl">Đang tải game... 🎮</div>
          ) : (
            <>
              {isPuzzleSolved() ? (
                // Hiển thị ảnh gốc khi hoàn thành
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-2xl">
                  <img
                    src="/picture_game.png"
                    alt="Completed Puzzle"
                    className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain rounded-lg"
                  />
                </div>
              ) : (
                // Hiển thị grid puzzle khi chưa hoàn thành
                <div className="grid grid-cols-3 grid-rows-3 gap-1 sm:gap-2 bg-white p-3 sm:p-4 rounded-xl shadow-2xl w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                  {currentGrid.map((piece, index) => (
                    <div
                      key={index}
                      onDrop={handleDrop(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onTouchEnd={handleTouchEnd(index)}
                      className="border-2 border-gray-500 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md shadow-inner hover:bg-gray-200 transition-colors w-full h-full"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      {piece && (
                        <img
                          src={piece.img}
                          alt={`piece-${piece.id}`}
                          className="w-full h-full object-cover"
                          draggable="false"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-center mt-6 gap-2 sm:gap-3 flex-wrap max-w-xs sm:max-w-md px-4">
                {shuffledPieces.map((piece) => (
                  <div
                    key={piece.id}
                    draggable
                    onDragStart={handleDragStart(piece)}
                    onTouchStart={handleTouchStart(piece)}
                    className="cursor-pointer border-2 border-white rounded-lg shadow-lg hover:scale-105 transition-transform active:scale-95"
                  >
                    <img
                      src={piece.img}
                      alt={`piece-${piece.id}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-x-0 sm:space-x-4 gap-3 mt-8">
                <button
                  onClick={handleResetGame}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 sm:px-6 rounded-lg w-full sm:w-auto"
                >
                  Sếp Lại
                </button>

                <button
                  onClick={handleCompletePuzzle}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 rounded-lg w-full sm:w-auto"
                >
                  Hoàn Thành
                </button>

                <button
                  onClick={handleStopGame}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:px-6 rounded-lg w-full sm:w-auto"
                >
                  Kết Thúc
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
