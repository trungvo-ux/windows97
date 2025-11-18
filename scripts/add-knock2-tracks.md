# How to Add KNOCK2 Tracks to iPod

Since I can't get the exact YouTube video IDs automatically, here's the easiest way to add all KNOCK2 tracks:

## Quick Method (Recommended)

1. Open the iPod app in your browser
2. Open browser console (F12 or Cmd+Option+I)
3. Copy and paste this script:

```javascript
// KNOCK2 tracks - you'll need to replace the video IDs with real ones
const knock2Tracks = [
  "YOUR_VIDEO_ID_HERE", // dashstar*
  "YOUR_VIDEO_ID_HERE", // dashstar* (VIP)
  "YOUR_VIDEO_ID_HERE", // Gettin' Hott
  "YOUR_VIDEO_ID_HERE", // Make U Sweat!
  "YOUR_VIDEO_ID_HERE", // rock ur world
  "YOUR_VIDEO_ID_HERE", // murdah
  "YOUR_VIDEO_ID_HERE", // One Chance
  "YOUR_VIDEO_ID_HERE", // Buttons!
  "YOUR_VIDEO_ID_HERE", // Speak Up!
  "YOUR_VIDEO_ID_HERE", // Paranoid
  "YOUR_VIDEO_ID_HERE", // Jade
  "YOUR_VIDEO_ID_HERE", // Feel U Luv Me
  "YOUR_VIDEO_ID_HERE", // Hold My Hand
  "YOUR_VIDEO_ID_HERE", // Come Aliv3
  "YOUR_VIDEO_ID_HERE", // What's the Move
  "YOUR_VIDEO_ID_HERE", // Japan
  "YOUR_VIDEO_ID_HERE", // Radial
  "YOUR_VIDEO_ID_HERE", // Dvncefloor
];

// Add all tracks
(async () => {
  const store = window.__ZUSTAND_STORES__?.ipod || useIpodStore;
  for (const videoId of knock2Tracks) {
    try {
      await store.getState().addTrackFromVideoId(videoId);
      console.log(`Added track: ${videoId}`);
    } catch (error) {
      console.error(`Failed to add ${videoId}:`, error);
    }
  }
  console.log("Done adding KNOCK2 tracks!");
})();
```

## Manual Method

Use the iPod's built-in "Add Track" feature:
1. Open iPod menu → File → Add Track
2. Search YouTube for "KNOCK2 [song name]"
3. Copy the YouTube URL and paste it
4. Repeat for each track

## Find Video IDs

To find YouTube video IDs:
1. Go to YouTube and search for "KNOCK2 [song name]"
2. Click on the video
3. Copy the URL (e.g., `https://www.youtube.com/watch?v=ABC123xyz`)
4. The video ID is the part after `v=` (e.g., `ABC123xyz`)

