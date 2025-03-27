import React, { useState, useEffect } from 'react';
import { Search, Music, User, Play, Pause, LogOut } from 'lucide-react';

// Spotify App Configuration (Replace with your actual credentials)
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = ['user-top-read', 'user-read-private', 'user-read-email'].join('%20');


const SpotifyArtistApp = () => {
  const [token, setToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'top'
  const [selectedAlbum, setSelectedAlbum] = useState(null);


  // Add this component definition near the top of your file (after useState declarations)
const TrackItem = ({ track, index }) => {
  const isCurrentTrack = currentTrack && currentTrack.src === track.preview_url;
  
  return (
    
    <div 
      className="flex items-center p-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
    >
      {/* Track number or equalizer animation */}
      <div className="w-8 flex items-center justify-center">
        {isCurrentTrack && isPlaying ? (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-full h-full flex space-x-1">
              <div className="w-1 h-full bg-spotify-green animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-full bg-spotify-green animate-pulse" style={{ animationDelay: '100ms' }}></div>
              <div className="w-1 h-full bg-spotify-green animate-pulse" style={{ animationDelay: '200ms' }}></div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">{index + 1}</span>
        )}
      </div>
      
      {/* Track info (clickable) */}
      <div 
        className="flex items-center flex-1 ml-2 cursor-pointer"
        onClick={() => handleTrackPlayback(track)}
      >
        <img 
          src={track.album.images?.[2]?.url} 
          alt={track.name} 
          className="w-10 h-10 mr-3 rounded-sm"
        />
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isCurrentTrack ? 'text-spotify-green' : ''}`}>
            {track.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {track.artists.map(a => a.name).join(', ')}
          </p>
        </div>
      </div>
      
      {/* Duration and play button */}
      <div className="flex items-center">
        <span className="text-xs text-gray-400 mr-3">
          {Math.floor(track.duration_ms / 60000)}:
          {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
        </span>
        <button 
          onClick={() => handleTrackPlayback(track)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {isCurrentTrack && isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} />
          )}
        </button>
      </div>
    </div>
  );
};


  // Check for token in URL on initial load
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('spotify_token');

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      
      window.location.hash = '';
      window.localStorage.setItem('spotify_token', token);
    }

    setToken(token);
    
    if (token) {
      fetchUserProfile(token);
      fetchUserTopTracks(token);
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

const featuredAlbums = [
  {
    id: 'album1',
    name: '÷ (Divide)',
    artist: 'Ed Sheeran',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png',
    tracks: [
      { id: 't1', name: 'Shape of You', duration: '3:53', preview_url: 'https://example.com/track1.mp3' },
      { id: 't2', name: 'Perfect', duration: '4:23', preview_url: 'https://example.com/track2.mp3' },
      { id: 't3', name: 'Castle on the Hill', duration: '4:21', preview_url: 'https://example.com/track3.mp3' },
      { id: 't4', name: 'Galway Girl', duration: '2:50', preview_url: 'https://example.com/track4.mp3' },
      { id: 't5', name: 'Happier', duration: '3:27', preview_url: 'https://example.com/track5.mp3' }
    ]
  },
  {
    id: 'album2',
    name: 'After Hours',
    artist: 'The Weeknd',
    image: 'https://www.dolby.com/globalassets/consumer/the-weeknd/the_weeknd.jpg',
    tracks: [
      { id: 't6', name: 'Blinding Lights', duration: '3:20', preview_url: 'https://example.com/track6.mp3' },
      { id: 't7', name: 'Save Your Tears', duration: '3:36', preview_url: 'https://example.com/track7.mp3' },
      { id: 't8', name: 'In Your Eyes', duration: '3:58', preview_url: 'https://example.com/track8.mp3' },
      { id: 't9', name: 'Heartless', duration: '3:18', preview_url: 'https://example.com/track9.mp3' },
      { id: 't10', name: 'Alone Again', duration: '4:10', preview_url: 'https://example.com/track10.mp3' }
    ]
  },
  {
    id: 'album3',
    name: 'Sairat (Original Motion Picture Soundtrack)',
    artist: 'Ajay-Atul',
    image: 'https://m.media-amazon.com/images/M/MV5BNTJmZWM3NWItMWE0MS00NjI1LWI3YjAtM2EzNmY5YmNiYzNjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    tracks: [
      { id: 't11', name: 'Zingaat', duration: '3:50', preview_url: 'https://example.com/track11.mp3' },
      { id: 't12', name: 'Yad Lagla', duration: '4:23', preview_url: 'https://example.com/track12.mp3' },
      { id: 't13', name: 'Sairat Zaala Ji', duration: '5:02', preview_url: 'https://example.com/track13.mp3' },
      { id: 't14', name: 'Atach Baya Ka Baavarla', duration: '4:41', preview_url: 'https://example.com/track14.mp3' },
      { id: 't15', name: 'Aatach Baya Ka Baavarla (Reprise)', duration: '4:19', preview_url: 'https://example.com/track15.mp3' }
    ]
  }
];


  // Fetch user's top tracks
  const fetchUserTopTracks = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUserTopTracks(data.items);
    } catch (error) {
      console.error('Error fetching user top tracks:', error);
    }
  };

  // Search for Artist
  const searchArtist = async () => {
    if (!token) return;

    try {
      // Search for artist
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=artist`, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const searchData = await searchResponse.json();
      const artistResult = searchData.artists.items[0];
      setArtist(artistResult);

      // Fetch top tracks
      const topTracksResponse = await fetch(
        `https://api.spotify.com/v1/artists/${artistResult.id}/top-tracks?market=US`, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const topTracksData = await topTracksResponse.json();
      setTopTracks(topTracksData.tracks);
    } catch (error) {
      console.error('Artist search error:', error);
    }
  };

  // Handle track playback
  const handleTrackPlayback = (track) => {
    if (currentTrack) {
      // If the same track is clicked, toggle play/pause
      if (currentTrack.src === track.preview_url) {
        if (isPlaying) {
          currentTrack.pause();
          setIsPlaying(false);
        } else {
          currentTrack.play();
          setIsPlaying(true);
        }
        return;
      } else {
        // If a different track is clicked, stop the current one
        currentTrack.pause();
      }
    }
    
    // Play the new track
    const audio = new Audio(track.preview_url);
    audio.play();
    setCurrentTrack(audio);
    setIsPlaying(true);
    
    // Handle when the track ends
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  // Logout function
  const logout = () => {
    // 1. Clear local token and state
    setToken('');
    setUserProfile(null);
    window.localStorage.removeItem('spotify_token');
    
    // 2. Stop any playing track
    if (currentTrack) {
      currentTrack.pause();
      setCurrentTrack(null);
    }
  
    // 3. Redirect to Spotify's logout endpoint
    window.location.href = 'https://accounts.spotify.com/en/logout';
    
    // 4. Optional: Redirect back to your app after logout
    setTimeout(() => {
      window.location.href = 'http://localhost:3000'; // Your app's URL
    }, 1000);
  };

  // Login button
  const loginButton = (
    <a 
      href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
    >
      <User className="mr-2" /> Login to Spotify
    </a>
  );

  // Logout button
  const logoutButton = (
    <button 
      onClick={logout}
      //className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
    >
      <LogOut className="mr-2" /> Logout
    </button>
  );


  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 34,
    minutes: 3,
    seconds: 33
  });
  const [darkMode, setDarkMode] = useState(true);


  const AlbumView = ({ album, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-spotify-card-dark rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-spotify-card-dark p-4 flex justify-between items-center border-b border-gray-800">
          <h2 className="text-xl font-bold">{album.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <img 
              src={album.image} 
              alt={album.name} 
              className="w-16 h-16 rounded mr-4"
            />
            <div>
              <h3 className="font-bold">{album.name}</h3>
              <p className="text-gray-400 text-sm">{album.artist}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {album.tracks.map((track) => (
              <div 
                key={track.id}
                className="flex items-center p-2 hover:bg-white hover:bg-opacity-10 rounded cursor-pointer"
                onClick={() => handleTrackPlayback(track)}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-100">{track.name}</p>
                  <p className="text-xs text-gray-400">{track.duration}</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Play size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const { days, hours, minutes, seconds } = prevTime;
        
        // Calculate new time
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        let newDays = days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }

        // Stop timer when countdown finishes
        if (newDays <= 0 && newHours <= 0 && newMinutes <= 0 && newSeconds <= 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return { days: newDays, hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  
  return (
    

    <div className={`flex h-screen ${darkMode ? 'bg-spotify-black text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Sidebar */}
      <div className={`w-64 p-6 ${darkMode ? 'bg-black' : 'bg-gray-100'} flex flex-col`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-spotify-green">Spotify</span>
          </h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <a href="#" className="flex items-center space-x-3 hover:text-white">
                {/* <Home size={20} /> */}
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 hover:text-white">
                <Search size={20} />
                <span>Search</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 hover:text-white">
                {/* <Library size={20} /> */}
                <span>Your Library</span>
              </a>
            </li>
          </ul>
          
          <div className="mt-8">
            <button className="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full px-3 py-1">
              {/* <Plus size={16} /> */}
              <span>Create Playlist</span>
            </button>
            <button className="mt-2 flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full px-3 py-1">
              {/* <Heart size={16} /> */}
              <span>Liked Songs</span>
            </button>
          </div>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-gray-800">
          {token ? logoutButton : loginButton}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className={`sticky top-0 z-10 p-6 ${darkMode ? 'bg-spotify-black bg-opacity-80' : 'bg-white'} backdrop-blur-md`}>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="p-1 rounded-full bg-black bg-opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 rounded-full bg-black bg-opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="relative w-1/3 max-w-md">
              <input
                type="text"
                placeholder="What do you want to play?"
                className={`w-full py-2 px-4 rounded-full ${darkMode ? 'bg-white bg-opacity-10 text-white placeholder-gray-400' : 'bg-gray-100'}`}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
            
  <div className="flex items-center space-x-3">
  
  
  {userProfile && (
    <div className="flex items-center   px-3 py-1 space-x-3">
      {userProfile.images && userProfile.images[0] && (
        <img src={userProfile.images[0].url} alt={userProfile.display_name} className="w-8 h-8 rounded-full" />
      )}
      <div className="flex flex-col">
        <span className="font-medium">{userProfile.display_name}</span>
        <span className="text-sm ">{userProfile.email}</span>
      </div>
    </div>
  )}
  <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-white hover:bg-opacity-10">
    {darkMode ? '☀️' : '🌙'}
  </button>
</div>

          </div>
        </header>

        {/* Countdown Banner */}
        <div className="bg-[#1DB954] text-white rounded-lg p-6 mb-6 text-center 
                    max-w-md mx-auto shadow-lg
                    transform hover:scale-[1.02] transition-transform duration-300
                    animate-fade-in">
      <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
        <Music className="mr-2" /> 
        <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full">
          New Release Coming
        </span>
      </h2>
      
      <div className="mb-4 flex flex-col items-center">
        <div className="flex items-center">
          <img 
            src="https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6" 
            alt="Ed Sheeran" 
            className="w-16 h-16 rounded-full mr-3 border-2 border-white shadow-md
                      animate-float"
          />
          <div className="text-left">
            <p className="font-bold text-lg">Ed Sheeran</p>
            <p className="text-sm opacity-80">Autumn Variations</p>
          </div>
        </div>
      </div>

      <p className="text-lg mb-3">Drops in <span className="font-bold">{timeLeft.days} days</span></p>
      
      <div className="flex justify-center space-x-2 font-mono">
        <div className="bg-black bg-opacity-20 rounded-lg p-2 min-w-[60px]
                      transform hover:-translate-y-1 transition-transform">
          <div className="text-2xl font-bold">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs opacity-80">HOURS</div>
        </div>
        <div className="text-2xl flex items-center pb-4">:</div>
        <div className="bg-black bg-opacity-20 rounded-lg p-2 min-w-[60px]
                      transform hover:-translate-y-1 transition-transform">
          <div className="text-2xl font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs opacity-80">MINUTES</div>
        </div>
        <div className="text-2xl flex items-center pb-4">:</div>
        <div className="bg-black bg-opacity-20 rounded-lg p-2 min-w-[60px]
                      transform hover:-translate-y-1 transition-transform">
          <div className="text-2xl font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs opacity-80">SECONDS</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white border-opacity-20">
        <button className="bg-white text-[#1DB954] px-4 py-1 rounded-full text-sm font-bold
                         transform hover:scale-105 transition-transform
                         flex items-center mx-auto">
          <Play className="mr-1" size={14} /> Remind Me
        </button>
      </div>
    </div>

    <div className="p-6">
  <h2 className="text-xl font-bold mb-4">Featured Albums</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {featuredAlbums.map(album => (
      <div 
        key={album.id}
        className="bg-spotify-card-dark p-3 rounded-lg cursor-pointer hover:bg-spotify-card-darker transition"
        onClick={() => setSelectedAlbum(album)}
      >
        <img 
          src={album.image} 
          alt={album.name} 
          className="w-full aspect-square object-cover mb-2 rounded"
        />
        <h3 className="font-bold text-sm truncate">{album.name}</h3>
        <p className="text-gray-400 text-xs truncate">{album.artist}</p>
      </div>
    ))}
  </div>
</div>


        {/* Your Existing Content */}
        <div className="p-6">
          {/* ... (your existing artist search and tracks content) ... */}
           {/* Tabs for search vs top tracks */}
        {token && (
          <div className="flex border-b mb-4">
            <button 
              className={`py-2 px-4 ${activeTab === 'search' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('search')}
            >
              Artist Search
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'top' ? 'border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('top')}
            >
              Your Top Tracks 
            </button>
          </div>
        )}

        {/* Search tab content */}
        {activeTab === 'search' && (
          <>
            {/* Search Input */}
            <div className="flex mb-4">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for an artist"
                className="flex-grow p-2 border rounded-l-md"
                disabled={!token}
              />
              <button 
                onClick={searchArtist}
                className={`p-2 rounded-r-md flex items-center ${token ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={!token}
              >
                <Search />
              </button>
            </div>

            {/* Artist Information */}
            {artist && (
              <div className="mb-4">
                <div className="flex items-center">
                  {artist.images[0] && (
                    <img 
                      src={artist.images[0].url} 
                      alt={artist.name} 
                      className="w-24 h-24 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{artist.name}</h2>
                    <p className="text-gray-600">Followers: {artist.followers.total.toLocaleString()}</p>
                    <p className="text-gray-600">Genres: {artist.genres.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Artist Top Tracks */}
            {topTracks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Top Tracks</h3>
                <div className="grid gap-2">
                  {topTracks.map((track, index) => (
                    <div 
                      key={track.id} 
                      className="flex items-center bg-gray-50 p-2 rounded hover:bg-gray-100"
                    >
                      <span className="mr-2 text-gray-500">{index + 1}.</span>
                      <img 
                        src={track.album.images[2]?.url} 
                        alt={track.name} 
                        className="w-12 h-12 mr-2"
                      />
                      <div className="flex-grow">
                        <p className="font-medium text-black">{track.name}</p>
                        <p className="text-sm text-gray-600">{track.album.name}</p>
                      </div>
                      {track.preview_url && (
                        <button 
                          onClick={() => handleTrackPlayback(track)}
                          className="text-green-500 hover:text-green-600 p-2"
                        >
                          {currentTrack && currentTrack.src === track.preview_url && isPlaying ? (
                            <Pause />
                          ) : (
                            <Play />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* User Top Tracks tab content */}
        {activeTab === 'top' && userTopTracks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Top Tracks (This is top 10 of {userProfile.display_name} in real time)</h3>
            <div className="grid gap-2">
              {userTopTracks.map((track, index) => (
                <div 
                  key={track.id} 
                  className="flex items-center bg-gray-50 p-2 rounded hover:bg-gray-100"
                >
                  <span className="mr-2 text-gray-500">{index + 1}.</span>
                  <img 
                    src={track.album.images[2]?.url} 
                    alt={track.name} 
                    className="w-12 h-12 mr-2"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-black">{track.name}</p>
                    <p className="text-sm text-gray-600">
                      {track.artists.map(a => a.name).join(', ')}
                    </p>
                  </div>
                  {track.preview_url && (
                    <button 
                      onClick={() => handleTrackPlayback(track)}
                      className="text-green-500 hover:text-green-600 p-2"
                    >
                      {currentTrack && currentTrack.src === track.preview_url && isPlaying ? (
                        <Pause />
                      ) : (
                        <Play />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for top tracks */}
        {activeTab === 'top' && userTopTracks.length === 0 && token && (
          <div className="text-center py-8 text-gray-500">
            <p>No top tracks found. Listen to more music on Spotify!</p>
          </div>
        )}

        </div>
      </div>

      {/* Player Bar */}
      {/* <div className={`fixed bottom-0 left-0 right-0 h-20 ${darkMode ? 'bg-spotify-player-dark' : 'bg-spotify-player-light'} border-t border-gray-800 flex items-center px-4`}> */}
        {/* Player controls would go here */}
        {/* <div className="flex-1 text-center">
          {currentTrack ? (
            <div className="flex items-center justify-center space-x-4">
              <img src={currentTrack.album?.images?.[2]?.url} alt="Album" className="w-12 h-12" />
              <div>
                <div className="font-medium">{currentTrack.name}</div>
                <div className="text-sm text-gray-400">{currentTrack.artists?.map(a => a.name).join(', ')}</div>
              </div>
              <button 
                onClick={() => handleTrackPlayback(currentTrack)}
                className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105"
              >
                {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
              </button>
            </div>
          ) : (
            <div className="text-gray-400">Select a track to play</div>
          )}
        </div>
      </div> */}
      {/* // Then right before your closing </div> in the return, add: */}
{selectedAlbum && (
  <AlbumView 
    album={selectedAlbum} 
    onClose={() => setSelectedAlbum(null)} 
  />
)}
    </div>
  );
};

export default SpotifyArtistApp;