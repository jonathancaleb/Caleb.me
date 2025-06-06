---
title: 'Building Rove: My Journey Creating a YouTube Music Clone in Kotlin'
date: '2024-01-15'
---

As someone who's passionate about both music and mobile development, I've always been curious about how music streaming apps work under the hood. When I looked at YouTube Music, Spotify, and other popular players, I wondered: **What would it take to build something similar from scratch?**

That curiosity led me to create **Rove** - a Kotlin-based music player that replicates the core functionality of YouTube Music. This wasn't about building the next big music app; it was about understanding the intricate details of audio streaming, playlist management, and creating a smooth user experience.

## The Problem I Set Out to Solve

Building Rove wasn't about solving a market problem - it was about solving a knowledge problem. I wanted to understand:

- How do music apps handle audio streaming and buffering?
- What goes into creating smooth playback controls?
- How do you build an intuitive music library interface?
- What are the technical challenges of playlist management?

The goal was simple: **Build a functional YouTube Music clone to deeply understand music app architecture**.

## Technical Architecture Decisions

### Why Kotlin for Android?

I chose **Kotlin** for several compelling reasons:

- **Null safety** - Prevents common crashes in audio playback
- **Coroutines** - Perfect for managing async audio operations
- **Interoperability** - Seamless integration with Android's MediaPlayer APIs
- **Concise syntax** - Less boilerplate when handling complex audio states

### The Audio Playback Challenge

The most complex part was implementing smooth audio playback with proper state management:

```kotlin
class AudioPlayerManager {
    private var mediaPlayer: MediaPlayer? = null
    private val playbackState = MutableLiveData<PlaybackState>()
    
    suspend fun playTrack(track: Track) = withContext(Dispatchers.IO) {
        try {
            mediaPlayer?.release()
            mediaPlayer = MediaPlayer().apply {
                setDataSource(track.audioUrl)
                setOnPreparedListener { player ->
                    playbackState.postValue(PlaybackState.READY)
                    player.start()
                }
                setOnCompletionListener {
                    playNextTrack()
                }
                prepareAsync()
            }
        } catch (e: Exception) {
            playbackState.postValue(PlaybackState.ERROR)
        }
    }
}
```

### Database and Local Storage

I used **Room Database** for offline music library management:

```kotlin
@Entity(tableName = "tracks")
data class Track(
    @PrimaryKey val id: String,
    val title: String,
    val artist: String,
    val albumArt: String,
    val audioUrl: String,
    val duration: Long,
    val isLiked: Boolean = false,
    val playCount: Int = 0
)

@Dao
interface TrackDao {
    @Query("SELECT * FROM tracks ORDER BY playCount DESC")
    suspend fun getMostPlayedTracks(): List<Track>
    
    @Query("SELECT * FROM tracks WHERE isLiked = 1")
    suspend fun getLikedTracks(): List<Track>
}
```

## Design Philosophy: Clean and Intuitive

### User Interface Architecture

I followed Material Design 3 principles with a focus on music-first interactions:

- **Bottom navigation** for main sections (Home, Search, Library)
- **Persistent mini-player** that expands to full-screen
- **Gesture-based controls** for skip, like, and repeat
- **Dark theme** optimized for music listening

### Key UI Components

```kotlin
@Composable
fun MiniPlayer(
    currentTrack: Track?,
    isPlaying: Boolean,
    onPlayPause: () -> Unit,
    onNext: () -> Unit,
    onExpand: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onExpand() }
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            AsyncImage(
                model = currentTrack?.albumArt,
                modifier = Modifier.size(48.dp)
            )
            
            Column(modifier = Modifier.weight(1f)) {
                Text(currentTrack?.title ?: "No track")
                Text(currentTrack?.artist ?: "Unknown artist")
            }
            
            IconButton(onClick = onPlayPause) {
                Icon(
                    imageVector = if (isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = "Play/Pause"
                )
            }
        }
    }
}
```

## The Challenges I Overcame

### 1. Audio Focus Management

Android's audio focus system is complex but crucial for a good user experience:

