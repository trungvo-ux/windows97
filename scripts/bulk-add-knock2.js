// Bulk add KNOCK2 tracks to iPod
// Run this in the browser console while the iPod app is open
// Replace the YouTube URLs below with actual KNOCK2 video URLs

const knock2Urls = [
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1", // dashstar*
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2", // dashstar* (VIP)
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3", // Gettin' Hott
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_4", // Make U Sweat!
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_5", // rock ur world
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_6", // murdah
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_7", // One Chance
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_8", // Buttons!
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_9", // Speak Up!
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_10", // Paranoid
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_11", // Jade
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_12", // Feel U Luv Me
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_13", // Hold My Hand
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_14", // Come Aliv3
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_15", // What's the Move
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_16", // Japan
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_17", // Radial
  "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_18", // Dvncefloor
];

// Import the store (adjust path if needed)
const { useIpodStore } = await import('/src/stores/useIpodStore.ts');

// Add all tracks
(async () => {
  console.log("Starting to add KNOCK2 tracks...");
  for (let i = 0; i < knock2Urls.length; i++) {
    const url = knock2Urls[i];
    if (url.includes("YOUR_VIDEO_ID")) {
      console.log(`Skipping placeholder URL at index ${i}`);
      continue;
    }
    try {
      const track = await useIpodStore.getState().addTrackFromVideoId(url);
      if (track) {
        console.log(`✓ Added: ${track.title}`);
      } else {
        console.log(`✗ Failed to add: ${url}`);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ Error adding ${url}:`, error);
    }
  }
  console.log("Done! Check your iPod library.");
})();

