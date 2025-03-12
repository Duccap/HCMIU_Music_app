


function loadPage(page) {
  fetch(page)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      document.querySelector("main").innerHTML = html;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// Get the menu open and close buttons
const menuOpenButton = document.getElementById("toggleSidebar");

// Get the sidebar
const sidebar = document.querySelector(".container .sidebar");

// Add event listeners to the buttons
menuOpenButton.addEventListener("click", function () {
  if (
    sidebar.style.transform === "translateX(-100%)" ||
    sidebar.style.transform === ""
  ) {
    sidebar.style.transform = "translateX(0)"; // Show the sidebar
  } else {
    sidebar.style.transform = "translateX(-100%)"; // Hide the sidebar
  }
});


// Lấy tham chiếu đến thẻ main và header
var main = document.querySelector("main");
var header = document.querySelector("main header");

// Thêm sự kiện scroll cho thẻ main
main.addEventListener("scroll", function () {
  // Kiểm tra nếu thẻ main được scroll xuống
  if (main.scrollTop > 0) {
    // Thêm class 'scrolled' vào header
    header.classList.add('scrolled');
  } else {
    // Xóa class 'scrolled' khỏi header
    header.classList.remove('scrolled');
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Check if access token is available
  const accessToken = getCookie("access_token");
  if (!accessToken) {
    console.log("No access token found");
    return;
  }

  // Function to get cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Fetch user's playlists
  fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const playlistContainer = document.getElementById("playlist-container");
      data.items.forEach((playlist) => {
        const div = document.createElement("div");
        div.textContent = playlist.name;
        playlistContainer.appendChild(div);
      });
    })
    .catch((error) => console.log(error));
});


// Khai báo biến toàn cục để quản lý access token và thời gian hết hạn
let accessToken = null;
let tokenExpirationTime = null;

// Hàm kiểm tra xem token đã hết hạn chưa bằng cách so sánh thời gian hiện tại với thời điểm hết hạn.
function isTokenExpired() {
  const now = new Date();
  return now >= tokenExpirationTime;
}
// === GLOBAL VARIABLES === //
let isRepeating = false;
let isPlaying = false;
let isCustomEnabled = false;
let isLyricsVisible = false;
let spotifyPlayer = null;
let deviceId = null;


// Khởi tạo Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
  const userAccessToken = getUserAccessToken();
  if (!userAccessToken) {
      console.error('User needs to be logged in to initialize player');
      return;
  }

  spotifyPlayer = new Spotify.Player({
      name: 'HCMIU Music Player',
      getOAuthToken: cb => { cb(userAccessToken); },
      volume: 0.5
  });

  // Error handling
  spotifyPlayer.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize', message);
  });

  spotifyPlayer.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate', message);
  });

  spotifyPlayer.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account', message);
  });

  spotifyPlayer.addListener('playback_error', ({ message }) => {
      console.error('Failed to perform playback', message);
  });

  // Playback status updates
  spotifyPlayer.addListener('player_state_changed', state => {
      if (state) {
          updatePlayerUIFromState(state);
      }
  });

  // Ready
  spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      deviceId = device_id;
      
      // Set this device as active
      setActiveDevice(device_id);
  });

  // Connect to the player
  spotifyPlayer.connect();
};
// Hàm bất đồng bộ để lấy access token từ Spotify. Sử dụng Client Credentials flow để xác thực.
async function getSpotifyAccessToken() {
  const clientId = "1825746372a54d109f5b454536f999ab"; // ID của client
  const clientSecret = "214b213916b04801809c7e7c824bd898";
  const authString = btoa(`${clientId}:${clientSecret}`); // mã hóa base 64

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    accessToken = data.access_token; // Lưu access token
    const now = new Date();
    tokenExpirationTime = new Date(now.getTime() + data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
}

// Hàm bất đồng bộ để đảm bảo rằng access token luôn sẵn sàng và chưa hết hạn trước khi thực hiện yêu cầu.
async function ensureAccessToken() {
  if (!accessToken || isTokenExpired()) {
    accessToken = await getSpotifyAccessToken(); // Lấy mới token nếu cần
  }
  return accessToken;
}

// Hàm lấy user access token từ localStorage
function getUserAccessToken() {
  return localStorage.getItem("userAccessToken");
}

// Hàm bất đồng bộ để gọi API Spotify với access token. Xử lý trường hợp token hết hạn và gọi lại API.
async function callSpotifyAPI(url) {
  const accessToken = await ensureAccessToken(); // Đảm bảo có accessToken hợp lệ
  const userAccessToken = getUserAccessToken(); // Lấy userAccessToken từ localStorage

  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userAccessToken || accessToken}`, // Ưu tiên sử dụng userAccessToken nếu có
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      // Token hết hạn, lấy lại accessToken mới
      accessToken = await getSpotifyAccessToken();
      response = await callSpotifyAPI(url); // Gọi lại API với token mới
    }

    return await response.json(); // Trả về dữ liệu JSON từ phản hồi
  } catch (error) {
    console.error("API call error:", error);
    return null;
  }
}

// Kiểm tra và lấy token khi khởi động
getSpotifyAccessToken().then((accessToken) => {
  if (accessToken) {
    console.log("Token was successfully retrieved:", accessToken);
  } else {
    console.log("Failed to retrieve access token.");
  }
});


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('musicLink').addEventListener('click', loadMusicContent);
});

async function loadMusicContent() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    console.error('Main element not found');
    return;
  }
  mainElement.innerHTML = ''; // Xóa nội dung hiện tại

  // Thêm thẻ wrapper
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'music-content-wrapper';

  // Gọi API của Spotify để lấy thông tin playlist
  const playlists = await fetchSpotifyPlaylists();

  // Tạo nội dung cho mục "Music"
  const musicContent = `
    <div class="music-header">
      <h1>Music</h1>
      <p>Discover new music</p>
    </div>
    <div class="music-list">
      ${playlists.map(playlist => `
        <div class="music-item" data-playlist-id="${playlist.id}">
          <img src="${playlist.images[0].url}" alt="${playlist.name}">
          <h3>${playlist.name}</h3>
          <p>${playlist.description}</p>
        </div>
      `).join('')}
    </div>
  `;

  wrapperDiv.innerHTML = musicContent;
  mainElement.appendChild(wrapperDiv);

  // Thêm sự kiện click cho mỗi playlist
  document.querySelectorAll('.music-item').forEach(item => {
    item.addEventListener('click', async () => {
      const playlistId = item.getAttribute('data-playlist-id');
      const playlist = await fetchPlaylistById(playlistId); // Giả sử bạn có hàm này để lấy chi tiết playlist
      if (playlist) {
        displayPlaylistDetails(playlist); // Gọi hàm displayPlaylistDetails
      } else {
        console.error('Failed to fetch playlist details');
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('profileLink').addEventListener('click', loadProfileContent);
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('profileLink').addEventListener('click', loadProfileContent);
});

async function loadProfileContent() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    console.error('Main element not found');
    return;
  }
  mainElement.innerHTML = ''; // Xóa nội dung hiện tại

  const userProfile = await fetchUserProfile();
  if (!userProfile) {
    console.error('Failed to fetch user profile');
    return;
  }

  // Tạo nội dung cho mục "Profile"
  const profileContent = `
    <div class="profile-wrapper">
      <div class="profile-header">
        <h1>Profile</h1>
        <p>Manage your profile and settings</p>
      </div>
      <div class="profile-details">
        <div class="profile-card">
          <img src="${userProfile.images[0]?.url || 'default-profile.png'}" alt="User Profile">
          <h3>${userProfile.display_name}</h3>
          <p>Email: ${userProfile.email}</p>
          <p>Country: ${userProfile.country}</p>
          <p>Followers: ${userProfile.followers.total}</p>
        </div>
        <div class="profile-card">
          <h2>Subscription</h2>
          <p>Plan: ${userProfile.product}</p>
          <p>Next Billing Date: 8/1/24</p>
          <p>Payment Method: MoMo wallet</p>
        </div>
        <div class="profile-card">
          <h2>Account</h2>
          <button>Edit Profile</button>
          <button>Recover Playlists</button>
        </div>
      </div>
    </div>
  `;

  mainElement.innerHTML = profileContent;
}

async function fetchUserProfile() {
  const accessToken = await ensureAccessToken(); // Đảm bảo có accessToken hợp lệ
  const url = 'https://api.spotify.com/v1/me'; // Endpoint để lấy thông tin người dùng

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
    }

    const userProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null; // Trả về null nếu có lỗi
  }
}
async function fetchPlaylistById(playlistId) {
  const accessToken = await ensureAccessToken(); // Đảm bảo có accessToken hợp lệ
  const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist details: ${response.status} ${response.statusText}`);
    }

    const playlistDetails = await response.json();
    return playlistDetails;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    return null; // Trả về null nếu có lỗi
  }
}

