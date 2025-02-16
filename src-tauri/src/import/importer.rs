use std::path::Path;
use std::sync::Arc;
use tokio::fs;
use mongodb::bson::DateTime;
use mongodb::error::Result as MongoResult;

use crate::db::sound::{Sound, SoundRepository};
use crate::cache::cache::Cache;

pub struct Importer {
    repo: Arc<SoundRepository>,
    cache: Arc<Cache>,
}

impl Importer {
    pub fn new(repo: Arc<SoundRepository>, cache: Arc<Cache>) -> Self {
        Self { repo, cache }
    }

    /// Prüft, ob die Datei bereits existiert, und importiert sie falls nicht
    pub async fn import_sound(&self, name: &str, path: &str) -> MongoResult<()> {
        if self.cache.get_cached_sound(name).await.is_some() {
            println!("Sound '{}' bereits im Cache, Import übersprungen.", name);
            return Ok(());
        }

        if !Path::new(path).exists() {
            println!("Fehler: Datei '{}' nicht gefunden.", path);
            return Ok(());
        }

        let sound = Sound {
            id: None,
            name: name.to_string(),
            path: path.to_string(),
            created_at: DateTime::now(),
        };

        let sound_id = self.repo.insert(sound).await?;
        self.cache.cache_sound(name.to_string(), path.to_string()).await;

        println!("Sound '{}' erfolgreich importiert (ID: {}).", name, sound_id);
        Ok(())
    }

    /// Scannt einen Ordner und importiert alle MP3/WAV-Dateien
    pub async fn import_directory(&self, dir_path: &str) -> MongoResult<()> {
        let mut paths = fs::read_dir(dir_path).await?;

        let mut handles = vec![];

        while let Ok(Some(entry)) = paths.next_entry().await {
            let path = entry.path();
            if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
                if ext.eq_ignore_ascii_case("mp3") || ext.eq_ignore_ascii_case("wav") {
                    let name = path.file_stem().unwrap().to_string_lossy().into_owned();
                    let path_str = path.to_string_lossy().into_owned();

                    let repo = Arc::clone(&self.repo);
                    let cache = Arc::clone(&self.cache);

                    handles.push(tokio::spawn(async move {
                        let importer = Importer::new(repo, cache);
                        importer.import_sound(&name, &path_str).await.ok();
                    }));
                }
            }
        }

        for handle in handles {
            handle.await.ok();
        }

        println!("Import abgeschlossen für Ordner: {}", dir_path);
        Ok(())
    }
}
