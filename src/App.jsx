import { useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [memo, setMemo] = useState("");

  // 動画を選択する関数
  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoName(file.name);
    }
  };

  // 動画の長さが終了時間の初期値に入る関数（動画データが読み込まれたら発火する）
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setEndTime(videoRef.current.duration);
    }
  };

  // 再生、停止
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // 秒数シークの関数
  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // 動画再生スピードの関数
  const handleSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // 開始時間を取ってくる関数
  const handlePickStart = () => {
    if (videoRef.current) {
      setStartTime(videoRef.current.currentTime);
    }
  };

  // 終了時間を取ってくる関数
  const handlePickEnd = () => {
    if (videoRef.current) {
      setEndTime(videoRef.current.currentTime);
    }
  };

  // 時間に移動する関数
  const handleMove = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // 秒数を0:00表記に変える関数
  const formatTime = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="movieArea">
        <input type="file" accept="video/*" onChange={handleVideoChange} />

        <div className="movieScreen">
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
            />
          )}
        </div>

        <div className="seekButtonArea">
          <button className="seekButton" onClick={() => handleSeek(-60)}>
            -60
          </button>
          <button className="seekButton" onClick={() => handleSeek(-10)}>
            -10
          </button>
          <button className="seekButton" onClick={() => handleSeek(-3)}>
            -3
          </button>
          <button className="seekButtonF" onClick={() => handleSeek(+3)}>
            +3
          </button>
          <button className="seekButtonF" onClick={() => handleSeek(+10)}>
            +10
          </button>
          <button className="seekButtonF" onClick={() => handleSeek(+60)}>
            +60
          </button>
        </div>
        <div className="speedButtonArea">
          <button className="playPauseButton" onClick={handlePlayPause}>
            {isPlaying ? "Ⅱ" : "▶"}
          </button>
          <button className="speedButton" onClick={() => handleSpeed(0.5)}>
            0.5
          </button>
          <button className="speedButton" onClick={() => handleSpeed(0.8)}>
            0.8
          </button>
          <button className="speedButton" onClick={() => handleSpeed(1.0)}>
            1.0
          </button>
          <button className="speedButton" onClick={() => handleSpeed(1.2)}>
            1.2
          </button>
          <button className="speedButton" onClick={() => handleSpeed(1.5)}>
            1.5
          </button>
        </div>
      </div>

      <div className="timeArea">
        <div className="startTime">
          <p>開始時間 :</p>
          <input
            type="text"
            name="start"
            id="start"
            value={formatTime(startTime)}
            readOnly
          />
          <button className="pick" onClick={handlePickStart}>
            指定
          </button>
          <button className="move" onClick={() => handleMove(startTime)}>
            移動
          </button>
        </div>
        <div className="endTime">
          <p>終了時間 :</p>
          <input
            type="text"
            name="end"
            id="end"
            value={formatTime(endTime)}
            readOnly
          />
          <button className="pick" onClick={handlePickEnd}>
            指定
          </button>
          <button className="move" onClick={() => handleMove(endTime)}>
            移動
          </button>
        </div>
        <div className="elapsed-score">
          <div className="elapsedTime">
            経過時間：{formatTime(endTime - startTime)}
          </div>
          <div className="score">
            <span>スコア: </span>
            <input
              type="number"
              name="score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>
        </div>
        <div className="scorePerMinute">
          <span>
            {endTime > startTime
              ? Math.floor((score / (endTime - startTime)) * 60)
              : "0"}{" "}
            / 分
          </span>
        </div>
      </div>

      <div className="memoArea">
        <div className="topArea">
          <p>メモ</p>
          <button className="saveScreen" onClick={() => setShowModal(true)}>
            保存用画面
          </button>
        </div>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        ></textarea>
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>{videoName}</p>
            <div className="flexbox">
              <p>開始時間：{formatTime(startTime)}</p>
              <p>終了時間：{formatTime(endTime)}</p>
            </div>
            <div className="flexbox">
              <p>経過時間：{formatTime(endTime - startTime)}</p>
              <p>スコア：{score}</p>
            </div>

            <p>
              1分あたり：
              {endTime > startTime
                ? Math.floor((score / (endTime - startTime)) * 60)
                : 0}
            </p>
            <div className="modalMemo">{memo}</div>

            <button onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