async function fetchSpotifyPlaylists() {
  const accessToken = await ensureAccessToken(); // Giả sử bạn đã có hàm này để lấy accessToken
  const url = 'https://api.spotify.com/v1/browse/featured-playlists';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.playlists.items;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

async function loadProfileContent() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    console.error('Main element not found');
    return;
  }
  mainElement.innerHTML = ''; // Xóa nội dung hiện tại

  const userProfile = await fetchUserProfile();
  if (!userProfile) {
    console.error('Failed to fetch user profile');
    return;
  }

  // Tạo nội dung cho mục "Profile"
  const profileContent = `
    <div class="profile-header">
      <h1>Profile</h1>
      <p>Manage your profile and settings</p>
    </div>
    <div class="profile-details">
      <div class="profile-item">
        <img src="${userProfile.images[0].url}" alt="User Profile">
        <h3>${userProfile.display_name}</h3>
        <p>Email: ${userProfile.email}</p>
        <p>Country: ${userProfile.country}</p>
        <p>Followers: ${userProfile.followers.total}</p>
      </div>
    </div>
  `;

  mainElement.innerHTML = profileContent;
}
async function fetchUserProfile() {
  const accessToken = await getUserAccessToken(); // Đảm bảo có accessToken hợp lệ
  const url = 'https://api.spotify.com/v1/me'; // Endpoint để lấy thông tin người dùng

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
    }

    const userProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null; // Trả về null nếu có lỗi
  }
}
















//HOME PAGE//
document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = await ensureAccessToken();

  // Gọi API để lấy thông tin bài hát "Attention"
  const song = await fetchSongInfo(accessToken, "5cF0dROlMOK5uNZtivgu50"); // Đảm bảo ID này là ID của bài hát "Attention"
  if (song) {
    updateTrendingSong(song);
  } else {
    console.error("No song data available");
  }
});

async function fetchSongInfo(accessToken, songId) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${songId}`, // Sử dụng biến songId để truy vấn thông tin bài hát
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch song info");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching song info:", error);
    return null;
  }
}

function updateTrendingSong(song) {
  
  if (!song) {
    console.error("No song data to update");
    return;
  }

  const trendingDiv = document.querySelector(".trending .info");
  trendingDiv.querySelector("h2").textContent = song.name;
  trendingDiv.querySelector("h4").textContent = song.artists
    .map((artist) => artist.name)
    .join(", ");
  trendingDiv.querySelector("h5").textContent = `${song.popularity} Plays`;
  document.querySelector(".trending img").src = song.album.images[0].url;

  // Thêm sự kiện cho nút "Listen Now"
  const listenNowButton = trendingDiv.querySelector(".buttons button");
  listenNowButton.addEventListener("click", () => {
    playTrackAndUpdateUI(song); // Gọi hàm playTrackAndUpdateUI với thông tin bài hát
  });
  // Tạo và thêm nút "Like"
  const likeButtonContainer = trendingDiv.querySelector(".like-button-container");
  addLikeButton(song, likeButtonContainer); // Gọi hàm addLikeButton

}


async function fetchGenres() {
  const accessToken = await ensureAccessToken(); // Giả sử bạn đã có hàm này để lấy accessToken
  const url = 'https://api.spotify.com/v1/browse/categories';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.categories.items;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const genres = await fetchGenres();
  displayGenres(genres);
});

function displayGenres(genres) {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = ''; // Xóa các mục hiện tại

  genres.forEach(genre => {
    const genreDiv = document.createElement('div');
    genreDiv.className = 'item';
    genreDiv.style.backgroundColor = getRandomColorGenre(); // Áp dụng màu ngẫu nhiên
    genreDiv.innerHTML = `<p>${genre.name}</p>`;
    genreDiv.addEventListener('click', async () => {
      const playlists = await fetchCategoryPlaylists(genre.id);
      if (playlists.length > 0) {
        displayPlaylistDetails(playlists[0]); // Hiển thị chi tiết playlist đầu tiên
      } else {
        console.error('No playlists found for this category');
      }
    });
    itemsContainer.appendChild(genreDiv);
  });
}


let currentTracks = [];


async function displayPlaylistDetails(playlist) {
  const tracks = await fetchPlaylistTracks(playlist.id);
  currentTracks = tracks; // Lưu trữ danh sách các track hiện tại
  currentTrackIndex = 0; // Đặt lại chỉ số bài hát hiện tại

  const mainElement = document.querySelector('main');
  mainElement.innerHTML = ''; // Xóa nội dung hiện tại

  // Thêm thẻ wrapper
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'playlist-details-wrapper';

  // Hiển thị thông tin chi tiết của playlist
  const playlistDetails = document.createElement('div');
  playlistDetails.className = 'playlist-details';
  playlistDetails.innerHTML = `
    <img src="${playlist.images[0].url}" alt="${playlist.name}">
    <h2>${playlist.name}</h2>
    <p>By ${playlist.owner.display_name} • ${playlist.tracks.total} songs</p>
  `;
  wrapperDiv.appendChild(playlistDetails);

  // Kiểm tra xem playlist đã được lưu chưa và cập nhật nút "Save Playlist"
  const isPlaylistSaved = await checkIfPlaylistSaved(playlist.id);
  const saveButton = document.createElement('button');
  saveButton.textContent = isPlaylistSaved ? 'Unsave Playlist' : 'Save Playlist';
  saveButton.addEventListener('click', async () => {
    if (isPlaylistSaved) {
      await removeFromSavedPlaylists(playlist.id);
    } else {
      await addToSavedPlaylists(playlist.id);
    }
    saveButton.textContent = isPlaylistSaved ? 'Save Playlist' : 'Unsave Playlist';
  });
  playlistDetails.appendChild(saveButton);

  // Hiển thị danh sách các track
  const trackList = document.createElement('div');
  trackList.className = 'track-list';
  tracks.forEach((track, index) => {
    const trackDiv = document.createElement('div');
    trackDiv.className = 'track-item';
    trackDiv.innerHTML = `<span>${track.name} by ${track.artists.map(artist => artist.name).join(', ')}</span>`;
    addLikeButton(track, trackDiv);
    addPlaylistDropdown(track, trackDiv);
    trackDiv.addEventListener('click', () => {
      currentTrackIndex = index; // Cập nhật chỉ số bài hát hiện tại
      playTrackAndUpdateUI(track);
    });

    const rgbColor = getRandomRGBValue();
    trackDiv.addEventListener('mouseover', () => {
      setRandomBackgroundColor(trackDiv, rgbColor);
    });
    trackDiv.addEventListener('mouseleave', () => {
      resetBackgroundColor(trackDiv);
    });

    trackList.appendChild(trackDiv);
  });
  wrapperDiv.appendChild(trackList);

  mainElement.appendChild(wrapperDiv);

  // Gắn sự kiện cho các nút Previous và Next
  document.getElementById('previousIcon').addEventListener('click', playPreviousTrack);
  document.getElementById('nextIcon').addEventListener('click', playNextTrack);
}

function getRandomRGBValue() {
  const colors = ['#476a8a', '#a69984', '#a24c34', '#0d4045', '#a67894', '#5547a5'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function setRandomBackgroundColor(element, color) {
  element.style.backgroundColor = color;
}

function resetBackgroundColor(element) {
  element.style.backgroundColor = '';
}

function playTrackAndUpdateUI(track) {
  // Giả sử bạn đang phát track và cập nhật UI tại đây
  console.log("Playing track:", track.name);

  // Cập nhật giao diện người dùng với thông tin bài hát
  document.querySelector('.player .track-name').textContent = track.name;
  document.querySelector('.player .artist-name').textContent = track.artists.map(artist => artist.name).join(', ');
  document.querySelector('.player .album-name').textContent = track.album.name;
  document.querySelector('.player .album-art').src = track.album.images[0].url;
}

function playNextTrack() {
  if (currentTrackIndex < currentTracks.length - 1) {
    currentTrackIndex++;
    playTrackAndUpdateUI(currentTracks[currentTrackIndex]);
  } else {
    console.log('This is the last track in the playlist.');
  }
}

function playPreviousTrack() {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
    playTrackAndUpdateUI(currentTracks[currentTrackIndex]);
  } else {
    console.log('This is the first track in the playlist.');
  }
}

async function fetchPlaylistTracks(playlistId) {
  const accessToken = await ensureAccessToken();
  if (!accessToken) {
    console.error("Access token is required to call Spotify API");
    return [];
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tracks for playlist " + playlistId);
    }

    const data = await response.json();
    return data.items.map(item => item.track);
  } catch (error) {
    console.error("Error fetching tracks for playlist " + playlistId + ":", error);
    return [];
  }
}

function getRandomColorGenre() {
  const colors = ['#476a8a', '#a69984', '#a24c34', '#0d4045', '#a67894', '#5547a5'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// TOP SONGS //
async function fetchArtistsTopTracks(artistId) {
  const accessToken = await ensureAccessToken();
  if (!accessToken) {
    console.error("Access token is required to call Spotify API");
    return [];
  }

  const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top tracks for artist ${artistId}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error(`Error fetching top tracks for artist ${artistId}:`, error);
    return [];
  }
}

async function displayArtistsTopTracks(artistId) {
  const topTracks = await fetchArtistsTopTracks(artistId);
  const topTracksContainer = document.querySelector('.music-list .items');

  if (!topTracksContainer) {
    console.error("Top songs container not found in the DOM");
    return;
  }

  topTracksContainer.innerHTML = ''; // Xóa các mục hiện tại

  topTracks.forEach((track, index) => {
    const trackDiv = document.createElement('div');
    trackDiv.className = 'item';
    trackDiv.innerHTML = `
      <div class="info">
        <p>${index + 1}</p>
        <img src="${track.album.images[0].url}" alt="${track.name}" />
        <div class="details">
          <h5>${track.name}</h5>
          <p>${track.artists.map(artist => artist.name).join(', ')}</p>
        </div>
      </div>
     
    `;
    const action = document.createElement("div")
    action.classList.add("actions")
    action.innerHTML = `
    <p>${formatDuration(track.duration_ms)}</p>
    <div class="icon">
      <i class="bx bxs-right-arrow play-button" data-track-uri="${track.uri}"></i>
    </div>
    `
    addLikeButton(track, action);
    trackDiv.appendChild(action)
    topTracksContainer.appendChild(trackDiv);

    // Thêm nút like sử dụng hàm addLikeButton

    
  });
  
  // Thêm sự kiện onclick vào nt phát nhạc
  document.querySelectorAll('.play-button').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const trackUri = event.target.getAttribute('data-track-uri');
      const track = topTracks.find(t => t.uri === trackUri);
      await playTrackAndUpdateUI(track);

      // Thay đổi trạng thái nút play thành pause
      document.querySelectorAll('.play-button').forEach(btn => {
        if (btn.getAttribute('data-track-uri') === trackUri) {
          btn.classList.remove('bxs-right-arrow');
          btn.classList.add('bxs-pause');
        } else {
          btn.classList.remove('bxs-pause');
          btn.classList.add('bxs-right-arrow');
        }
      });
    });
  });
}

// Gọi hàm để hiển thị top songs khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
  const artistId = '4dpARuHxo51G3z768sgnrY'; // ID của nghệ sĩ
  displayArtistsTopTracks(artistId);
});




function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const artistId = '4dpARuHxo51G3z768sgnrY'; // Thay thế bằng ID thực tế của nghệ sĩ
  displayArtistsTopTracks(artistId);
});

function createCacheKey(query, filters) {
  const baseKey = `search-${query}`;
  const filterKey = filters.join("-");
  return `${baseKey}-${filterKey}`;
}
function cacheResults(key, results) {
  localStorage.setItem(key, JSON.stringify(results));
}

function getCachedResults(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

let currentResults = {};

async function searchSpotify() {
  const query = document.getElementById("searchQuery").value;
  const filters = []; // Giả sử bạn có một cách để lấy các filters từ UI
  const key = createCacheKey(query, filters);
  let results = getCachedResults(key);

  if (!results) {
    const accessToken = await ensureAccessToken();
    if (!accessToken) {
      console.error("Access token is required to call Spotify API");
      return;
    }

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album,artist,playlist&limit=5`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      results = await response.json();
      cacheResults(key, results); // Lưu trữ kết quả vào cache
    } catch (error) {
      console.error("Error calling Spotify search API:", error);
    }
  }

  currentResults = results; // Cập nhật currentResults

  // Tải trang kết quả tìm kiếm vào phần main
  loadSearchResultsPage(results);
}

