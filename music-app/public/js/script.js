document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.querySelector(".container main");
  
    document.querySelectorAll(".sidebar a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const url = this.getAttribute("href");
        if (url === "/explore") {
          loadPage(url);
        } else {
          fetch(url)
            .then((response) => response.text())
            .then((html) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              mainContent.innerHTML =
                doc.querySelector(".container main").innerHTML;
            });
        }
      });
    });
  
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
  });
  
  function loadPage(page) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", page, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.querySelector("main").innerHTML = xhr.responseText;
        // document.querySelector("main .playlist").innerHTML = "";
      }
    };
    xhr.send();
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
var main = document.querySelector('main');
var header = document.querySelector('main header');

// Thêm sự kiện scroll cho thẻ main
main.addEventListener('scroll', function() {
    // Kiểm tra nếu thẻ main được scroll xuống
    if (main.scrollTop > 0) {
        // Thêm class 'scrolled' vào header
        main.header.style.position = "10vh";
    } else {
        // Xóa class 'scrolled' khỏi header
        main.header.style.top = "10vh"; // Độ dài của header, ẩn hoàn toàn
    }
});










document.addEventListener('DOMContentLoaded', function() {
  // Check if access token is available
  const accessToken = getCookie('access_token');
  if (!accessToken) {
      console.log('No access token found');
      return;
  }

  // Function to get cookie by name
  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Fetch user's playlists
  fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  })
  .then(response => response.json())
  .then(data => {
      const playlistContainer = document.getElementById('playlist-container');
      data.items.forEach(playlist => {
          const div = document.createElement('div');
          div.textContent = playlist.name;
          playlistContainer.appendChild(div);
      });
  })
  .catch(error => console.log(error));
});




  