```kotlin
class AudioFocusManager(private val context: Context) {
    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    
    private val focusChangeListener = AudioManager.OnAudioFocusChangeListener { focusChange ->
        when (focusChange) {
            AudioManager.AUDIOFOCUS_LOSS -> pausePlayback()
            AudioManager.AUDIOFOCUS_LOSS_TRANSIENT -> pausePlayback()
            AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> lowerVolume()
            AudioManager.AUDIOFOCUS_GAIN -> resumePlayback()
        }
    }
    
    fun requestAudioFocus(): Boolean {
        val result = audioManager.requestAudioFocus(
            focusChangeListener,
            AudioManager.STREAM_MUSIC,
            AudioManager.AUDIOFOCUS_GAIN
        )
        return result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
    }
}
```

### 2. Background Playback with Foreground Service

Implementing continuous playback when the app is in the background:

```kotlin
class MusicService : Service() {
    private val notificationManager by lazy {
        NotificationManagerCompat.from(this)
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_PLAY -> resumePlayback()
            ACTION_PAUSE -> pausePlayback()
            ACTION_NEXT -> playNext()
            ACTION_PREVIOUS -> playPrevious()
        }
        
        startForeground(NOTIFICATION_ID, createNotification())
        return START_STICKY
    }
    
    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(currentTrack?.title)
            .setContentText(currentTrack?.artist)
            .setSmallIcon(R.drawable.ic_music_note)
            .setLargeIcon(albumArtBitmap)
            .addAction(R.drawable.ic_skip_previous, "Previous", previousPendingIntent)
            .addAction(playPauseIcon, playPauseText, playPausePendingIntent)
            .addAction(R.drawable.ic_skip_next, "Next", nextPendingIntent)
            .setStyle(MediaStyle().setShowActionsInCompactView(0, 1, 2))
            .build()
    }
}
```

### 3. Memory Management for Large Music Libraries

Handling large music collections without consuming excessive memory:

```kotlin
class MusicRepository {
    private val trackCache = LruCache<String, Track>(100)
    
    suspend fun getTracksPaginated(page: Int, pageSize: Int = 20): List<Track> {
        return withContext(Dispatchers.IO) {
            trackDao.getTracksPaginated(page * pageSize, pageSize)
        }
    }
    
    fun preloadAlbumArt(tracks: List<Track>) {
        tracks.forEach { track ->
            // Load album art asynchronously with Glide
            Glide.with(context)
                .load(track.albumArt)
                .preload()
        }
    }
}
```

## Key Features That Make Rove Special

### 1. Smart Playlist Generation

Automatic playlist creation based on listening patterns:

```kotlin
class PlaylistGenerator {
    fun generateMixForUser(userId: String): List<Track> {
        val recentTracks = getRecentlyPlayed(userId)
        val likedGenres = analyzeMusicTaste(recentTracks)
        
        return trackRepository.findSimilarTracks(
            genres = likedGenres,
            excludeIds = recentTracks.map { it.id }
        ).shuffled().take(50)
    }
    
    private fun analyzeMusicTaste(tracks: List<Track>): List<String> {
        return tracks
            .groupBy { it.genre }
            .mapValues { it.value.size }
            .toList()
            .sortedByDescending { it.second }
            .take(3)
            .map { it.first }
    }
}
```

### 2. Offline Support

Download functionality for offline listening:

```kotlin
class DownloadManager {
    suspend fun downloadTrack(track: Track): Flow<DownloadProgress> = flow {
        emit(DownloadProgress.Started)
        
        try {
            val response = apiService.downloadTrack(track.id)
            val fileSize = response.contentLength()
            var downloadedBytes = 0L
            
            response.byteStream().use { inputStream ->
                FileOutputStream(getTrackFile(track)).use { outputStream ->
                    val buffer = ByteArray(8192)
                    var bytesRead: Int
                    
                    while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                        outputStream.write(buffer, 0, bytesRead)
                        downloadedBytes += bytesRead
                        
                        val progress = (downloadedBytes * 100 / fileSize).toInt()
                        emit(DownloadProgress.InProgress(progress))
                    }
                }
            }
            
            emit(DownloadProgress.Completed)
        } catch (e: Exception) {
            emit(DownloadProgress.Failed(e.message ?: "Download failed"))
        }
    }
}
```