function loadSearchResultsPage(results) {
  const main = document.querySelector("main");
  fetch("/search-results") // Đường dẫn đến trang kết quả tìm kiếm
    .then((response) => response.text())
    .then((html) => {
      main.innerHTML = html;
      displayAllResults(results); // Hiển thị kết quả tìm kiếm trong trang mới
    })
    .catch((error) => {
      console.error("Error loading search results page:", error);
    });
}

function createIframe(item, type) {
  let src;
  switch (type) {
    case "tracks":
      src = `https://open.spotify.com/embed/track/${item.id}`;
      break;
    case "albums":
      src = `https://open.spotify.com/embed/album/${item.id}`;
      break;
    case "artists":
      src = `https://open.spotify.com/embed/artist/${item.id}`;
      break;
    case "playlists":
      src = `https://open.spotify.com/embed/playlist/${item.id}`;
      break;
    default:
      console.error("Unknown type:", type);
      return;
  }

  const iframe = document.createElement("iframe");
  iframe.style.borderRadius = "12px";
  iframe.src = src;
  iframe.width = "100%";
  iframe.height = "352";
  iframe.frameBorder = "0";
  iframe.allowFullscreen = "";
  iframe.allow =
    "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  iframe.loading = "lazy";

  return iframe;
}
//randomize sắc màu
function getRandomRGBValue() {
  const red =  Math.floor(Math.random() * 256);
  const green =  Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return`rgb(${red}, ${green}, ${blue})`;
}
//này trả về string chứa mã màu rgb  ví dụ "rgb(255, 255, 255)"

function setRandomBackgroundColor(element, rgbColor) { 
  element.style.backgroundColor = rgbColor;
}
function resetBackgroundColor(element) {
element.style.backgroundColor = 'transparent';
}



function filterResults(type) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (type === "all") {
    displayAllResults(currentResults);
  } else {
    const filteredItems = currentResults[type]
      ? currentResults[type].items
      : [];
    if (filteredItems.length > 0) {
      filteredItems.forEach((item) => {
        const iframe = createIframe(item, type);
        resultsDiv.appendChild(iframe);
      });
    } else {
      resultsDiv.innerHTML = `<p>No results found for ${type}.</p>`; // Hiển thị thông báo không có kết quả
    }
  }
}

