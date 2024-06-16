

  // window.addEventListener('popstate', function () {
  //     const url = location.pathname;
  //     fetch(url)
  //         .then(response => response.text())
  //         .then(html => {
  //             const parser = new DOMParser();
  //             const doc = parser.parseFromString(html, 'text/html');
  //             mainContent.innerHTML = doc.querySelector('.main-content').innerHTML;
  //         });
  // });


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

// menuOpenButton.addEventListener('click', function() {
//     sidebar.classList.toggle('collapsed');
//    console.log("hello")
//    const queue = document.createElement('div')
//    queue.style.width = "200px"
//    document.querySelector('.container').appendChild(
//         queue
//    );
// });

// Lấy tham chiếu đến thẻ main và header
var main = document.querySelector("main");
var header = document.querySelector("main header");

// Thêm sự kiện scroll cho thẻ main
main.addEventListener("scroll", function () {
  // Kiểm tra nếu thẻ main được scroll xuống
  if (main.scrollTop > 0) {
    // Thêm class 'scrolled' vào header
    main.header.style.position = "10vh";
  } else {
    // Xóa class 'scrolled' khỏi header
    main.header.style.top = "10vh"; // Độ dài của header, ẩn hoàn toàn
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

// let searchResults = []; // Lưu trữ kết quả tìm kiếm ban đầu

// async function searchSpotify() {
//   const query = document.getElementById("searchQuery").value;

//   if (!query) {
//     alert("Vui lòng nhập từ khóa để tìm kiếm.");
//     return;
//   }

//   const spotifySearchUrl = `https://v1.nocodeapi.com/tvkhang/spotify/dzYJkRIsojRMPuIT/search?q=${encodeURIComponent(query)}`; // Đây là hàm JavaScript dùng để mã hóa một chuỗi URL

//   const headers = new Headers();
//   headers.append("Content-Type", "application/json");

//   const requestOptions = {
//     method: "GET",
//     headers: headers,
//     redirect: "follow",
//   };

//   try {
//     const response = await fetch(spotifySearchUrl, requestOptions);
//     const searchResult = await response.json();

//     handleSearchResult(searchResult);
//   } catch (error) {
//     handleSearchError(error);
//   }
// }

// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// function searchSpotify() {
//     var searchQuery = document.getElementById('searchQuery').value;
//     var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//     };

//     fetch(`https://v1.nocodeapi.com/tvkhang/spotify/dzYJkRIsojRMPuIT/search?q=${encodeURIComponent(searchQuery)}&type=track`, requestOptions)
//         .then(response => response.json())  // Chuyển đổi kết quả từ dạng text sang JSON
//         .then(data => {
//             var resultsDiv = document.getElementById('results');
//             resultsDiv.innerHTML = ''; // Xóa kết quả tìm kiếm cũ
//             data.tracks.items.forEach(track => {
//                 var src = `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=1`;
//                 var iframe = `<iframe style="border-radius:12px" src="${src}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
//                 resultsDiv.innerHTML += iframe; // Thêm iframe mới vào kết quả
//             });
//         })
//         .catch(error => console.error('Error:', error));
// }

// function handleSearchResult(result) {
//   displayAllResults(result)
// }

// function displayAllResults(result) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = ""; // Clear previous results

//   const categories = ["albums", "tracks", "artists", "playlists"];

//   categories.forEach((category) => {
//     if (result[category] && result[category].items.length > 0) {
//       const categoryTitle = document.createElement("h2");
//       categoryTitle.textContent =
//         category.charAt(0).toUpperCase() + category.slice(1);
//       resultsDiv.appendChild(categoryTitle);

//       result[category].items.forEach((item) => {
//         const itemElement = createItemElement(category, item);
//         resultsDiv.appendChild(itemElement);
//       });
//     }
//   });
// }

// function createItemElement(category, item) {
//   const itemElement = document.createElement("div");
//   itemElement.className = "searchre";

//   const itemTitle = document.createElement("h3");
//   itemTitle.textContent = item.name;
//   itemElement.appendChild(itemTitle);

//   if (category === "albums" || category === "tracks") {
//     const artistsParagraph = document.createElement("p");
//     const artists = item.artists.map((artist) => artist.name).join(", ");
//     artistsParagraph.textContent = "by " + artists;
//     itemElement.appendChild(artistsParagraph);
//   }

//   if (item.images && item.images.length > 0) {
//     const itemImage = document.createElement("img");
//     itemImage.src = item.images[0].url; // Use the first image in the array
//     itemImage.alt = item.name;
//     itemElement.appendChild(itemImage);
//   }

//   return itemElement;
// }

// function displayNoResultsMessage() {
//   document.getElementById("results").innerHTML =
//     "Không có kết quả nào được tìm thấy.";
// }

// function handleSearchError(error) {
//   console.log("Error fetching data from Spotify API:", error);
//   // Có thể hiển thị thông báo lỗi trên giao diện người dùng thay vì chỉ log lỗi vào console.
// }

// let currentResults = {};

// function handleSearchResult(result) {
//   currentResults = result; // Lưu kết quả hiện tại để lọc
//   displayAllResults(result);
// }

// function filterResults(category) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = ""; // Clear previous results

//   if (category === "all") {
//     displayAllResults(currentResults);
//   } else {
//     const filteredCategory = category === "songs" ? "tracks" : category;
//     if (
//       currentResults[filteredCategory] &&
//       currentResults[filteredCategory].items.length > 0
//     ) {
//       currentResults[filteredCategory].items.forEach((item) => {
//         const itemElement = createItemElement(filteredCategory, item);
//         resultsDiv.appendChild(itemElement);
//       });
//     } else {
//       displayNoResultsMessage();
//     }
//   }
// }

// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// let currentResults = {};

// function searchSpotify(retryCount = 0) {
//     var searchQuery = document.getElementById('searchQuery').value;
//     var cacheKey = `spotify-search-${searchQuery}`;
//     var cachedData = localStorage.getItem(cacheKey);

//     if (cachedData) {
//         console.log("Using cached data");
//         currentResults = JSON.parse(cachedData);
//         displayAllResults(currentResults);
//         return;
//     }

//     var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//     };

//     fetch(`https://v1.nocodeapi.com/tvkhang/spotify/dzYJkRIsojRMPuIT/search?q=${encodeURIComponent(searchQuery)}&type=album,artist,playlist,track&perPage=10`, requestOptions)
//         .then(response => {
//             if (response.status === 429) {
//                 if (retryCount < 5) {
//                     const retryAfter = Math.pow(2, retryCount) * 1000; // Exponential backoff
//                     console.log(`Retrying after ${retryAfter} ms...`);
//                     setTimeout(() => searchSpotify(retryCount + 1), retryAfter);
//                 } else {
//                     throw new Error('Too Many Requests');
//                 }
//             } else {
//                 return response.json();
//             }
//         })
//         .then(data => {
//             localStorage.setItem(cacheKey, JSON.stringify(data)); // Cache the data
//             currentResults = data; // Save current results for filtering
//             displayAllResults(data);
//         })
//         .catch(error => console.error('Error:', error));
// }

// function preloadData(searchQuery, nextPage) {
//   const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track,album,playlist,artist&perPage=10&offset=${nextPage * 10}`;
//   fetch(url)
//       .then(response => response.json())
//       .then(data => {
//           // Lưu trữ dữ liệu tải trước vào sessionStorage hoặc một biến tạm thời
//           sessionStorage.setItem(`preloaded-${nextPage}`, JSON.stringify(data));
//       })
//       .catch(error => console.error('Error preloading data:', error));
// }

// function displayAllResults(result) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = ""; // Clear previous results

//   // Hiển thị Top Result
//   if (result.artists && result.artists.items.length > 0) {
//       const topResult = result.artists.items[0];
//       const topResultDiv = document.createElement("div");
//       topResultDiv.className = "top-result";

//       const topResultImage = document.createElement("img");
//       topResultImage.src = topResult.images[0].url;
//       topResultImage.alt = topResult.name;
//       topResultDiv.appendChild(topResultImage);

//       const topResultName = document.createElement("h2");
//       topResultName.textContent = topResult.name;
//       topResultDiv.appendChild(topResultName);

//       resultsDiv.appendChild(topResultDiv);
//   }

//   // Hiển thị Songs
//   if (result.tracks && result.tracks.items.length > 0) {
//       const songsDiv = document.createElement("div");
//       songsDiv.className = "songs";

//       const songsTitle = document.createElement("h2");
//       songsTitle.textContent = "Songs";
//       songsDiv.appendChild(songsTitle);

//       result.tracks.items.forEach((track) => {
//           const trackElement = createItemElement("tracks", track);
//           songsDiv.appendChild(trackElement);
//       });

//       resultsDiv.appendChild(songsDiv);
//   }

//   // Hiển thị Albums
//   if (result.albums && result.albums.items.length > 0) {
//       const albumsDiv = document.createElement("div");
//       albumsDiv.className = "albums";

//       const albumsTitle = document.createElement("h2");
//       albumsTitle.textContent = "Albums";
//       albumsDiv.appendChild(albumsTitle);

//       result.albums.items.forEach((album) => {
//           const albumElement = createItemElement("albums", album);
//           albumsDiv.appendChild(albumElement);
//       });

//       resultsDiv.appendChild(albumsDiv);
//   }

//   // Hiển thị Playlists
//   if (result.playlists && result.playlists.items.length > 0) {
//       const playlistsDiv = document.createElement("div");
//       playlistsDiv.className = "playlists";

//       const playlistsTitle = document.createElement("h2");
//       playlistsTitle.textContent = "Playlists";
//       playlistsDiv.appendChild(playlistsTitle);

//       result.playlists.items.forEach((playlist) => {
//           const playlistElement = createItemElement("playlists", playlist);
//           playlistsDiv.appendChild(playlistElement);
//       });

//       resultsDiv.appendChild(playlistsDiv);
//   }

//   // Hiển thị Artists
//   if (result.artists && result.artists.items.length > 0) {
//       const artistsDiv = document.createElement("div");
//       artistsDiv.className = "artists";

//       const artistsTitle = document.createElement("h2");
//       artistsTitle.textContent = "Artists";
//       artistsDiv.appendChild(artistsTitle);

//       result.artists.items.forEach((artist) => {
//           const artistElement = createItemElement("artists", artist);
//           artistsDiv.appendChild(artistElement);
//       });

//       resultsDiv.appendChild(artistsDiv);
//   }
// }

// function createItemElement(category, item) {
//   const itemElement = document.createElement("div");
//   itemElement.className = "search-result";

//   const itemTitle = document.createElement("h3");
//   itemTitle.textContent = item.name;
//   itemElement.appendChild(itemTitle);

//   if (category === "albums" || category === "tracks") {
//       const artistsParagraph = document.createElement("p");
//       const artists = item.artists.map((artist) => artist.name).join(", ");
//       artistsParagraph.textContent = "by " + artists;
//       itemElement.appendChild(artistsParagraph);
//   }

//   if (item.images && item.images.length > 0) {
//       const itemImage = document.createElement("img");
//       itemImage.src = item.images[0].url; // Use the first image in the array
//       itemImage.alt = item.name;
//       itemElement.appendChild(itemImage);
//   }

//   let src;
//     switch (category) {
//         case "tracks":
//             src = `https://open.spotify.com/embed/track/${item.id}?utm_source=generator`;
//             break;
//         case "albums":
//             src = `https://open.spotify.com/embed/album/${item.id}?utm_source=generator`;
//             break;
//         case "playlists":
//             src = `https://open.spotify.com/embed/playlist/${item.id}?utm_source=generator`;
//             break;
//         case "artists":
//             src = `https://open.spotify.com/embed/artist/${item.id}?utm_source=generator`;
//             break;
//         default:
//             src = "";
//     }

//     if (src) {
//         const iframe = `<iframe style="border-radius:12px" src="${src}" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
//         itemElement.innerHTML += iframe;
//     }

//     return itemElement;
// }

// function filterResults(category) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = ""; // Clear previous results

//   if (category === "all") {
//       displayAllResults(currentResults);
//   } else {
//       const filteredCategory = category === "songs" ? "tracks" : category;
//       if (
//           currentResults[filteredCategory] &&
//           currentResults[filteredCategory].items.length > 0
//       ) {
//           currentResults[filteredCategory].items.forEach((item) => {
//               const itemElement = createItemElement(filteredCategory, item);
//               resultsDiv.appendChild(itemElement);
//           });
//       } else {
//           displayNoResultsMessage();
//       }
//   }
// }

// function displayNoResultsMessage() {
//   document.getElementById("results").innerHTML =
//       "Không có kết quả nào được tìm thấy.";
// }

// function cacheAndDisplayResults(data) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = ""; // Clear previous results

//   data.tracks.items.forEach(track => {
//       const trackInfo = {
//           id: track.id,
//           name: track.name,
//           artists: track.artists.map(artist => artist.name).join(", "),
//           albumName: track.album.name,
//           embedUrl: `https://open.spotify.com/embed/track/${track.id}`
//       };

//       // Lưu trữ vào localStorage
//       localStorage.setItem(`spotify-track-${track.id}`, JSON.stringify(trackInfo));

//       // Tạo và hiển thị mã nhúng
//       const iframe = document.createElement('iframe');
//       iframe.style.borderRadius = "12px";
//       iframe.src = trackInfo.embedUrl;
//       iframe.width = "100%";
//       iframe.height = "380";
//       iframe.frameBorder = "0";
//       iframe.allowFullscreen = "";
//       iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
//       resultsDiv.appendChild(iframe);
//   });
// }

// function displayCachedEmbed(trackId) {
//   const cachedTrackInfo = JSON.parse(localStorage.getItem(`spotify-track-${trackId}`));
//   if (cachedTrackInfo) {
//       const resultsDiv = document.getElementById("results");
//       const iframe = document.createElement('iframe');
//       iframe.style.borderRadius = "12px";
//       iframe.src = cachedTrackInfo.embedUrl;
//       iframe.width = "100%";
//       iframe.height = "380";
//       iframe.frameBorder = "0";
//       iframe.allowFullscreen = "";
//       iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
//       resultsDiv.appendChild(iframe);
//   } else {
//       console.log("No cached data found for this track");
//   }
// }

//*****545-628 */
// Khai báo biến toàn cục để quản lý access token và thời gian hết hạn
let accessToken = null;
let tokenExpirationTime = null;

// Hàm kiểm tra xem token đã hết hạn chưa bằng cách so sánh thời gian hiện tại với thời điểm hết hạn.
function isTokenExpired() {
  const now = new Date();
  return now >= tokenExpirationTime;
}

// Hàm bất đồng bộ để lấy access token từ Spotify. Sử dụng Client Credentials flow để xác thực.
async function getSpotifyAccessToken() {
  const clientId = "1825746372a54d109f5b454536f999ab"; // ID của client
  const clientSecret = "214b213916b04801809c7e7c824bd898";

  const authString = btoa(`${clientId}:${clientSecret}`); // mã hóa base 64

  try {
    // Thực hiện yêu cầu POST để lấy token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    // Kiểm tra phản hồi có thành công không
    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }
    // Phân tích cú pháp dữ liệu JSON từ phản hồi
    const data = await response.json();
    accessToken = data.access_token; // Lưu access token
    // Giả sử token hết hạn sau 3600 giây
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

// Hàm bất đồng bộ để gọi API Spotify với access token. Xử lý trường hợp token hết hạn và gọi lại API.
async function callSpotifyAPI(url, accessToken) {
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Kiểm tra nếu token hết hạn và lấy mới token nếu cần
    if (response.status === 401) {
      // Token hết hạn
      accessToken = await getSpotifyAccessToken();
      response = await callSpotifyAPI(url, accessToken); // Gọi lại API với token mới
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
    // Bạn có thể tiếp tục sử dụng accessToken ở đây
  } else {
    console.log("Failed to retrieve access token.");
  }
});

function getUserAccessToken() {
  return localStorage.getItem("userAccessToken");
}

//HOME PAGE//
document.addEventListener("DOMContentLoaded", async () => {
  const userAccessToken = getUserAccessToken();

  // Gọi API để lấy thông tin bài hát "Hello" của Adele
  const song = await fetchSongInfo(userAccessToken, "6M6x0gdg4mn1j3m8V0d5uN");
  if (song) {
    updateTrendingSong(song);
  } else {
    console.error("No song data available");
  }
});

async function fetchSongInfo(accessToken, songId) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/5cF0dROlMOK5uNZtivgu50`,
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
}



async function fetchGenreSeeds() {
  const accessToken = await ensureAccessToken(); // Đảm bảo rằng bạn có accessToken hợp lệ
  const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds'; // URL API để lấy thể loại

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch genre seeds: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const limitedGenres = data.genres.slice(0, 10); // Giới hạn chỉ lấy 10 thể loại đầu tiên
    return limitedGenres; // Trả về danh sách các thể loại đã giới hạn
  } catch (error) {
    console.error('Error fetching genre seeds:', error);
    return [];
  }
}
document.addEventListener('DOMContentLoaded', () => {
  updateGenreSeedsUI(); // Cập nhật UI khi trang tải xong
});
async function updateGenreSeedsUI() {
  const genres = await fetchGenreSeeds(); // Lấy dữ liệu thể loại từ API
  const genresDiv = document.querySelector('.genres .items');
  genresDiv.innerHTML = ''; // Xóa các item hiện tại

  genres.forEach(genre => {
    const genreItem = document.createElement('div');
    genreItem.className = 'item';
    genreItem.innerHTML = `<p>${genre.replace(/-/g, ' ')}</p>`; // Thay thế dấu gạch ngang bằng khoảng trắng
    genresDiv.appendChild(genreItem); // Thêm item mới
  });
  applyRandomColors(); 
}
const colors = ['#476a8a', '#a69984', '#a24c34', '#0d4045', '#a67894', '#5547a5'];
function applyRandomColors() {
  const items = document.querySelectorAll('.container main .playlist .genres .items .item');

  items.forEach(item => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    item.style.backgroundColor = randomColor;
  });
}






















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
    data.tracks.items.forEach((track) => {
      const songItem = document.createElement("div");
      songItem.classList.add("song-item");
      songItem.innerHTML = `
        <img src="${track.album.images && track.album.images[0] ? track.album.images[0].url : "default-image-url"}" alt="${track.name}">
        <div>
          <h3>${track.name}</h3>
          <p>${track.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
        <p>${formatDuration(track.duration_ms)}</p>
      `;
      addLikeButton(track, songItem);
      addPlaylistDropdown(track, songItem);
      songsDiv.appendChild(songItem);

      // Add click event for song
      songItem.addEventListener("click", () => {
        playTrackAndUpdateUI(track);
      });
    });
    resultsDiv.appendChild(songsDiv);
  }

  // Artists
  if (data.artists && data.artists.items.length > 0) {
    const artistsDiv = document.createElement("div");
    artistsDiv.classList.add("artists");
    artistsDiv.innerHTML = "<h2>Artists</h2>";
    data.artists.items.forEach((artist) => {
      const artistItem = document.createElement("div");
      artistItem.classList.add("artist-item");
      artistItem.innerHTML = `
        <img src="${artist.images && artist.images[0] ? artist.images[0].url : "default-image-url"}" alt="${artist.name}">
        <h3>${artist.name}</h3>
      `;
      artistsDiv.appendChild(artistItem);

      // Add click event for artist
      artistItem.addEventListener("click", () => {
        displayArtistInfo(artist);
      });
    });
    resultsDiv.appendChild(artistsDiv);
  }

  // Albums
  if (data.albums && data.albums.items.length > 0) {
    const albumsDiv = document.createElement("div");
    albumsDiv.classList.add("albums");
    albumsDiv.innerHTML = "<h2>Albums</h2>";
    data.albums.items.forEach((album) => {
      const albumItem = document.createElement("div");
      albumItem.classList.add("album-item");
      albumItem.innerHTML = `
        <img src="${album.images && album.images[0] ? album.images[0].url : "default-image-url"}" alt="${album.name}">
        <div>
          <h3>${album.name}</h3>
          <p>${album.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
      `;
      albumsDiv.appendChild(albumItem);

      // Add click event for album
      albumItem.addEventListener("click", () => {
        displayAlbumInfo(album.id);
      });
    });
    resultsDiv.appendChild(albumsDiv);
  }

  // Playlists
  if (data.playlists && data.playlists.items.length > 0) {
    const playlistsDiv = document.createElement("div");
    playlistsDiv.classList.add("playlists");
    playlistsDiv.innerHTML = "<h2>Playlists</h2>";
    data.playlists.items.forEach((playlist) => {
      const playlistItem = document.createElement("div");
      playlistItem.classList.add("playlist-item");
      playlistItem.innerHTML = `
        <img src="${playlist.images && playlist.images[0] ? playlist.images[0].url : "default-image-url"}" alt="${playlist.name}">
        <div>
          <h3>${playlist.name}</h3>
          <p>By ${playlist.owner.display_name}</p>
        </div>
      `;
      playlistsDiv.appendChild(playlistItem);

      // Add click event for playlist
      playlistItem.addEventListener("click", () => {
        displayPlaylistInfo(playlist.id);
      });
    });
    resultsDiv.appendChild(playlistsDiv);
  }
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

// sau khi search all client muốn xem thông tin của albums
let currentTrackIndex = 0;
let currentTrackList = [];
let currentListType = ""; // 'album', 'artist', hoặc 'playlist'
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
    const userAccessToken = getUserAccessToken();
    if (!userAccessToken) {
      console.error("User access token is required");
      return;
    }

    const topTracksResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
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

async function displayPlaylistInfo(playlistId) {
  const userAccessToken = getUserAccessToken();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlist details");
    }

    const playlist = await response.json();

    // Lưu trữ danh sách các bài hát trong playlist
    currentTrackList = playlist.tracks.items;
    currentTrackIndex = 0;
    currentListType = "playlist";

    // Create playlist info HTML
    const playlistInfoDiv = document.createElement("div");
    playlistInfoDiv.className = "playlist-info";
    playlistInfoDiv.innerHTML = `
      <div class="playlist-header">
        <img src="${playlist.images && playlist.images[0] ? playlist.images[0].url : "default-image-url"}" alt="${playlist.name}">
        <div class="playlist-details">
          <h1>${playlist.name}</h1>
          <p>By ${playlist.owner.display_name}</p>
          <p>${playlist.followers.total} likes • ${playlist.tracks.total} songs, about ${formatDuration(playlist.tracks.items.reduce((acc, item) => acc + item.track.duration_ms, 0))}</p>
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

    // Check if the playlist is saved and update button text
    let isPlaylistSaved = await checkIfPlaylistSaved(
      playlistId,
      userAccessToken,
    );
    const saveButton = playlistInfoDiv.querySelector(".save-playlist-button");
    saveButton.innerHTML = isPlaylistSaved
      ? "<i class='bx bx-check-circle' style='color:#ffffff'></i> Unsave Playlist"
      : "<i class='bx bx-plus-circle' style='color:#ffffff'></i> Save Playlist";

    // Add save playlist button functionality
    saveButton.addEventListener("click", async () => {
      if (isPlaylistSaved) {
        await removeFromSavedPlaylists(playlistId, userAccessToken);
      } else {
        await addToSavedPlaylists(playlistId, userAccessToken);
      }
      isPlaylistSaved = !isPlaylistSaved;
      saveButton.innerHTML = isPlaylistSaved
        ? "<i class='bx bx-check-circle' style='color:#ffffff'></i> Unsave Playlist"
        : "<i class='bx bx-plus-circle' style='color:#ffffff'></i> Save Playlist";
    });

    // Create tracks list
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
        currentTrackIndex = index; // Cập nhật bài hát hiện tại
        playTrackAndUpdateUI(track);
      });
    });
  } catch (error) {
    console.error("Error fetching playlist info:", error);
  }
}
async function checkIfPlaylistSaved(playlistId, userAccessToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists/contains?ids=${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to check playlist saved status");
    }

    const data = await response.json();
    return data[0]; // Assuming the API returns an array of booleans
  } catch (error) {
    console.error("Error checking if playlist is saved:", error);
    return false; // Assume not saved if there's an error
  }
}
async function addToSavedPlaylists(playlistId, userAccessToken) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Playlist",
        description: "Created via API",
        public: false,
      }),
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
  const accessToken = await getUserAccessToken(); // Lấy user access token

  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: [trackUri] }),
  });

  if (!response.ok) {
    console.error("Failed to play track");
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
  if (currentTrackIndex < currentTrackList.length - 1) {
    currentTrackIndex++;
    let nextTrack = currentTrackList[currentTrackIndex];
    if (currentListType === "playlist") {
      nextTrack = nextTrack.track; // Trong playlist, track được lưu trong thuộc tính track của item
    }
    await playTrackAndUpdateUI(nextTrack);
  } else {
    console.log("This is the last track in the list.");
  }
}

