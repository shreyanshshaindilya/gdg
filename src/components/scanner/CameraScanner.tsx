import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, RefreshCw, AlertCircle, Zap, ZapOff } from 'lucide-react';

interface CameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (err: unknown) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScanSuccess, onScanError }) => {
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'html5-qr-reader-container';

  // Discover available camera devices
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back/environment camera if available
          const backCam = devices.find(
            (d) =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('environment') ||
              d.label.toLowerCase().includes('rear')
          );
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          setErrorMsg('No camera detected on this system.');
        }
      })
      .catch((err) => {
        console.error('Camera enumeration error:', err);
        setErrorMsg('Camera access was denied or is unavailable. Please grant camera permission.');
        onScanError?.(err);
      });

    return () => {
      stopScanner();
    };
  }, []);

  // Start or switch scanner when selected camera changes
  useEffect(() => {
    if (selectedCameraId) {
      startScanner(selectedCameraId);
    }
  }, [selectedCameraId]);

  const startScanner = async (cameraId: string) => {
    try {
      setErrorMsg(null);
      if (scannerRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode(readerElementId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          // Play subtle audio beep on scan
          try {
            const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
          } catch {
            // Audio context not available
          }

          onScanSuccess(decodedText);
        },
        () => {
          // Frame parsed without QR code
        }
      );

      setIsScanning(true);

      // Check if torch/flashlight capability is present
      try {
        const capabilities = html5QrCode.getRunningTrackCapabilities();
        if (capabilities && 'torch' in capabilities) {
          setHasTorch(true);
        }
      } catch {
        setHasTorch(false);
      }
    } catch (err: unknown) {
      console.error('Failed to start scanner:', err);
      setIsScanning(false);
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(
        message.includes('NotAllowedError') || message.includes('Permission')
          ? 'Camera permission denied. Please allow camera access in your browser settings.'
          : 'Unable to start camera stream. Ensure no other app is using the webcam.'
      );
      onScanError?.(err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Failed to stop camera stream gracefully:', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return;
    try {
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      });
      setTorchOn(!torchOn);
    } catch (err) {
      console.error('Torch toggle failed:', err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Scanner Viewport Frame */}
      <div className="relative w-full max-w-md aspect-square bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700/60 shadow-2xl flex items-center justify-center">
        {/* Html5Qrcode video inject container */}
        <div id={readerElementId} className="w-full h-full object-cover" />

        {/* Viewfinder Overlay with Animated Laser Line */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
            <div className="relative w-64 h-64 border-2 border-dashed border-indigo-400/80 rounded-2xl">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />

              {/* Scanning Laser Beam */}
              <div className="scan-line animate-scan" />
            </div>
          </div>
        )}

        {/* Error / Permission Alert Overlay */}
        {errorMsg && (
          <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs">{errorMsg}</p>
            {cameras.length > 0 && (
              <button
                onClick={() => startScanner(selectedCameraId)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Camera Controls Bar */}
      <div className="w-full max-w-md flex items-center justify-between space-x-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <Camera className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            disabled={cameras.length === 0}
            className="w-full text-xs font-medium bg-transparent text-slate-700 dark:text-slate-300 truncate focus:outline-none cursor-pointer"
          >
            {cameras.length === 0 ? (
              <option>No cameras found</option>
            ) : (
              cameras.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-slate-800">
                  {c.label || `Camera ${c.id.slice(0, 6)}`}
                </option>
              ))
            )}
          </select>
        </div>

        {hasTorch && (
          <button
            onClick={toggleTorch}
            className={`p-2 rounded-xl transition ${
              torchOn
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Toggle Flashlight / Torch"
          >
            {torchOn ? <Zap className="w-4 h-4 fill-amber-500" /> : <ZapOff className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