async function navigateToArtist(artistId) {
  try {
    // Gọi API để lấy thông tin nghệ sĩ
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch artist");
    }

    const artist = await response.json();
    displayArtistInfo(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
  }
}
function displayAllResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Top result
  if (data.artists && data.artists.items.length > 0) {
    const topArtist = data.artists.items[0];
    const topResultDiv = document.createElement("div");
    topResultDiv.classList.add("top-result");
    topResultDiv.innerHTML = `
      <h2>Top result</h2>
      <div class="top-artist" data-id="${topArtist.id}">
        <img src="${topArtist.images && topArtist.images[0] ? topArtist.images[0].url : "default-image-url"}" alt="${topArtist.name}">
        <div>
          <h3>${topArtist.name}</h3>
          <p>Artist</p>
        </div>
      </div>
    `;
    resultsDiv.appendChild(topResultDiv);

    // Add click event for top result
    topResultDiv.querySelector(".top-artist").addEventListener("click", () => {
      navigateToArtist(topArtist.id);
    });
  }

  // Songs
  if (data.tracks && data.tracks.items.length > 0) {
    const songsDiv = document.createElement("div");
    songsDiv.classList.add("songs");
    songsDiv.innerHTML = "<h2>Songs</h2>";
    const songItemContainer = document.createElement("div");
    songItemContainer.classList.add("song-item-container");
    data.tracks.items.forEach((track) => {
      const songItem = document.createElement("div");
      songItem.classList.add("song-item");
      songItem.style="padding:1em;border-radius:10px;"
      //random ra màu
      const rgbColor = getRandomRGBValue()
      // set hover thì cài background-color cho element đó
      songItem.addEventListener('mouseover', (e)=>{setRandomBackgroundColor(songItem, rgbColor)});
      songItem.addEventListener('mouseleave', (e)=>{resetBackgroundColor(songItem)});
      songItem.innerHTML = `
      <div class="top">
          <img src="${track.album.images && track.album.images[0] ? track.album.images[0].url : "default-image-url"}" alt="${track.name}">
          <div>
            <h3>${track.name}</h3>
            <p>${track.artists.map((artist) => artist.name).join(", ")}</p>
          </div>
          </div>
        
      `;
      const right = document.createElement("div");
      right.classList.add("bottom");
      
      right.innerHTML = `
      <div>
        <p>${formatDuration(track.duration_ms)}</p>
        </div>
      `;
      songItem.appendChild(right);
      addLikeButton(track,right);
      addPlaylistDropdown(track, right);
      songItem.appendChild(right);
      songItemContainer.appendChild(songItem);

      // Add click event for song
      songItem.addEventListener("click", () => {
        playTrackAndUpdateUI(track);
      });
    });
    songsDiv.appendChild(songItemContainer);
    resultsDiv.appendChild(songsDiv);
  }

  // Artists
  if (data.artists && data.artists.items.length > 0) {
    const artistsDiv = document.createElement("div");
    artistsDiv.classList.add("artists");
    artistsDiv.innerHTML = "<h2>Artists</h2>";

    const artistContainer = document.createElement("div")
    
    data.artists.items.forEach((artist) => {
      const artistItem = document.createElement("div");
      artistItem.style="padding:1em;border-radius:10px;border-top-left-radius:50%;border-top-right-radius:50%;"
      const rgbColor = getRandomRGBValue()
      artistItem.addEventListener('mouseover', (e)=>{setRandomBackgroundColor(artistItem, rgbColor)});
      artistItem.addEventListener('mouseleave', (e)=>{resetBackgroundColor(artistItem)});

      artistItem.classList.add("artist-item");
      artistItem.innerHTML = `
        <img src="${artist.images && artist.images[0] ? artist.images[0].url : "default-image-url"}" alt="${artist.name}">
        <h3>${artist.name}</h3>
      `;
      artistContainer.appendChild(artistItem);

      // Add click event for artist
      artistItem.addEventListener("click", () => {
        displayArtistInfo(artist);
      });
    });
    artistsDiv.appendChild(artistContainer)
    resultsDiv.appendChild(artistsDiv);
  }

  // Albums
  if (data.albums && data.albums.items.length > 0) {
    const albumsDiv = document.createElement("div");
    albumsDiv.classList.add("albums");
    albumsDiv.innerHTML = "<h2>Albums</h2>";

    const albumContainer = document.createElement("div")
    data.albums.items.forEach((album) => {
      const albumItem = document.createElement("div");
      albumItem.style="padding:1em;border-radius:10px;";
      const rgbColor = getRandomRGBValue()
      albumItem.addEventListener('mouseover', (e)=>{setRandomBackgroundColor(albumItem, rgbColor)});
      albumItem.addEventListener('mouseleave', (e)=>{resetBackgroundColor(albumItem)});
      albumItem.classList.add("album-item");

      albumItem.innerHTML = `
        <img src="${album.images && album.images[0] ? album.images[0].url : "default-image-url"}" alt="${album.name}">
        <div>
          <h3 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${album.name}</h3>
          <p>${album.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
      `;
      albumContainer.appendChild(albumItem);

      // Add click event for album
      albumItem.addEventListener("click", () => {
        displayAlbumInfo(album.id);
      });
    });
    albumsDiv.appendChild(albumContainer)
    resultsDiv.appendChild(albumsDiv);
  }

  // Playlists
  if (data.playlists && data.playlists.items.length > 0) {
    const playlistsDiv = document.createElement("div");
    playlistsDiv.classList.add("playlists");
    playlistsDiv.innerHTML = "<h2>Playlists</h2>";
    const playlistContainer = document.createElement("div")
    data.playlists.items.forEach((playlist) => {
      const playlistItem = document.createElement("div");
      playlistItem.style="padding:1em;border-radius:10px;"
      const rgbColor = getRandomRGBValue()
      playlistItem.addEventListener('mouseover', (e)=>{setRandomBackgroundColor(playlistItem, rgbColor)});
      playlistItem.addEventListener('mouseleave', (e)=>{resetBackgroundColor(playlistItem)});
      playlistItem.classList.add("playlist-item");
      playlistItem.innerHTML = `
        <img src="${playlist.images && playlist.images[0] ? playlist.images[0].url : "default-image-url"}" alt="${playlist.name}">
        <div>
          <h3 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${playlist.name}</h3>
          <p>By ${playlist.owner.display_name}</p>
        </div>
      `;
      playlistContainer.appendChild(playlistItem);

      // Add click event for playlist
      playlistItem.addEventListener("click", () => {
        displayPlaylistInfo(playlist.id);
      });
    });
    playlistsDiv.appendChild(playlistContainer)
    resultsDiv.appendChild(playlistsDiv);
  }
}

// sau khi search all client muốn xem thông tin của nghệ sĩ
async function displayArtistInfo(artist) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
    <div class="artist-info">
      <img src="${artist.images && artist.images[0] ? artist.images[0].url : "default-image-url"}" alt="${artist.name}">
      <h1>${artist.name}</h1>
      <p class="followers">${artist.followers.total.toLocaleString()} monthly listeners</p>
      <p class="genres">${artist.genres.join(", ")}</p>
      <button class="follow-artist-button"><i class='bx bx-plus-circle' style='color:#ffffff'></i> Follow</button>

      <div class="popular-tracks">
        <h2>Popular</h2>
        <div id="popular-tracks"></div>
      </div>
    </div>
  `;

  try {
    const accessToken = await ensureAccessToken();
    if (!accessToken) {
      console.error("User access token is required");
      return;
    }

    const topTracksResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!topTracksResponse.ok) {
      throw new Error("Failed to fetch top tracks");
    }

    const topTracksData = await topTracksResponse.json();

    currentTrackList = topTracksData.tracks;
    currentTrackIndex = 0;
    currentListType = "artist";

    const popularTracksDiv = document.getElementById("popular-tracks");
    topTracksData.tracks.forEach((track, index) => {
      const trackItem = document.createElement("div");
      trackItem.classList.add("track-item");
      trackItem.innerHTML = `
        <div class="track-index">${index + 1}</div>
        <img src="${track.album.images && track.album.images[0] ? track.album.images[0].url : "default-image-url"}" alt="${track.name}">
        <div class="track-info">
          <h3>${track.name}</h3>
          <p>${track.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
        <div class="track-plays">${track.popularity.toLocaleString()}</div>
        <div class="track-duration">${formatDuration(track.duration_ms)}</div>
      `;
      popularTracksDiv.appendChild(trackItem);

      // Add like button and playlist dropdown to each track
      addLikeButton(track, trackItem);
      addPlaylistDropdown(track, trackItem);
      trackItem.addEventListener("click", () => {
        currentTrackIndex = index; // Cập nhật bài hát hiện tại
        playTrackAndUpdateUI(track);
      });
    });

    // Kiểm tra trạng thái follow của nghệ sĩ
    const userAccessToken = getUserAccessToken(); // Ensure you have this function to get userAccessToken
    if (!userAccessToken) {
      console.error("User access token is required for personal data");
      return;
    }
    const followStatusResponse = await fetch(
      `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artist.id}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );

    if (!followStatusResponse.ok) {
      throw new Error("Failed to check follow status");
    }

    const isFollowing = await followStatusResponse.json();
    const followButton = document.querySelector(".follow-artist-button");
    followButton.innerHTML = `<i class='bx ${isFollowing[0] ? "bx-check-circle" : "bx-plus-circle"}' style='color:#ffffff'></i> ${isFollowing[0] ? "Following" : "Follow"}`;

    // Thêm sự kiện click cho nút follow/unfollow
    followButton.addEventListener("click", async () => {
      const newIsFollowing = await toggleFollowArtist(
        artist.id,
        isFollowing[0],
        userAccessToken,
      );
      followButton.innerHTML = `<i class='bx ${newIsFollowing ? "bx-check-circle" : "bx-plus-circle"}' style='color:#ffffff'></i> ${newIsFollowing ? "Following" : "Follow"}`;
      isFollowing[0] = newIsFollowing; // Cập nhật trạng thái follow
    });
  } catch (error) {
    console.error("Error fetching artist info:", error);
  }
}

async function toggleFollowArtist(artistId, isFollowing, userAccessToken) {
  const method = isFollowing ? "DELETE" : "PUT";
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`,
      {
        method: method,
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to ${isFollowing ? "unfollow" : "follow"} artist.`,
      );
    }

    return !isFollowing; // Trả về trạng thái mới
  } catch (error) {
    console.error(
      `Error ${isFollowing ? "unfollowing" : "following"} artist:`,
      error,
    );
    return isFollowing; // Trả về trạng thái cũ nếu có lỗi
  }
}

