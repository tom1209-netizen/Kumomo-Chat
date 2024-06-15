import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

function AudioRecorder({ onSave }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const canvasRef = useRef(null);

  const visualize = (stream) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      setAudioChunks((prev) => [...prev, event.data]);
    };
    mediaRecorderRef.current.start();
    visualize(stream);
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  const saveRecording = () => {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    onSave(blob);
    setAudioChunks([]);
  };

  return (
    <div style={{
      display: 'flex', gap: '15px', flexDirection: 'column', alignItems: 'center',
    }}
    >
      <div style={{
        display: 'flex', gap: '15px', flexDirection: 'row', alignItems: 'center',
      }}
      >
        <Button type="primary" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Button type="primary" onClick={saveRecording} icon={<SaveOutlined />} disabled={audioChunks.length === 0}>
          Save Recording
        </Button>
      </div>
      <canvas ref={canvasRef} width="500" height="200" style={{ border: '1px solid black', marginTop: '20px', borderRadius: '10px' }} />
    </div>
  );
}

export default AudioRecorder;
