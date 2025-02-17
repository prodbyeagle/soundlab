use futures::future::join_all;
use std::path::Path;
use std::sync::Arc;
use tokio::fs;

use crate::cache::cache::Cache;
use crate::db::sound::{Sound, SoundRepository};

/// A struct for importing sound files, interacting with both the sound repository and the cache.
pub struct Importer {
    repo: Arc<SoundRepository>,
    cache: Arc<Cache>,
}

impl Importer {
    /// Creates a new `Importer` instance with a given `SoundRepository` and `Cache`.
    ///
    /// # Arguments
    ///
    /// * `repo` - The `SoundRepository` for inserting sound records into the database.
    /// * `cache` - The `Cache` for storing sound data in-memory.
    ///
    /// # Returns
    ///
    /// A new `Importer` wrapped in an `Arc`.
    pub fn new(repo: Arc<SoundRepository>, cache: Arc<Cache>) -> Arc<Self> {
        Arc::new(Self { repo, cache })
    }

    /// Imports a single sound file by checking if it exists and is not already cached.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the sound file.
    /// * `path` - The path to the sound file on disk.
    ///
    /// # Returns
    ///
    /// A `Result` indicating success or an error message if any issues arise.
    pub async fn import_sound(self: &Arc<Self>, name: &str, path: &str) -> Result<(), String> {
        if self.cache.get_cached_sound(name).await.is_some() {
            println!("Sound '{}' already cached, skipping import.", name);
            return Ok(());
        }

        if !Path::new(path).exists() {
            eprintln!("Error: File '{}' not found.", path);
            return Ok(());
        }

        let sound = Sound {
            id: None,
            name: name.to_string(),
            path: path.to_string(),
        };

        match self.repo.insert(sound).await {
            Ok(sound_id) => {
                self.cache
                    .cache_sound(name.to_string(), path.to_string())
                    .await;
                println!("Sound '{}' imported successfully (ID: {}).", name, sound_id);
            }
            Err(e) => {
                eprintln!("Error importing '{}': {}", name, e);
            }
        }

        Ok(())
    }

    /// Imports all sound files (MP3 or WAV) from a specified directory.
    ///
    /// # Arguments
    ///
    /// * `dir_path` - The path to the directory containing sound files to import.
    ///
    /// # Returns
    ///
    /// A `Result` indicating success or failure of the operation.
    pub async fn import_directory(self: &Arc<Self>, dir_path: &str) -> Result<(), String> {
        let mut entries = fs::read_dir(dir_path)
            .await
            .map_err(|e| format!("Error reading directory '{}': {}", dir_path, e))?;

        let mut tasks = vec![];

        while let Some(entry) = entries
            .next_entry()
            .await
            .map_err(|e| format!("Error iterating through directory '{}': {}", dir_path, e))?
        {
            let path = entry.path();
            if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
                if ext.eq_ignore_ascii_case("mp3") || ext.eq_ignore_ascii_case("wav") {
                    let name = path
                        .file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("unknown")
                        .to_string();
                    let path_str = path.to_string_lossy().into_owned();

                    let importer = Arc::clone(self);
                    tasks.push(tokio::spawn(async move {
                        if let Err(e) = importer.import_sound(&name, &path_str).await {
                            eprintln!("Error importing '{}': {}", name, e);
                        }
                    }));
                }
            }
        }

        join_all(tasks).await;

        println!("Import complete for directory: {}", dir_path);
        Ok(())
    }
}
