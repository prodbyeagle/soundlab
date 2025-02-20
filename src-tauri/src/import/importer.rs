use crate::utils::logger::{log, LogLevel};
use futures::future::join_all;
use sqlx::types::Json;
use std::path::Path;
use std::sync::Arc;
use tokio::fs;

use crate::cache::cache::Cache;
use crate::db::sound::{Sound, SoundRepository};

pub struct Importer {
    repo: Arc<SoundRepository>,
    pub cache: Arc<Cache>,
}

impl Importer {
    pub fn new(repo: Arc<SoundRepository>, cache: Arc<Cache>) -> Arc<Self> {
        log(LogLevel::Info, "Importer::new", "Initializing Importer.");
        Arc::new(Self { repo, cache })
    }

    pub async fn import_sound(self: &Arc<Self>, name: &str, path: &str) -> Result<(), String> {
        log(
            LogLevel::Info,
            "Importer::import_sound",
            &format!("Attempting to import sound '{}'", name),
        );

        if self.cache.get_cached_sound(name).await.is_some() {
            log(
                LogLevel::Warn,
                "Importer::import_sound",
                &format!("Sound '{}' already cached, skipping.", name),
            );
            return Ok(());
        }

        if self
            .repo
            .exists(name)
            .await
            .map_err(|e| format!("DB check failed: {}", e))?
        {
            log(
                LogLevel::Warn,
                "Importer::import_sound",
                &format!("Sound '{}' already exists in database, skipping.", name),
            );
            return Ok(());
        }

        if !Path::new(path).exists() {
            log(
                LogLevel::Error,
                "Importer::import_sound",
                &format!("File '{}' not found.", path),
            );
            return Ok(());
        }

        let sound = Sound {
            id: None,
            name: name.to_string(),
            path: path.to_string(),
            is_favorite: false,
            tags: Json(Vec::new()),
        };

        match self.repo.insert(sound).await {
            Ok(sound_id) => {
                self.cache
                    .cache_sound(name.to_string(), path.to_string())
                    .await;
                log(
                    LogLevel::Info,
                    "Importer::import_sound",
                    &format!("Sound '{}' imported successfully (ID: {}).", name, sound_id),
                );
            }
            Err(e) => {
                log(
                    LogLevel::Error,
                    "Importer::import_sound",
                    &format!("Error importing '{}': {}", name, e),
                );
            }
        }

        Ok(())
    }

    pub async fn import_directory(self: &Arc<Self>, root_path: &str) -> Result<(), String> {
        log(
            LogLevel::Info,
            "Importer::import_directory",
            &format!("Scanning directory '{}'", root_path),
        );

        let mut stack = vec![root_path.to_string()];
        let mut tasks = vec![];

        while let Some(dir_path) = stack.pop() {
            let mut entries = fs::read_dir(&dir_path)
                .await
                .map_err(|e| format!("Error reading directory '{}': {}", dir_path, e))?;

            while let Some(entry) = entries
                .next_entry()
                .await
                .map_err(|e| format!("Error iterating directory '{}': {}", dir_path, e))?
            {
                let path = entry.path();

                if path.is_dir() {
                    stack.push(path.to_string_lossy().into_owned());
                } else if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
                    if ext.eq_ignore_ascii_case("mp3") || ext.eq_ignore_ascii_case("wav") {
                        let name = path
                            .file_stem()
                            .and_then(|s| s.to_str())
                            .unwrap_or("unknown")
                            .to_string();
                        let path_str = path.to_string_lossy().into_owned();
                        tasks.push({
                            let importer = Arc::clone(self);
                            async move { importer.import_sound(&name, &path_str).await }
                        });
                    }
                }
            }
        }

        join_all(tasks).await;

        log(
            LogLevel::Info,
            "Importer::import_directory",
            &format!("Finished importing directory '{}'", root_path),
        );

        Ok(())
    }
}