async function displayAlbumInfo(albumId) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch album details");
    }

    const album = await response.json();

    // Lưu trữ danh sách các bài hát trong album
    currentTrackList = album.tracks.items;
    currentTrackIndex = 0;
    currentListType = "album";

    // Create album info HTML
    const albumInfoDiv = document.createElement("div");
    albumInfoDiv.className = "album-info";
    albumInfoDiv.innerHTML = `
      <img src="${album.images && album.images[0] ? album.images[0].url : "default-image-url"}" alt="${album.name}">
      <div>
        <h1>${album.name}</h1>
        <p>${album.artists.map((artist) => artist.name).join(", ")}</p>
        <p>${album.release_date}</p>
        <p>${album.total_tracks} songs, ${formatDuration(album.tracks.items.reduce((acc, track) => acc + track.duration_ms, 0))}</p>
        <button class="save-album-button"><i class='bx bx-plus-circle' style='color:#ffffff'></i> Save Album</button>
      </div>
    `;

    // Append album info to results div
    resultsDiv.appendChild(albumInfoDiv);

    // Create tracks list container
    const tracksListDiv = document.createElement("div");
    tracksListDiv.className = "tracks-list";
    album.tracks.items.forEach((track, index) => {
      const trackItem = document.createElement("div");
      trackItem.className = "track-item";
      trackItem.innerHTML = `
        <div class="track-index">${index + 1}</div>
        <div class="track-info">
          <div class="track-title">${track.name}</div>
          <div class="track-artists">${track.artists.map((artist) => artist.name).join(", ")}</div>
          <div class="track-duration">${formatDuration(track.duration_ms)}</div>
        </div>
      `;

      // Append track item to tracks list
      tracksListDiv.appendChild(trackItem);

      // Add like button and playlist dropdown to each track
      addLikeButton(track, trackItem);
      addPlaylistDropdown(track, trackItem);

      // Add click event to play track and update UI
      trackItem.addEventListener("click", () => {
        currentTrackIndex = index; // Cập nhật bài hát hiện tại
        playTrackAndUpdateUI(track);
      });
    });

    // Append tracks list to results div
    resultsDiv.appendChild(tracksListDiv);
    // Add save album button logic
    addSaveAlbumButton(albumId);
  } catch (error) {
    console.error("Error fetching album details:", error);
  }
}
async function displayPlaylistInfo(playlistId) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Kiểm tra xem dữ liệu playlist đã được lưu trong localStorage chưa
  const cachedPlaylist = localStorage.getItem(`playlist_${playlistId}`);
  if (cachedPlaylist) {
    const playlist = JSON.parse(cachedPlaylist);
    renderPlaylistDetails(playlist);
    return;
  }

  try {
    const accessToken = await ensureAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist details: ${response.status} ${response.statusText}`);
    }

    const playlist = await response.json();

    // Lưu trữ dữ liệu playlist vào localStorage để sử dụng lại
    localStorage.setItem(`playlist_${playlistId}`, JSON.stringify(playlist));

    renderPlaylistDetails(playlist);
  } catch (error) {
    console.error("Error fetching playlist info:", error);
  }
}

function renderPlaylistDetails(playlist) {
  const resultsDiv = document.getElementById("results");
  const playlistInfoDiv = document.createElement("div");
  playlistInfoDiv.className = "playlist-info";
  playlistInfoDiv.innerHTML = `
    <div class="playlist-header">
      <img src="${playlist.images && playlist.images[0] ? playlist.images[0].url : "default-image-url"}" alt="${playlist.name}">
      <div class="playlist-details">
        <h1>${playlist.name}</h1>
        <p>By ${playlist.owner.display_name}</p>
        <p>${playlist.followers.total} likes • ${playlist.tracks.total} songs</p>
        <button class="save-playlist-button"><i class='bx bx-plus-circle' style='color:#ffffff'></i> Save Playlist</button>
      </div>
    </div>
    <div class="playlist-tracks">
      <h2>Tracks</h2>
      <div class="tracks-list"></div>
    </div>
  `;

  // Append playlist info to results div
  resultsDiv.appendChild(playlistInfoDiv);

  // Save playlist info to localStorage when clicked
  playlistInfoDiv.addEventListener('click', () => {
    localStorage.setItem(`playlist_${playlist.id}`, JSON.stringify(playlist));
    console.log("Playlist information saved to localStorage.");
  });

  // Handle tracks list
  const tracksListDiv = playlistInfoDiv.querySelector(".tracks-list");
  playlist.tracks.items.forEach((item, index) => {
    const track = item.track;
    const trackItem = document.createElement("div");
    trackItem.className = "track-item";
    trackItem.innerHTML = `
      <div class="track-index">${index + 1}</div>
      <div class="track-info">
        <div class="track-title">${track.name}</div>
        <div class="track-artists">${track.artists.map((artist) => artist.name).join(", ")}</div>
        <div class="track-duration">${formatDuration(track.duration_ms)}</div>
      </div>
    `;

    // Append track item to tracks list
    tracksListDiv.appendChild(trackItem);

    // Add like button and playlist dropdown to each track
    addLikeButton(track, trackItem);
    addPlaylistDropdown(track, trackItem);

    // Add click event to play track and update UI
    trackItem.addEventListener("click", () => {
      playTrackAndUpdateUI(track);
    });
  });

  // Check if playlist is saved and update button text
  const saveButton = playlistInfoDiv.querySelector('.save-playlist-button');
  const userAccessToken = getUserAccessToken(); // Get user access token
  checkIfPlaylistSaved(playlist.id, userAccessToken).then(isSaved => {
    if (isSaved) {
      saveButton.innerHTML = "<i class='bx bx-minus-circle' style='color:#ffffff'></i> Unsave Playlist";
    } else {
      saveButton.innerHTML = "<i class='bx bx-plus-circle' style='color:#ffffff'></i> Save Playlist";
    }
  });

  // Add click event to save/unsave playlist
  saveButton.addEventListener('click', () => {
    checkIfPlaylistSaved(playlist.id, userAccessToken).then(isSaved => {
      if (isSaved) {
        removeFromSavedPlaylists(playlist.id, userAccessToken).then(() => {
          saveButton.innerHTML = "<i class='bx bx-plus-circle' style='color:#ffffff'></i> Save Playlist";
          alert("Playlist removed from your library.");
        });
      } else {
        addToSavedPlaylists(playlist.id, userAccessToken).then(() => {
          saveButton.innerHTML = "<i class='bx bx-minus-circle' style='color:#ffffff'></i> Unsave Playlist";
          alert("Playlist added to your library.");
        });
      }
    });
  });
}
async function checkIfPlaylistSaved(playlistId, userAccessToken) {
  if (!userAccessToken) {
    console.error("User access token is required to check if playlist is saved");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user's playlists: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const isSaved = data.items.some(playlist => playlist.id === playlistId);
    return isSaved;
  } catch (error) {
    console.error("Error checking if playlist is saved:", error);
    return false; // Assume not saved if there's an error
  }
}
async function addToSavedPlaylists(playlistId, userAccessToken) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to save playlist");
    }

    console.log("Playlist saved successfully");
  } catch (error) {
    console.error("Error saving playlist:", error);
  }
}

async function removeFromSavedPlaylists(playlistId, userAccessToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to unsave playlist");
    }

    console.log("Playlist unsaved successfully");
  } catch (error) {
    console.error("Error unsaving playlist:", error);
  }
}


async function checkUserSavedTracks(trackIds) {
  const userAccessToken = getUserAccessToken();

  if (!userAccessToken) {
    alert("User access token is required to check saved tracks");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to check saved tracks");
    }

    return await response.json(); // Trả về mảng các giá trị boolean
  } catch (error) {
    console.error("Error checking saved tracks:", error);
    return [];
  }
}

async function removeFromLikedSongs(trackId) {
  const userAccessToken = getUserAccessToken();

  if (!userAccessToken) {
    alert("User access token is required to remove from Liked Songs");
    return;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );

    if (response.status === 200) {
      alert("Removed from Liked Songs");
      return true; // Trả về true để chỉ ra rằng xóa thành công
    } else {
      alert("Failed to remove from Liked Songs");
      return false; // Trả về false nếu xóa không thành công
    }
  } catch (error) {
    console.error("Error removing from Liked Songs:", error);
    return false;
  }
}

async function addToLikedSongs(trackId) {
  const userAccessToken = getUserAccessToken();

  if (!userAccessToken) {
    alert("User access token is required to add to Liked Songs");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );

    if (response.status === 200) {
      alert("Added to Liked Songs");
      return true; // Trả về true để chỉ ra rằng thêm thành công
    } else {
      alert("Failed to add to Liked Songs");
      return false;
    }
  } catch (error) {
    console.error("Error adding to Liked Songs:", error);
    return false;
  }
}

// Ví dụ: Gọi hàm addToLikedSongs khi người dùng nhấn vào nút "like"
document.querySelectorAll(".like-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const trackId = event.target.getAttribute("data-track-id");
    addToLikedSongs(trackId);
  });
});

// Hàm này mục đích là thêm button like vào bài hát, kiểm tra xem bài hát đã được like chưa, nếu chưa like thì thêm button like, nếu đã like thì thêm button unlike
// Dùng lại hàm này rất nhiều lần để áp dụng cho tất cả các track
function addLikeButton(track, trackElement) {
  const likeButton = document.createElement("button");
  likeButton.style="border:none;background-color:transparent;"
  const likeIcon = document.createElement("i");
  likeIcon.className = "bx bxs-heart"; // Mặc định là chưa được like
  likeButton.appendChild(likeIcon);

  likeButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    const isLiked = likeIcon.classList.contains("bxs-heart");
    if (isLiked) {
      const success = await removeFromLikedSongs(track.id);
      if (success) {
        likeIcon.className = "bx bx-heart"; // Thay đổi icon nếu xóa thành công
      }
    } else {
      const success = await addToLikedSongs(track.id);
      if (success) {
        likeIcon.className = "bx bxs-heart"; // Thay đổi icon nếu thêm thành công
      }
    }
  });

  // Kiểm tra trạng thái lưu trữ của bài hát
  checkUserSavedTracks([track.id]).then((results) => {
    likeIcon.className = results[0] ? "bx bxs-heart" : "bx bx-heart";
  });

  trackElement.appendChild(likeButton);
}

async function addToPlaylist(trackId, playlistId) {
  const userAccessToken = getUserAccessToken();
  if (!userAccessToken) {
    alert("User access token is required to add to playlist");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${trackId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      alert("Added to playlist");
      return true;
    } else {
      alert("Failed to add to playlist");
      return false;
    }
  } catch (error) {
    console.error("Error adding to playlist:", error);
    return false;
  }
}

async function removeFromPlaylist(trackId, playlistId) {
  const userAccessToken = getUserAccessToken();
  if (!userAccessToken) {
    alert("User access token is required to remove from playlist");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracks: [{ uri: `spotify:track:${trackId}` }],
        }),
      },
    );

    if (response.ok) {
      alert("Removed from playlist");
      return true;
    } else {
      alert("Failed to remove from playlist");
      return false;
    }
  } catch (error) {
    console.error("Error removing from playlist:", error);
    return false;
  }
}

async function fetchUserPlaylists() {
  const userAccessToken = getUserAccessToken();
  if (!userAccessToken) {
    alert("User access token is required to fetch playlists");
    return [];
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlists");
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}
async function addPlaylistDropdown(track, trackElement) {
  const playlists = await fetchUserPlaylists();
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown-container");

  const dropdownButton = document.createElement("button");
  dropdownButton.classList.add("dropdown-button");
  dropdownButton.innerHTML = `<i class='bx bxs-message-square-add' style='color:rgba(218,232,233,0.68)'></i>`;
  dropdownContainer.appendChild(dropdownButton);

  const dropdownMenu = document.createElement("div");
  dropdownMenu.classList.add("dropdown-menu");
  dropdownContainer.appendChild(dropdownMenu);

  playlists.forEach((playlist) => {
    const option = document.createElement("div");
    option.classList.add("dropdown-item");
    option.innerHTML = `
      <input type="checkbox" id="playlist-${playlist.id}" value="${playlist.id}">
      <label for="playlist-${playlist.id}">${playlist.name}</label>
    `;
    dropdownMenu.appendChild(option);

    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", async (event) => {
      if (event.target.checked) {
        await addToPlaylist(track.id, playlist.id);
      } else {
        await removeFromPlaylist(track.id, playlist.id);
      }
    });
  });

  trackElement.appendChild(dropdownContainer);

  // Toggle dropdown menu visibility
  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });
}

// add save album button logic
async function addSaveAlbumButton(albumId) {
  const saveButton = document.querySelector(".save-album-button");
  if (!saveButton) {
    console.error("Save button not found in the DOM");
    return;
  }

  const userAccessToken = getUserAccessToken();
  if (!userAccessToken) {
    alert("User access token is required to save album");
    return;
  }

  let isSaved = false; // Biến để theo dõi trạng thái lưu của album

  // Kiểm tra xem album đã được lưu hay chưa và cập nhật biểu tượng
  async function updateSaveStatus() {
    try {
      const checkResponse = await fetch(
        `https://api.spotify.com/v1/me/albums/contains?ids=${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );

      if (!checkResponse.ok) {
        throw new Error("Failed to check if album is saved");
      }

      isSaved = (await checkResponse.json())[0];
      const icon = saveButton.querySelector("i");

      if (isSaved) {
        icon.className = "bx bxs-check-circle";
        saveButton.innerHTML = `<i class='bx bxs-check-circle' style='color:#ffffff'></i> Saved Album`;
      } else {
        icon.className = "bx bx-plus-circle";
        saveButton.innerHTML = `<i class='bx bx-plus-circle' style='color:#ffffff'></i> Save Album`;
      }
    } catch (error) {
      console.error("Error checking if album is saved:", error);
    }
  }

  await updateSaveStatus(); // Gọi lần đầu để thiết lập trạng thái ban đầu

  // Thêm sự kiện click để lưu hoặc xóa album
  saveButton.addEventListener("click", async () => {
    if (isSaved) {
      const success = await removeFromSavedAlbums(albumId, userAccessToken);
      if (success) {
        isSaved = false; // Cập nhật trạng thái sau khi xóa thành công
        updateSaveStatus(); // Cập nhật biểu tượng và nội dung nút
      }
    } else {
      const success = await addToSavedAlbums(albumId, userAccessToken);
      if (success) {
        isSaved = true; // Cập nhật trạng thái sau khi lưu thành công
        updateSaveStatus(); // Cập nhật biểu tượng và nội dung nút
      }
    }
  });
}

