import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RecommendResult() {
  const location = useLocation();
  const { data } = location.state || {};
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handlePlayTrack = (track) => {
    setSelectedTrack(track);
  };

  if (!data) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold text-white">No data found.</h2>
      </div>
    </div>
  );

  const SongCard = ({ track, index }) => (
    <div
      className={`bg-gray-800 rounded-lg shadow-lg p-6 mb-4 transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer flex items-center space-x-4 ${
        selectedTrack && selectedTrack.track_id === track.track_id ? 'border-2 border-green-500 bg-gray-700' : ''
      }`}
      onClick={() => handlePlayTrack(track)}
      style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both` }}
    >
      <div className="flex-shrink-0">
        {selectedTrack && selectedTrack.track_id === track.track_id ? (
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg text-white">{track.track_name}</h3>
        <p className="text-sm text-gray-400">{track.artists}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 pb-24">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Emotion: <span className="text-green-500">{data.predicted_emotion}</span>
          </h1>
          <p className="text-gray-300">Click a song to play it below and elevate your mood.</p>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-4">Mood-Fitting Songs</h2>
        {data.mood_fitting_recommendations.map((track, i) => (
          <SongCard key={`fit-${i}`} track={track} index={i} />
        ))}

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Mood-Lifting Songs</h2>
        {data.mood_lifting_recommendations.map((track, i) => (
          <SongCard key={`lift-${i}`} track={track} index={i} />
        ))}
      </div>
      {selectedTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 shadow-lg z-10">
          <div className="max-w-4xl mx-auto flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{selectedTrack.track_name}</h4>
              <p className="text-sm text-gray-400 truncate">{selectedTrack.artists}</p>
            </div>
            <div className="flex-shrink-0 w-full max-w-[500px]">
              <iframe
                src={`https://open.spotify.com/embed/track/${selectedTrack.track_id}?autoplay=1`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="spotify-player"
                className="rounded-md"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}