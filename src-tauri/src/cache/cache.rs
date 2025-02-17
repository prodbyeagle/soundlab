use lru::LruCache;
use std::num::NonZeroUsize;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct Cache {
    sound_cache: Arc<Mutex<LruCache<String, String>>>,
    // settings_cache: Arc<Mutex<LruCache<String, String>>>,
}

impl Cache {
    pub fn new(size: usize) -> Self {
        let size = NonZeroUsize::new(size).unwrap();
        Self {
            sound_cache: Arc::new(Mutex::new(LruCache::new(size))),
            // settings_cache: Arc::new(Mutex::new(LruCache::new(size))),
        }
    }

    pub async fn cache_sound(&self, name: String, path: String) {
        let mut cache = self.sound_cache.lock().await;
        cache.put(name, path);
    }

    pub async fn get_cached_sound(&self, name: &str) -> Option<String> {
        let mut cache = self.sound_cache.lock().await;
        cache.get(name).cloned()
    }

    // pub async fn cache_setting(&self, key: String, value: String) {
    //     let mut cache = self.settings_cache.lock().await;
    //     cache.put(key, value);
    // }

    // pub async fn get_cached_setting(&self, key: &str) -> Option<String> {
    //     let mut cache = self.settings_cache.lock().await;
    //     cache.get(key).cloned()
    // }
}