async function addToSavedAlbums(albumId, userAccessToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/albums?ids=${albumId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      alert("Album đã được lưu thành công.");
      return true;
    } else {
      alert("Không thể lưu album.");
      return false;
    }
  } catch (error) {
    console.error("Error adding album to saved albums:", error);
    return false;
  }
}

async function removeFromSavedAlbums(albumId, userAccessToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/albums?ids=${albumId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      alert("Album đã được xóa khỏi danh sách lưu.");
      return true;
    } else {
      alert("Không thể xóa album.");
      return false;
    }
  } catch (error) {
    console.error("Error removing album from saved albums:", error);
    return false;
  }
}

document.getElementById("loginWithSpotify").addEventListener("click", () => {
  const clientId = "1825746372a54d109f5b454536f999ab";
  const redirectUri = "http://localhost:3000/callback"; // URL này sẽ xử lý việc lưu trữ access token
  const scopes = [
    "user-library-modify",
    "user-library-read",
    "playlist-read-private",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-follow-read",
    "user-follow-modify",
    "user-top-read",
    "user-read-recently-played",
    "streaming",
    "app-remote-control",
  ].join(" ");

  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = authUrl;
});

async function getCurrentPlaybackTime() {
  const accessToken = await getUserAccessToken(); // Lấy user access token

  const response = await fetch("https://api.spotify.com/v1/me/player", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch current playback state");
    return 0;
  }

  const data = await response.json();
  return data.progress_ms; // Thời gian phát hiện tại (milliseconds)
}

function updateProgressBar(trackDuration) {
  const progressBar = document.querySelector(".progress-bar");

  const updateProgress = async () => {
    const currentTime = await getCurrentPlaybackTime();
    progressBar.value = currentTime; // Cập nhật giá trị của thanh tiến trình bằng mili giây
    document.querySelector(".start-time").textContent =
      formatDuration(currentTime);
  };

  // Cập nhật thanh tiến trình mỗi giây
  setInterval(updateProgress, 1000);
  document.querySelector(".progress-bar").addEventListener("input", (event) => {
    const progressBar = event.target;
    const newTime = parseInt(progressBar.value, 10); // Giá trị trực tiếp là mili giây
    document.querySelector(".start-time").textContent = formatDuration(newTime);
    console.log("Progress Bar Value:", progressBar.value); // In ra giá trị hiện tại của thanh tiến trình
    console.log("New Time Calculated:", newTime); // In ra thời gian mới tính toán được
  });

  document
    .querySelector(".progress-bar")
    .addEventListener("change", async (event) => {
      const progressBar = event.target;
      const newTime = parseInt(progressBar.value, 10); // Giá trị trực tiếp là mili giây
      await seekToPosition(newTime);
      console.log("Progress Bar Value:", progressBar.value); // In ra giá trị hiện tại của thanh tiến trình
      console.log("New Time Calculated:", newTime); // In ra thời gian mới tính toán được
    });
}

