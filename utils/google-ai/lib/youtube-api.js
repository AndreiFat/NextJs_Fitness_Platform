export async function searchYouTubeVideos(query) {
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    const params = new URLSearchParams({
        part: "snippet",
        q: query,
        key: YOUTUBE_API_KEY,
        maxResults: 5,
        type: "video",
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.items) return [];

        return data.items.map(item => ({
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            videoId: item.id.videoId,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channelTitle: item.snippet.channelTitle,
        }));
    } catch (error) {
        console.error("YouTube fetch error:", error);
        return [];
    }
}