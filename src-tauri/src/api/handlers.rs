use std::sync::Arc;
use tauri::State;

use crate::db::sound::{Sound, SoundRepository};
use crate::import::importer::Importer;
use crate::settings::manager::{add_import_path, get_import_paths};

#[derive(Clone)]
pub struct Api {
    pub repo: Arc<SoundRepository>,
    pub importer: Arc<Importer>,
    // pub cache: Arc<Cache>,
}

impl Api {
    pub fn new(repo: Arc<SoundRepository>, importer: Arc<Importer>) -> Self {
        Self { repo, importer }
    }

    /// Imports a single sound.
    pub async fn import_sound_method(&self, name: String, path: String) -> Result<(), String> {
        self.importer
            .import_sound(&name, &path)
            .await
            .map_err(|e| format!("Error importing sound: {}", e))?;
        add_import_path(path);
        Ok(())
    }

    /// Imports all sounds from a directory.
    pub async fn import_directory_method(&self, dir_path: String) -> Result<(), String> {
        self.importer
            .import_directory(&dir_path)
            .await
            .map_err(|e| format!("Error importing directory: {}", e))?;
        add_import_path(dir_path);
        Ok(())
    }

    /// Returns all sounds from the database.
    pub async fn get_sounds_method(&self) -> Result<Vec<Sound>, String> {
        let sounds = self
            .repo
            .get_all()
            .await
            .map_err(|e| format!("Error fetching sounds: {}", e))?;
        Ok(sounds)
    }

    /// Deletes a sound by its ID. The ID is provided as a String which is parsed into an i64.
    pub async fn delete_sound_method(&self, id: String) -> Result<(), String> {
        let parsed_id: i64 = id.parse().map_err(|e| format!("Invalid id: {}", e))?;
        self.repo
            .delete(parsed_id)
            .await
            .map_err(|e| format!("Error deleting sound: {}", e))?;
        Ok(())
    }

    /// Returns the list of imported paths.
    pub async fn get_imported_paths_method(&self) -> Result<Vec<String>, String> {
        Ok(get_import_paths())
    }
}

// --- Tauri Command Wrappers ---

#[tauri::command]
pub async fn import_sound(api: State<'_, Api>, name: String, path: String) -> Result<(), String> {
    api.import_sound_method(name, path).await
}

#[tauri::command]
pub async fn import_directory(api: State<'_, Api>, dir_path: String) -> Result<(), String> {
    api.import_directory_method(dir_path).await
}

#[tauri::command]
pub async fn get_sounds(api: State<'_, Api>) -> Result<Vec<Sound>, String> {
    api.get_sounds_method().await
}

#[tauri::command]
pub async fn delete_sound(api: State<'_, Api>, id: String) -> Result<(), String> {
    api.delete_sound_method(id).await
}

#[tauri::command]
pub async fn get_imported_paths(api: State<'_, Api>) -> Result<Vec<String>, String> {
    api.get_imported_paths_method().await
}