async function seekToPosition(positionMs, deviceId = null) {
  const accessToken = getUserAccessToken(); // Giả sử bạn đã có hàm lấy accessToken
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  positionMs = Math.round(positionMs);

  const queryParams = new URLSearchParams({
    position_ms: positionMs,
  });

  if (deviceId) {
    queryParams.append("device_id", deviceId);
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/seek?${queryParams.toString()}`,
      {
        method: "PUT",
        headers: headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to seek: ${response.status}`);
    }
  } catch (error) {
    console.error("Error seeking position", error);
  }
}

//Skip dựa trên album, playlist hoặc artist
async function playTrackAndUpdateUI(track) {
  if (currentListType === "artist") {
    // Giả sử track là một đối tượng từ top tracks của nghệ sĩ
    await playTrack(track.uri);
  } else if (currentListType === "album") {
    // Giả sử track là một đối tượng từ album
    await playTrack(track.uri);
  } else if (currentListType === "playlist") {
    // Giả sử track là một đối tượng từ playlist
    await playTrack(track.track.uri);
  }
  updatePlayerUI(track.id);
}
async function updatePlayerUI(trackId) {
  const accessToken = await getUserAccessToken(); // Lấy user access token

  // Lấy thông tin bài hát từ Spotify API
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch track information");
    return;
  }

  const track = await response.json();

  // Cập nhật UI
  document.querySelector(".song-info img").src = track.album.images[0].url;
  document.querySelector(".description h3").textContent = track.name;
  document.querySelector(".description h5").textContent = track.artists
    .map((artist) => artist.name)
    .join(", ");
  document.querySelector(".description p").textContent = track.album.name;
  document.querySelector(".start-time").textContent = "00:00";
  document.querySelector(".end-time").textContent = formatDuration(
    track.duration_ms,
  );

  // Cập nhật thanh tiến trình
  const progressBar = document.querySelector(".progress-bar");
  progressBar.setAttribute("max", track.duration_ms);
  updateProgressBar(track.duration_ms);
}

async function playTrack(trackUri) {
  if (!deviceId) {
      console.error('No device ID available');
      return;
  }

  // Sử dụng SDK thay vì gọi API trực tiếp
  if (spotifyPlayer) {
      try {
          await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${getUserAccessToken()}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  uris: [trackUri]
              })
          });
      } catch (error) {
          console.error('Error playing track:', error);
      }
  }
}
function updatePlayPauseIcon(isPlaying) {
  const playPauseIcon = document.getElementById("playPauseIcon");
  playPauseIcon.className = isPlaying ? "bx bx-pause" : "bx bxs-right-arrow";
}
document.getElementById("playPauseIcon").addEventListener("click", async () => {
  const playPauseIcon = document.getElementById("playPauseIcon");
  const isPlaying = playPauseIcon.classList.contains("bx-pause");

  if (isPlaying) {
    await pauseTrack();
    updatePlayPauseIcon(false); // Cập nhật biểu tượng khi track dừng
  } else {
    await resumeTrack();
    updatePlayPauseIcon(true); // Cập nhật biểu tượng khi track phát
  }
});
async function pauseTrack() {
  const accessToken = await getUserAccessToken(); // Lấy user access token

  const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to pause track");
  }
}

async function resumeTrack() {
  const accessToken = await getUserAccessToken(); // Lấy user access token

  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to resume track");
  }
}
document.getElementById("repeatIcon").addEventListener("click", async () => {
  const repeatIcon = document.getElementById("repeatIcon");
  const isRepeating = repeatIcon.classList.contains("active");

  if (isRepeating) {
    await setRepeatMode("off");
    repeatIcon.classList.remove("active");
  } else {
    await setRepeatMode("track");
    repeatIcon.classList.add("active");
  }
});
async function setRepeatMode(state) {
  const accessToken = await getUserAccessToken(); // Lấy user access token

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    console.error("Failed to set repeat mode");
  }
}
document.getElementById("nextIcon").addEventListener("click", async () => {
  await skipToNext();
});

document.getElementById("previousIcon").addEventListener("click", async () => {
  await skipToPrevious();
});
async function skipToNext() {
  if (!currentTrackList || currentTrackList.length === 0) {
      console.log("No track list available");
      return;
  }

  if (currentTrackIndex < currentTrackList.length - 1) {
      currentTrackIndex++;
      let nextTrack = currentTrackList[currentTrackIndex];
      if (currentListType === "playlist") {
          nextTrack = nextTrack.track;
      }
      await playTrackAndUpdateUI(nextTrack);
  } else {
      console.log("This is the last track in the list.");
  }
}

async function skipToPrevious() {
  if (!currentTrackList || currentTrackList.length === 0) {
      console.log("No track list available");
      return;
  }

  if (currentTrackIndex > 0) {
      currentTrackIndex--;
      let previousTrack = currentTrackList[currentTrackIndex];
      if (currentListType === "playlist") {
          previousTrack = previousTrack.track;
      }
      await playTrackAndUpdateUI(previousTrack);
  } else {
      console.log("This is the first track in the list.");
  }
}

document.getElementById("volume-icon").addEventListener("click", () => {
  const volumeControl = document.getElementById("volumeControl");
  volumeControl.style.display =
    volumeControl.style.display === "block" ? "none" : "block";
});

document
  .getElementById("volumeControl")
  .addEventListener("input", async (event) => {
    const volume = event.target.value;
    setVolume(volume);
  });

async function setVolume(volumePercent) {
  const accessToken = await getUserAccessToken(); // Giả sử bạn đã có hàm lấy accessToken
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}`,
      {
        method: "PUT",
        headers: headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to set volume: ${response.status}`);
    }
  } catch (error) {
    console.error("Error setting volume", error);
  }
}


// Hàm để phát bài hát và cập nhật UI !!!!!!!!!!!!!!!!1
async function playTrackAndUpdateUI(track) {
  await playTrack(track.uri);
  updatePlayerUI(track.id);
  updatePlayPauseIcon(true); // Cập nhật biểu tượng khi track được phát
  // Cập nhật giao diện với thông tin chi tiết của bài hát
}


document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.sidebar .menu ul li a');
  
  menuItems.forEach(item => {
    item.addEventListener('click', async (event) => {
      event.preventDefault();
      const section = item.getAttribute('data-section');
      await loadSectionData(section);
    });
  });
});
// Thêm biến để lưu trữ tracks của playlist hiện tại
let currentTrackList = [];
let currentTrackIndex = -1;
let currentListType = null;
async function loadSectionData(section) {
  const accessToken =  getUserAccessToken();
  if (!accessToken) {
    console.error("Access token is required to call Spotify API");
    return;
  }

  let url;
  switch (section) {
    case 'explore':
      url = `https://api.spotify.com/v1/browse/new-releases`;
      break;
    case 'genres':
      url = `https://api.spotify.com/v1/browse/categories`;
      break;
    case 'albums':
      url = `https://api.spotify.com/v1/me/albums`;
      break;
    case 'artists':
      url = `https://api.spotify.com/v1/me/following?type=artist`;
      break;
    case 'podcasts':
      url = `https://api.spotify.com/v1/shows`;
      break;
    case 'recents':
      url = `https://api.spotify.com/v1/me/player/recently-played`;
      break;
    case 'favourites':
      url = `https://api.spotify.com/v1/me/tracks`;
      break;
    case 'Best of playlist':
      url = `https://api.spotify.com/v1/playlists/57EG9lWmdn7HHofXuQVsow`;
      break;
      case 'my-playlists':
      url = `https://api.spotify.com/v1/me/playlists`;
      break;
    default:
      console.error("Unknown section:", section);
      return;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data for section " + section);
    }

    const data = await response.json();
    // Nếu là playlist, lưu tracks vào currentTrackList
    if (section === 'Best of playlist') {
      currentTrackList = data.tracks.items;
      currentListType = "playlist";
      currentTrackIndex = -1; // Reset index
  }

    displaySectionData(data, section);
  } catch (error) {
    console.error("Error fetching data for section " + section + ":", error);
  }
}