async function skipToPrevious() {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
    let previousTrack = currentTrackList[currentTrackIndex];
    if (currentListType === "playlist") {
      previousTrack = previousTrack.track; // Trong playlist, track được lưu trong thuộc tính track của item
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

let isRepeating = false;
let isPlaying = false;
let isCustomEnabled = false;
let isLyricsVisible = false;

// Hàm để phát bài hát và cập nhật UI
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

async function loadSectionData(section) {
  const accessToken = await getUserAccessToken();
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
    case 'local':
      // URL cho local music (nếu có)
      break;
    case 'create-new':
      // URL cho create new playlist (nếu có)
      break;
    case 'best-of-2023':
      url = `https://api.spotify.com/v1/playlists/5j0o3XQ1YciVzm7MtcFmfG`;
      break;
    case 'best-of-2024':
      url = `https://api.spotify.com/v1/playlists/0aiBKNSqiPnhtcw1QlXK5s`; // Thay {playlist_id_best_of_2024} bằng ID của playlist "Best of 2024"
      break;
    case 'adele':
      url = `https://api.spotify.com/v1/playlists/37i9dQZF1DWTwnEm1IYyoj`;
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
    console.log("Fetched data:", data); // Thêm dòng này để kiểm tra dữ liệu

    displaySectionData(data, section);
  } catch (error) {
    console.error("Error fetching data for section " + section + ":", error);
  }
}

// function displaySectionData(data, section) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = ""; // Clear previous results

//   if (section === 'explore') {
//     const categories = [
//       { name: 'Music', color: '#ff4b4b' },
//       { name: 'Podcasts', color: '#4bff4b' },
//       { name: 'Live Events', color: '#4b4bff' },
//       { name: 'Made For You', color: '#ff4bff' },
//       { name: 'New Releases', color: '#4bffff' },
//       { name: 'Vietnamese', color: '#ffff4b' }
//     ];

//     categories.forEach(category => {
//       const categoryItem = document.createElement('div');
//       categoryItem.className = 'category-item';
//       categoryItem.style.backgroundColor = category.color;
//       categoryItem.innerHTML = `
//         <p>${category.name}</p>
//       `;
//       resultsDiv.appendChild(categoryItem);
//     });
//   }
// }

function displaySectionData(data, section) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (section === 'explore' || section === 'genres' || section === 'made-for-you' || section === 'albums' || section === 'artists' || section === 'recents'|| section === 'favourites') {
    resultsDiv.classList.add('explore-layout'); // Add specific class for layout

    // Thêm header
    const header = document.createElement('h2');
    header.textContent = section === 'explore' ? "New Releases" : (section === 'genres' ? "Genres" : (section === 'made-for-you' ? "Made For You" : (section === 'albums' ? "My Albums" : (section === 'artists' ? "My Artists" : "Recently Played"))));
    header.className = 'section-header';
    resultsDiv.appendChild(header);

    if (section === 'albums') {
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
    resultsDiv.classList.remove('explore-layout'); // Remove specific class if not applicable
  }
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
      <img src="${track.album.images[0] ? track.album.images[0].url : "default-image-url"}" alt="${track.name}">
      <div>
        <h3>${track.name}</h3>
        <p>${track.artists.map((artist) => artist.name).join(", ")}</p>
      </div>
      <p>${formatDuration(track.duration_ms)}</p>
    `;
    addLikeButton(track, songItem, true); // true indicates the song is already liked
    addPlaylistDropdown(track, songItem);
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
      <img src="${track.album.images && track.album.images[0] ? track.album.images[0].url : "default-image-url"}" alt="${track.name}">
      <div>
        <h3>${track.name}</h3>
        <p>${track.artists.map((artist) => artist.name).join(", ")}</p>
      </div>
      <p>${formatDuration(track.duration_ms)}</p>
    `;
    addLikeButton(track, songItem);
    addPlaylistDropdown(track, songItem);
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
    container.appendChild(element);
  });
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
      container.appendChild(element);
    });
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

















// hàm liên quan genres// 


  // function getRandomColor() {
  //   const colors = ["#ff4b4b", "#4bff4b", "#4b4bff", "#ff4bff", "#4bffff", "#ffff4b"];
  //   return colors[Math.floor(Math.random() * colors.length)];
  // }

