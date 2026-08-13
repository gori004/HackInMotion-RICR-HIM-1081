import { useState, useRef, useCallback, useEffect } from "react";

export default function useMicVisualizer() {
  const [levels, setLevels] = useState(Array(20).fill(4));
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const tick = useCallback(() => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(data);

    const bars = 20;
    const chunk = Math.floor(bufferLength / bars);
    const newLevels = Array.from({ length: bars }, (_, i) => {
      const slice = data.slice(i * chunk, (i + 1) * chunk);
      const avg = slice.reduce((a, b) => a + b, 0) / (slice.length || 1);
      return Math.max(4, Math.round((avg / 255) * 48));
    });

    setLevels(newLevels);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      setIsActive(true);
      tick();
    } catch (err) {
      setError("Couldn't access your microphone. Check browser permissions and try again.");
      setIsActive(false);
    }
  }, [tick]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioCtxRef.current?.close();
    setIsActive(false);
    setLevels(Array(20).fill(4));
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { levels, isActive, error, start, stop };
}