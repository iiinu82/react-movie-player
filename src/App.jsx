import { useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [score, setScore] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [memo, setMemo] = useState("");
  const [duration, setDuration] = useState(0);

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
      setDuration(videoRef.current.duration);
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
    const newTime = Math.max(
      0,
      Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + seconds,
      ),
    );

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 動画再生スピードの関数
  const handleSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
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
              onClick={handlePlayPause}
              ref={videoRef}
              src={videoUrl}
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>
        <div className="seekBar">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              const time = Number(e.target.value);
              setCurrentTime(time);
              videoRef.current.currentTime = time;
            }}
          />
          <span>{formatTime(duration)}</span>
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
          <button
            className={`speedButton ${playbackRate === 0.5 ? "selected" : ""}`}
            onClick={() => handleSpeed(0.5)}
          >
            0.5
          </button>

          <button
            className={`speedButton ${playbackRate === 0.8 ? "selected" : ""}`}
            onClick={() => handleSpeed(0.8)}
          >
            0.8
          </button>

          <button
            className={`speedButton ${playbackRate === 1.0 ? "selected" : ""}`}
            onClick={() => handleSpeed(1.0)}
          >
            1.0
          </button>

          <button
            className={`speedButton ${playbackRate === 1.2 ? "selected" : ""}`}
            onClick={() => handleSpeed(1.2)}
          >
            1.2
          </button>

          <button
            className={`speedButton ${playbackRate === 1.5 ? "selected" : ""}`}
            onClick={() => handleSpeed(1.5)}
          >
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
            記録
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
            記録
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
        <div className="scorePerMinuteSaveButtonArea">
          <div className="scorePerMinute">
            <span>
              {endTime > startTime
                ? Math.floor((score / (endTime - startTime)) * 60)
                : "0"}{" "}
              / 分
            </span>
          </div>
          <button className="saveScreen" onClick={() => setShowModal(true)}>
            保存用画面
          </button>
        </div>
      </div>

      <div className="memoArea">
        <div className="topArea">
          <p>メモ📋️</p>
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
              <p>
                開始時間<span>{formatTime(startTime)}</span>
              </p>
              <p>
                終了時間<span>{formatTime(endTime)}</span>
              </p>
            </div>
            <div className="flexbox">
              <p>
                経過時間<span>{formatTime(endTime - startTime)}</span>
              </p>
              <p>
                スコア<span>{score}</span>
              </p>
            </div>

            <p>
              スコア効率
              <span>
                {endTime > startTime
                  ? Math.floor((score / (endTime - startTime)) * 60)
                  : 0}
                /m
              </span>
            </p>
            <div className="modalMemo">
              <p>📋️メモ</p>
              {memo}
            </div>

            <button onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}
      <footer>
        <small>© 2026 T.Kawakatsu · Version 1.0.0</small>
      </footer>
    </>
  );
}

export default App;
