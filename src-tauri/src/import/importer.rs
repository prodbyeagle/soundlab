use futures::future::join_all;
use std::path::Path;
use std::sync::Arc;
use tokio::fs;

use crate::cache::cache::Cache;
use crate::db::sound::{Sound, SoundRepository};

pub struct Importer {
    repo: Arc<SoundRepository>,
    cache: Arc<Cache>,
}

impl Importer {
    pub fn new(repo: Arc<SoundRepository>, cache: Arc<Cache>) -> Arc<Self> {
        Arc::new(Self { repo, cache })
    }

    /// Imports a single sound file.
    pub async fn import_sound(self: &Arc<Self>, name: &str, path: &str) -> Result<(), String> {
        // Check if the sound is already cached.
        if self.cache.get_cached_sound(name).await.is_some() {
            println!("Sound '{}' bereits im Cache, Import übersprungen.", name);
            return Ok(());
        }

        // Check if the file exists on disk.
        if !Path::new(path).exists() {
            eprintln!("Fehler: Datei '{}' nicht gefunden.", path);
            return Ok(());
        }

        // Create a new Sound entry.
        let sound = Sound {
            id: None,
            name: name.to_string(),
            path: path.to_string(),
        };

        // Try inserting the sound using the SQLx repository.
        match self.repo.insert(sound).await {
            Ok(sound_id) => {
                // Cache the sound if insertion was successful.
                self.cache
                    .cache_sound(name.to_string(), path.to_string())
                    .await;
                println!(
                    "Sound '{}' erfolgreich importiert (ID: {}).",
                    name, sound_id
                );
            }
            Err(e) => {
                eprintln!("Fehler beim Import von '{}': {}", name, e);
                // You may choose to propagate the error here if desired.
            }
        }

        Ok(())
    }

    /// Imports all sound files (mp3 or wav) from a given directory.
    pub async fn import_directory(self: &Arc<Self>, dir_path: &str) -> Result<(), String> {
        let mut entries = fs::read_dir(dir_path)
            .await
            .map_err(|e| format!("Fehler beim Lesen des Ordners '{}': {}", dir_path, e))?;

        let mut tasks = vec![];

        while let Some(entry) = entries
            .next_entry()
            .await
            .map_err(|e| format!("Fehler beim Iterieren im Ordner '{}': {}", dir_path, e))?
        {
            let path = entry.path();
            if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
                if ext.eq_ignore_ascii_case("mp3") || ext.eq_ignore_ascii_case("wav") {
                    // Use the file stem as the sound name.
                    let name = path
                        .file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("unknown")
                        .to_string();
                    let path_str = path.to_string_lossy().into_owned();

                    let importer = Arc::clone(self);
                    tasks.push(tokio::spawn(async move {
                        if let Err(e) = importer.import_sound(&name, &path_str).await {
                            eprintln!("Fehler beim Importieren von '{}': {}", name, e);
                        }
                    }));
                }
            }
        }

        // Wait for all import tasks to complete.
        join_all(tasks).await;

        println!("Import abgeschlossen für Ordner: {}", dir_path);
        Ok(())
    }
}
