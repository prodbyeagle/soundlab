use crate::utils::logger::{log, LogLevel};
use lru::LruCache;
use std::num::NonZeroUsize;
use std::sync::Arc;
use tokio::sync::Mutex;

/// Cache system for storing and retrieving sounds using an LRU cache.
///
/// This struct utilizes an LRU (Least Recently Used) cache to store sound
/// data with their corresponding names. The cache has a fixed size limit and
/// evicts the least recently used entries when the limit is exceeded.
pub struct Cache {
    sound_cache: Arc<Mutex<LruCache<String, String>>>,
}

impl Cache {
    /// Creates a new cache instance with a given size.
    ///
    /// # Arguments
    ///
    /// * `size` - The maximum size of the cache. It must be greater than zero.
    ///
    /// # Returns
    ///
    /// A new `Cache` instance.
    ///
    /// # Panics
    ///
    /// This function will panic if the provided size is zero or less.
    pub fn new(size: usize) -> Self {
        let size = NonZeroUsize::new(size).expect("Cache size must be greater than zero.");
        log(
            LogLevel::Info,
            "Cache::new",
            &format!("Initializing cache with size {}", size),
        );
        Self {
            sound_cache: Arc::new(Mutex::new(LruCache::new(size))),
        }
    }

    /// Caches a sound with its name and path, measuring execution time.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the sound.
    /// * `path` - The path to the sound file.
    ///
    /// # Asynchronous
    ///
    /// This function is asynchronous and should be awaited.
    pub async fn cache_sound(&self, name: String, path: String) {
        let mut cache = self.sound_cache.lock().await;
        cache.put(name.clone(), path);
    }

    /// Retrieves a cached sound by its name, measuring execution time.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the sound.
    ///
    /// # Returns
    ///
    /// `Some(String)` if the sound is found in the cache, or `None` if it is not found.
    ///
    /// # Asynchronous
    ///
    /// This function is asynchronous and should be awaited.
    pub async fn get_cached_sound(&self, name: &str) -> Option<String> {
        let mut cache = self.sound_cache.lock().await;
        let result = cache.get(name).cloned();
        result
    }

    /// Removes a cached sound by its name, measuring execution time.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the sound to be removed.
    ///
    /// # Asynchronous
    ///
    /// This function is asynchronous and should be awaited.
    pub async fn remove_cached_sound(&self, name: &str) {
        let mut cache = self.sound_cache.lock().await;
        cache.pop(name);
    }
}