### 3. Visualizer and Audio Effects

Real-time audio visualization:

```kotlin
class AudioVisualizer {
    private val visualizer = Visualizer(audioSessionId)
    
    fun startVisualization(onUpdate: (ByteArray) -> Unit) {
        visualizer.apply {
            captureSize = Visualizer.getCaptureSizeRange()[1]
            setDataCaptureListener(
                object : Visualizer.OnDataCaptureListener {
                    override fun onWaveFormDataCapture(
                        visualizer: Visualizer,
                        waveform: ByteArray,
                        samplingRate: Int
                    ) {
                        onUpdate(waveform)
                    }
                    
                    override fun onFftDataCapture(
                        visualizer: Visualizer,
                        fft: ByteArray,
                        samplingRate: Int
                    ) {
                        // Process FFT data for frequency bars
                    }
                },
                Visualizer.getMaxCaptureRate() / 2,
                true,
                false
            )
            enabled = true
        }
    }
}
```

## Lessons Learned Building Rove

### 1. Audio Development is Complex

Working with Android's audio APIs taught me that music apps are far more complex than they appear:

- **State management** becomes critical when dealing with audio focus
- **Memory leaks** are easy to introduce with MediaPlayer
- **Threading** must be handled carefully for smooth playback

### 2. User Experience Details Matter

Small details make a huge difference in music apps:

- **Smooth transitions** between tracks
- **Responsive controls** that feel instant
- **Persistent state** that survives app restarts
- **Intelligent buffering** that prevents interruptions

### 3. Performance Optimization is Crucial

Music apps need to be exceptionally smooth:

```kotlin
// Example of optimized list scrolling
@Composable
fun LazyTrackList(tracks: List<Track>) {
    LazyColumn {
        items(
            items = tracks,
            key = { it.id }
        ) { track ->
            TrackItem(
                track = track,
                modifier = Modifier.animateItemPlacement()
            )
        }
    }
}
```

## What I Discovered About Music App Architecture

### The Three-Layer Architecture

1. **Presentation Layer** - Jetpack Compose UI components
2. **Domain Layer** - Business logic and use cases
3. **Data Layer** - Repository pattern with Room and network APIs

### Critical Components

- **MediaSession** for external control integration
- **ExoPlayer** for advanced playback features
- **WorkManager** for background downloads
- **Hilt** for dependency injection

## Technical Stack Summary

**Android Development:**

- Kotlin with Coroutines
- Jetpack Compose for UI
- Room Database for local storage
- Hilt for dependency injection

**Audio & Media:**

- MediaPlayer/ExoPlayer for playback
- MediaSession for controls
- Foreground Service for background play
- Notification media controls

**Architecture:**

- MVVM with Repository pattern
- Clean Architecture principles
- Flow for reactive data
- StateFlow for UI state management

## Building in Public: What I Learned

Creating Rove was an incredible learning experience that taught me:

### About Audio Development

- The complexity of audio focus management
- How background playback actually works
- The importance of proper memory management

### About Mobile Architecture

- How to structure complex media apps
- The power of Kotlin coroutines for async operations
- Why dependency injection matters at scale

### About User Experience

- How subtle animations improve perceived performance
- Why consistent state management is crucial
- The importance of offline functionality

## The Numbers After 6 Months

While Rove is primarily a learning project:

- **5,000+ lines** of Kotlin code
- **50+ UI components** built with Compose
- **20+ background operations** properly managed
- **Zero memory leaks** in audio playback (after lots of debugging!)

## Try Rove and Explore the Code

Rove is available on [GitHub](https://github.com/jonathancaleb/Rove) where you can explore the complete implementation. It's a functional music player that demonstrates:

- Professional Android development practices
- Clean architecture in Kotlin
- Advanced audio playback features
- Modern UI with Jetpack Compose

The most rewarding part? **Understanding exactly how music streaming apps work under the hood**.

---

*This is part of my "building in public" series where I document learning journeys through practical projects. Building Rove taught me more about Android audio development than any tutorial could.*
