import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
    return stream;
  };

  const startRecording = async () => {
    const stream = await startCamera();
    setRecording(true);
    setTimer(0);
    chunks.current = [];

    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      stream.getTracks().forEach(track => track.stop());
      setRecording(false);
      clearInterval(timerRef.current);
    };

    mediaRecorder.start();
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSubmit = async () => {
    if (!recordedBlob) return;

    setIsSubmitting(true);
    const formData = new FormData();
    const file = new File([recordedBlob], "recorded_video.webm", { type: "video/webm" });
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowModal(false);
      navigate('/recommend', { state: { data: response.data } });
    } catch (err) {
      console.error(err);
      alert('Failed to predict emotion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/search', { state: { query: searchQuery } });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setRecording(false);
    setRecordedBlob(null);
    setTimer(0);
    clearInterval(timerRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Search Header */}
      <header className="bg-gray-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-green-500">Mood Music</h1>
          <div className="flex-1 flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a song..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className={`px-4 py-2 bg-green-600 text-white rounded-lg font-semibold transition duration-200 ${
                !searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-4xl font-semibold mb-4">Discover Music Your Way</h2>
        <p className="text-gray-300 mb-6">
          Search for your favorite songs or let us recommend tracks based on your mood.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 hover:bg-blue-700"
        >
          Get Mood Recommendations
        </button>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">Record Your Mood</h3>
            <div className="relative mb-4">
              <video
                ref={videoRef}
                className="w-full rounded-lg border border-gray-700"
                width="640"
                height="480"
                autoPlay
                muted
              ></video>
              {recording && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full animate-pulse">
                  Recording: {timer}s
                </div>
              )}
            </div>
            {recordedBlob && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-200 mb-2">Preview</h4>
                <video
                  src={URL.createObjectURL(recordedBlob)}
                  className="w-full rounded-lg border border-gray-700"
                  controls
                ></video>
              </div>
            )}
            <div className="flex justify-center space-x-2">
              {!recording && !recordedBlob && (
                <button
                  onClick={startRecording}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 hover:bg-green-700"
                >
                  Start Recording
                </button>
              )}
              {recording && (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 hover:bg-red-700"
                >
                  Stop Recording
                </button>
              )}
              {recordedBlob && (
                <>
                  <button
                    onClick={startRecording}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 hover:bg-gray-500"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Recommendations'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}