function displaySectionData(data, section) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Xóa kết quả trước

  if (section === 'explore' || section === 'genres' || section === 'made-for-you' || section === 'albums' || section === 'artists' || section === 'recents' || section === 'favourites' || section === 'Best of playlist' || section === 'Best of 2022' || section === 'my-playlists') {
    resultsDiv.classList.add('explore-layout'); // Thêm class cho layout

    // Thêm header
    const header = document.createElement('h2');
    header.textContent = section === 'explore' ? "New Releases" : (section === 'genres' ? "Genres" : (section === 'made-for-you' ? "Made For You" : (section === 'albums' ? "My Albums" : (section === 'artists' ? "My Artists" : (section === 'recents' ? "Recently Played" : (section === 'favourites' ? "Favourites" : (section === 'Best of playlist' ? "Best of playlist" : (section === 'Best of 2022' ? "Best of 2022" : (section === 'my-playlists' ? "My Playlists" : "")))))))));
    header.className = 'section-header';
    resultsDiv.appendChild(header);

    if (section === 'Best of playlist') {
      displayPlaylistInfo('57EG9lWmdn7HHofXuQVsow'); // ID của playlist "Best of playlist"
    } else if (section === 'Best of 2022') {
      displayPlaylistInfo('37i9dQZF1DX7DJr8fImN7B'); // ID của playlist "Best of 2022"
    } else if (section === 'my-playlists') {
      displayMyPlaylists(data.items);
    } else if (section === 'albums') {
      displaySavedAlbums(data);
    } else if (section === 'artists') {
      displayFollowedArtists(data.artists.items);
    } else if (section === 'recents') {
      displayRecentlyPlayed(data.items);
    } else if (section === 'favourites') {
      displayLikedSongs(data.items);
    } else {
      const items = section === 'explore' ? data.albums.items : (section === 'genres' ? data.categories.items : []);
      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'category-item';
        itemDiv.style.backgroundColor = getRandomColor();
        itemDiv.innerHTML = `
          <img src="${item.icons ? item.icons[0].url : item.images[0].url}" alt="${item.name}">
          <p>${item.name}</p>
        `;
        itemDiv.addEventListener('click', async () => {
          if (section === 'explore') {
            displayAlbumInfo(item.id);
          } else {
            const playlists = await fetchCategoryPlaylists(item.id);
            if (playlists.length > 0) {
              displayPlaylistInfo(playlists[0].id);
            }
          }
        });
        resultsDiv.appendChild(itemDiv);
      });
    }
  } else {
    resultsDiv.classList.remove('explore-layout'); // Xóa class nếu không áp dụng
  }
}

function displayMyPlaylists(playlists) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.classList.add('my-playlists-section'); // Thêm class cho phần my playlists
  resultsDiv.innerHTML = '<h2>My Playlists</h2>';

  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("my-playlists-wrapper");

  const playlistsDiv = document.createElement("div");
  playlistsDiv.classList.add("playlists");

  playlists.forEach(playlist => {
    const playlistItem = document.createElement("div");
    playlistItem.classList.add("playlist-item");
    const rgbColor = getRandomRGBValue();
    playlistItem.innerHTML = `
      <div class="playlist-image-container">
        <img src="${playlist.images[0]?.url || 'default-image-url.jpg'}" alt="${playlist.name}">
      </div>
      <div class="playlist-info">
        <h3>${playlist.name}</h3>
        <p>${playlist.description || 'No description available'}</p>
      </div>
    `;
    playlistItem.addEventListener('click', () => {
      displayPlaylistInfo(playlist.id);
    });
    playlistItem.addEventListener('mouseover', () => {
      setRandomBackgroundColor(playlistItem, rgbColor);
    });
    playlistItem.addEventListener('mouseleave', () => {
      resetBackgroundColor(playlistItem);
    });
    playlistsDiv.appendChild(playlistItem);
  });

  wrapperDiv.appendChild(playlistsDiv);
  resultsDiv.appendChild(wrapperDiv);
}

function getRandomRGBValue() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function setRandomBackgroundColor(element, color) {
  element.style.backgroundColor = color;
}

function resetBackgroundColor(element) {
  element.style.backgroundColor = '';
}


function displayLikedSongs(items) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.classList.add('liked-songs-section'); // Thêm class cho phần liked songs
  resultsDiv.innerHTML = '<h2>Liked Songs</h2>';

  const songsDiv = document.createElement("div");
  songsDiv.classList.add("songs");

  items.forEach(item => {
    const track = item.track;
    const songItem = document.createElement("div");
    songItem.classList.add("liked-song-item");
    songItem.innerHTML = `
    <div class="left">
      <img src="${track.album.images[0] ? track.album.images[0].url : "default-image-url"}" alt="${track.name}">
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:left;">
        <h3>${track.name}</h3>
        <p>${track.artists.map((artist) => artist.name).join(", ")}</p>
      </div>
      
      </div>
    `;
    const right = document.createElement("div")
    right.classList.add("right")
    right.innerHTML = `
    <p>${formatDuration(track.duration_ms)}</p>
    `
    addLikeButton(track, right, true); // true indicates the song is already liked
    addPlaylistDropdown(track, right);
    songItem.appendChild(right)
    songsDiv.appendChild(songItem);

    // Add click event for song
    songItem.addEventListener("click", () => {
      playTrackAndUpdateUI(track);
    });
  });

  resultsDiv.appendChild(songsDiv);
}
function displayRecentlyPlayed(items) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.classList.add('recently-played-section'); // Thêm class cho phần recently played
  resultsDiv.innerHTML = '';

  const songsDiv = document.createElement("div");
  songsDiv.classList.add("songs");
  songsDiv.innerHTML = "<h2>Recently Played</h2>";

  items.forEach(item => {
    const track = item.track;
    const songItem = document.createElement("div");
    songItem.classList.add("recently-played-item");
    songItem.innerHTML = `
    <div class="left">
      <img src="${track.album.images && track.album.images[0] ? track.album.images[0].url : "default-image-url"}" alt="${track.name}">
      <div>
        <h3>${track.name}</h3>
        <p>${track.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
      </div>
     
    `;
    const right = document.createElement("div")
    right.classList.add("right")
    right.innerHTML = `
    <p>${formatDuration(track.duration_ms)}</p>
    `
    addLikeButton(track, right);
    addPlaylistDropdown(track, right);
    songItem.appendChild(right)
    
    songsDiv.appendChild(songItem);

    // Add click event for song
    songItem.addEventListener("click", () => {
      playTrackAndUpdateUI(track);
    });
  });

  resultsDiv.appendChild(songsDiv);
}
function displayFollowedArtists(artists) {
  const container = document.getElementById('results');
  container.classList.add('my-artists-section');
  container.innerHTML = '';

  const header = document.createElement('h2');
  header.className = 'section-header';
  header.textContent = 'My Artists';
  container.appendChild(header);
  const artistItemContainer = document.createElement("div")
  artistItemContainer.classList.add("artist-item-container")
  artists.forEach(artist => {
    const element = document.createElement('div');
    element.className = 'artist-item';
    element.innerHTML = `
      <img src="${artist.images[0] ? artist.images[0].url : 'default-artist-image.png'}" alt="${artist.name}">
      <p>${artist.name}</p>
    `;
    element.addEventListener('click', () => {
      displayArtistInfo(artist); // Truyền đối tượng artist đầy đủ
    });
    artistItemContainer.appendChild(element);
  });
  container.appendChild(artistItemContainer)
}
async function displaySavedAlbums() {
  const accessToken =  getUserAccessToken();
  if (!accessToken) {
    console.error("Access token is required to call Spotify API");
    return;
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/albums', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch saved albums: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const albums = data.items;
    const container = document.getElementById('results');
    container.classList.add('my-albums'); // Add specific class for my albums

    container.innerHTML = ''; // Clear existing content
    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = 'My Albums';
    container.appendChild(header);
    const albumItemContainer = document.createElement("div")
    albumItemContainer.classList.add("album-item-container")
    
    albums.forEach(albumItem => {
      const album = albumItem.album;
      const element = document.createElement('div');
      element.className = 'album-item';
      element.innerHTML = `
        <img src="${album.images[0].url}" alt="${album.name}">
        <p>${album.name}</p>
      `;
      element.addEventListener('click', () => {
        displayAlbumInfo(album.id);
      });
      albumItemContainer.appendChild(element);
    });
    container.appendChild(albumItemContainer)
  } catch (error) {
    console.error('Error fetching saved albums:', error);
  }

 
}

async function fetchCategoryPlaylists(categoryId) {
  const accessToken = await ensureAccessToken();
  if (!accessToken) {
    console.error("Access token is required to call Spotify API");
    return [];
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlists for category " + categoryId);
    }

    const data = await response.json();
    return data.playlists.items;
  } catch (error) {
    console.error("Error fetching playlists for category " + categoryId + ":", error);
    return [];
  }
}

function getRandomColor() {
  const colors = ["#ff4b4b", "#4bff4b", "#4b4bff", "#ff4bff", "#4bffff", "#ffff4b"];
  return colors[Math.floor(Math.random() * colors.length)];
}
