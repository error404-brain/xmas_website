import { useState, useEffect } from 'react';
import Snowfall from 'react-snowfall';

function Home() {
  const [showLetter, setShowLetter] = useState(false);
  const music = new Audio('/song.mp3'); // Đảm bảo nhạc nằm trong thư mục public

  const handleOpenLetter = () => {
    setShowLetter(true);
    music.play(); // Phát nhạc khi mở thư
  };

  const handleStopMusic = () => {
    music.pause();
    music.currentTime = 0; // Reset nhạc về đầu
    setShowLetter(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-green-500 flex justify-center items-center text-white relative">
      <Snowfall />
      {/* Thêm các con gấu vào các vị trí ngẫu nhiên trên trang */}
      <img src="/bear_icon.jpg" alt="bear" className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20" />
      <img src="/bear_icon.jpg" alt="bear" className="absolute top-20 right-20 w-16 h-16 sm:w-20 sm:h-20" />
      <img src="/bear_icon.jpg" alt="bear" className="absolute bottom-10 left-10 w-16 h-16 sm:w-20 sm:h-20" />
      <img src="/bear_icon.jpg" alt="bear" className="absolute bottom-20 right-20 w-16 h-16 sm:w-20 sm:h-20" />

      {!showLetter ? (
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Merry Christmas Gấu 🎄</h1>
          <p className="mb-8 text-base sm:text-lg">Đây là thông điệp cho bạn nè</p>
          <button
            onClick={handleOpenLetter}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-lg"
          >
            Open Gift 🎁
          </button>
        </div>
      ) : (
        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-romantic text-red-500 mb-4">Hi Bạn Bơ,</h1>
          <p className="text-base sm:text-lg leading-relaxed">
            On this beautiful Christmas, I just want to say how much you mean to me. Your smile lights up my days, and every moment with you feels like magic. Thank you for being you. 🎅🎄
          </p>
          <p className="mt-4 text-base sm:text-lg">
            Wishing you the happiest of holidays, full of love, joy, and laughter. 😊💖
          </p>
          <div className="mt-6">
            <button
              onClick={handleStopMusic}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
