import { useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // 動画を選択する関数
  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // 動画の長さが終了時間の初期値に入る関数（動画データが読み込まれたら発火する）
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setEndTime(videoRef.current.duration);
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
          />
          <button className="pick" onClick={handlePickStart}>
            指定
          </button>
          <button className="move">移動</button>
        </div>
        <div className="endTime">
          <p>終了時間 :</p>
          <input type="text" name="end" id="end" value={formatTime(endTime)} />
          <button className="pick" onClick={handlePickEnd}>
            指定
          </button>
          <button className="move">移動</button>
        </div>
        <div className="elapsedTime">
          経過時間：{formatTime(endTime - startTime)}
        </div>
      </div>

      <div className="memoArea">
        <div className="topArea">
          <p>メモ</p>
          <button className="saveScreen">保存用画面</button>
        </div>
        <textarea></textarea>
      </div>
    </>
  );
}

export default App;
