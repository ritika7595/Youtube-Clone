const API_KEY = "AIzaSyBGoxJi-iojQbCjQwN5kOvU2urtxf9Evg0";
const YOUTUBE_API_URL = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&maxResults=12&key=" + API_KEY;

function hideOrShowMenu() {
    const menu = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");
    menu.addEventListener("click", function () {
        sidebar.style.visibility = sidebar.style.visibility === 'hidden' ? 'visible' : 'hidden';
    });
}

hideOrShowMenu();


let videos = [];

function loadVideos() {
    fetch(YOUTUBE_API_URL)
        .then(response => response.json())
        .then((data) => {
            videos = data.items;
            console.log(videos);
            displayVideos();
        })
        .catch(error => console.log(error));
}

function displayVideos() {
    var videoGrid = document.getElementById('videoGrid');
    videoGrid.innerHTML = ""; 

    videos.forEach((video, index) => {
        var link = document.createElement('a');
        link.href = `video_player.html?videoId=${video.id}`;

        var videoDiv = document.createElement('div');
        videoDiv.className = 'video';

        var imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        var thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail';
        thumbnail.src = video.snippet.thumbnails.high.url; 
        thumbnail.alt = '';

        var timeStamp = document.createElement('div');
        timeStamp.className = 'time-stamp';

        imgContainer.appendChild(thumbnail);
        imgContainer.appendChild(timeStamp);

        var videoDesc = document.createElement('div');
        videoDesc.className = 'video-desc';

        var channelIcon = document.createElement('img');
        channelIcon.className = 'channel-icon';
        channelIcon.src = video.snippet.channelThumbnailUrl;
        channelIcon.alt = '';

        var desc = document.createElement('div');
        desc.className = 'desc';

        var title = document.createElement('p');
        title.className = 'title';
        title.textContent = video.snippet.title;

        var channelName = document.createElement('p');
        channelName.className = 'channel-name';
        channelName.textContent = video.snippet.channelTitle;

        var views = document.createElement('p');
        views.textContent = formatViews(video.statistics.viewCount)+" • ";
        views.className = 'views';

        var uploadedOn = document.createElement('p');
        uploadedOn.className = 'uploaded-on';
        uploadedOn.textContent = calculateTimeAgo(new Date(video.snippet.publishedAt));

        desc.appendChild(title);
        desc.appendChild(channelName);
        desc.appendChild(views);
        desc.appendChild(uploadedOn);


        desc.appendChild(title);
        desc.appendChild(channelName);
        desc.appendChild(views);
        desc.appendChild(uploadedOn);

        videoDesc.appendChild(channelIcon);
        videoDesc.appendChild(desc);

        videoDiv.appendChild(imgContainer);
        videoDiv.appendChild(videoDesc);

        link.appendChild(videoDiv);
        videoGrid.appendChild(link);
    });
}

loadVideos();
function formatViews(views) {
    if (views >= 1e6) {
        return (views / 1e6).toFixed(1) + 'M views';
    } else if (views >= 1e3) {
        return (views / 1e3).toFixed(1) + 'K views';
    } else {
        return views + ' views';
    }
}

function calculateTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return diffInSeconds + 's ago';
    } else if (diffInSeconds < 3600) {
        return Math.floor(diffInSeconds / 60) + 'm ago';
    } else if (diffInSeconds < 86400) {
        return Math.floor(diffInSeconds / 3600) + 'h ago';
    } else {
        return Math.floor(diffInSeconds / 86400) + 'd ago';
    }
}

loadVideos();

function addLinksToEachVideos() {
    var linksArray = videos.map((video) => document.getElementById(video.id));
    linksArray.forEach((link, index) => {
        link.href = `https://www.youtube.com/watch?v=${videos[index].id}`;
    });
}

addLinksToEachVideos();



function filterVideos(searchTerm) {
    const filteredVideos = videos.filter(video => {
        const title = video.snippet.title.toLowerCase();
        const channelName = video.snippet.channelTitle.toLowerCase();
        return title.includes(searchTerm) || channelName.includes(searchTerm);
    });

    displayFilteredVideos(filteredVideos);
}

function displayFilteredVideos(filteredVideos) {
    var videoGrid = document.getElementById('videoGrid');
    videoGrid.innerHTML = "";

    filteredVideos.forEach((video, index) => {
        var link = document.createElement('a');
        link.href = `video_player.html?videoId=${video.id}`;
        link.target = "_blank"; // Open link in a new tab

        var videoDiv = document.createElement('div');
        videoDiv.className = 'video';

        var imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        var thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail';
        thumbnail.src = video.snippet.thumbnails.high.url;
        thumbnail.alt = '';

        var timeStamp = document.createElement('div');
        timeStamp.className = 'time-stamp';
        timeStamp.textContent = calculateTimeAgo(new Date(video.snippet.publishedAt)); 

        imgContainer.appendChild(thumbnail);
        imgContainer.appendChild(timeStamp);

        var videoDesc = document.createElement('div');
        videoDesc.className = 'video-desc';

        var channelIcon = document.createElement('img');
        channelIcon.className = 'channel-icon';
        channelIcon.src = video.snippet.channelThumbnailUrl; 
        channelIcon.alt = '';

        var desc = document.createElement('div');
        desc.className = 'desc';

        var title = document.createElement('p');
        title.className = 'title';
        title.textContent = video.snippet.title;

        var channelName = document.createElement('p');
        channelName.className = 'channel-name';
        channelName.textContent = video.snippet.channelTitle;

        var views = document.createElement('p');
        views.className = 'views';
        views.textContent = formatViews(video.statistics.viewCount)+" • ";

        var uploadedOn = document.createElement('p');
        uploadedOn.className = 'uploaded-on';
        uploadedOn.textContent = calculateTimeAgo(new Date(video.snippet.publishedAt));

        desc.appendChild(title);
        desc.appendChild(channelName);
        desc.appendChild(views);
        desc.appendChild(uploadedOn);

        videoDesc.appendChild(channelIcon);
        videoDesc.appendChild(desc);

        videoDiv.appendChild(imgContainer);
        videoDiv.appendChild(videoDesc);

        link.appendChild(videoDiv);
        videoGrid.appendChild(link);
    });
}


document.getElementById('searchInput').addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    filterVideos(searchTerm);
});
