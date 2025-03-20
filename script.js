const videoListContainer = document.getElementById('video-list');
const searchInput = document.getElementById('search-input');

let allVideos = [];

// fetch videos from the API
async function fetchVideos() {
    try {
        // make api request
        const response = await fetch('https://api.freeapi.app/api/v1/public/youtube/videos');
        const data = await response.json();
        console.log("api data", data);

        // Extract video items from the nested response
        allVideos = data.data.data.flatMap(item => item.items); // Extract the actual video items
        renderVideos(allVideos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        videoListContainer.innerHTML = '<p>Failed to load videos.</p>';
    }
}

// display videos in the ui
function renderVideos(videos) {
    // Clear the existing videos
    videoListContainer.innerHTML = '';
    // Display the message if no videos are found
    if (videos.length === 0) {
        videoListContainer.innerHTML = '<p>No videos found.</p>';
        return;
    }

    // create HTML elements for each video
    videos.forEach(video => {
        // create container for video item
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');

        // Create clickable link to YouTube
        const videoLink = document.createElement('a');
        videoLink.href = `https://www.youtube.com/watch?v=${video.id}`;
        videoLink.target = '_blank';

        // Create thumbnail
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.classList.add('thumbnail-container');
        const thumbnail = document.createElement('img');

        thumbnail.src = video.snippet.thumbnails.high.url;
        thumbnail.alt = video.snippet.title;
        thumbnail.classList.add('thumbnail');
        thumbnailContainer.appendChild(thumbnail);
        videoLink.appendChild(thumbnailContainer);

        // Create video info (title and channel)
        const videoInfo = document.createElement('div');
        videoInfo.classList.add('video-info');
        const title = document.createElement('h3');
        title.classList.add('video-title');
        title.textContent = video.snippet.title;
        const channel = document.createElement('p');
        channel.classList.add('channel-name');
        channel.textContent = video.snippet.channelTitle;
        videoInfo.appendChild(title);
        videoInfo.appendChild(channel);
        videoLink.appendChild(videoInfo);

        // Append the video item to the list
        videoItem.appendChild(videoLink);
        videoListContainer.appendChild(videoItem);
    });
}

// Search videos when user types in the search bar
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    // Filter videos based on the search term
    const filteredVideos = allVideos.filter(video =>
        video.snippet.title.toLowerCase().includes(searchTerm) ||
        video.snippet.channelTitle.toLowerCase().includes(searchTerm)
    );
    // Display the filtered videos
    renderVideos(filteredVideos);
});

// Load videos when page loads
fetchVideos();