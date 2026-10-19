import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Send, Check, AlertCircle } from 'lucide-react';

interface CameraSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraSnapshotModal: React.FC<CameraSnapshotModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access was denied. Please allow camera permissions in your browser.'
          : 'Unable to access camera device. Please check hardware connection.'
      );
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Clean up when closing
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setCameraError(null);
    onClose();
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);

        // Stop video stream after capture
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSend = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="camera-snapshot-modal"
        className="w-full max-w-2xl bg-[#1b1c1c] text-white rounded-3xl shadow-2xl border-2 border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-white/10 bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Camera className="w-6 h-6 text-[#d9e6dc]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">Camera Snapshot</h3>
              <p className="text-xs text-white/70 font-medium">Capture study notes or physical assignments to share</p>
            </div>
          </div>
          <button
            id="close-camera-modal-btn"
            onClick={handleClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Viewfinder Canvas */}
        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-8 text-center text-red-300 max-w-md flex flex-col items-center gap-3">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <p className="text-sm font-semibold">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold rounded-2xl mt-2 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Snapshot"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-6 rounded-2xl flex items-center justify-center">
                <div className="w-14 h-14 border-t-4 border-l-4 border-white/60 absolute top-2 left-2 rounded-tl-lg" />
                <div className="w-14 h-14 border-t-4 border-r-4 border-white/60 absolute top-2 right-2 rounded-tr-lg" />
                <div className="w-14 h-14 border-b-4 border-l-4 border-white/60 absolute bottom-2 left-2 rounded-bl-lg" />
                <div className="w-14 h-14 border-b-4 border-r-4 border-white/60 absolute bottom-2 right-2 rounded-br-lg" />
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Bottom Controls */}
        <div className="p-5 bg-black/70 flex items-center justify-between border-t-2 border-white/10">
          {!capturedImage ? (
            <>
              <button
                onClick={toggleFacingMode}
                className="p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="Switch Camera"
              >
                <RefreshCw className="w-6 h-6" />
              </button>

              <button
                id="take-snapshot-btn"
                onClick={handleTakePhoto}
                disabled={Boolean(cameraError)}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 hover:bg-white/40 active:scale-95 transition-all cursor-pointer disabled:opacity-30 shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-white" />
              </button>

              <div className="w-12" />
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-4">
              <button
                id="retake-snapshot-btn"
                onClick={handleRetake}
                className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Retake Photo
              </button>

              <button
                id="send-snapshot-btn"
                onClick={handleSend}
                className="px-8 py-3.5 rounded-2xl bg-[#008069] hover:bg-[#006a57] text-white text-xs sm:text-sm font-black flex items-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-98"
              >
                <Send className="w-4 h-4" /> Send Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
