import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function SearchResult() {
  const location = useLocation();
  const { query } = location.state || {};
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      const fetchTracks = async () => {
        try {
          const response = await axios.get('http://localhost:5000/search', {
            params: { query }
          });
          setTracks(response.data.tracks);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch search results.');
        }
      };
      fetchTracks();
    }
  }, [query]);

  if (!query) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-white">No search query provided.</h2>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-white">{error}</h2>
      </div>
    </div>
  );

  const SongCard = ({ track, index }) => (
    <div
      className={`bg-gray-800 rounded-lg shadow-lg p-6 mb-4 flex items-center space-x-4 cursor-pointer transition duration-200 ${
        selectedTrack && selectedTrack.track_id === track.track_id ? 'border-2 border-green-500 bg-gray-700' : 'hover:bg-gray-700'
      }`}
      onClick={() => setSelectedTrack(track)}
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
        <h1 className="text-3xl font-semibold text-white mb-6">Search Results for "{query}"</h1>
        {tracks.length > 0 ? (
          tracks.map((track, i) => (
            <SongCard key={`search-${i}`} track={track} index={i} />
          ))
        ) : (
          <p className="text-gray-300">No results found for "{query}".</p>
        )}
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