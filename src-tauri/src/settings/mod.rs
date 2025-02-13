use crate::logger::{log, LogLevel};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct Settings {
    pub imported_sounds: Vec<String>,
}

impl Settings {
    pub fn add_imported_sound(&mut self, path: String) {
        self.imported_sounds.push(path);
        self.imported_sounds.sort();
        self.imported_sounds.dedup();
    }

    pub fn remove_imported_sound(&mut self, path: &str) -> bool {
        let original_len = self.imported_sounds.len();
        self.imported_sounds.retain(|x| x != path);
        original_len != self.imported_sounds.len()
    }
}

fn get_settings_path() -> PathBuf {
    dirs::data_dir().unwrap().join("soundlab/settings.json")
}

#[tauri::command]
pub fn load_settings() -> Result<Settings, String> {
    let path = get_settings_path();
    if path.exists() {
        let settings_file = fs::read_to_string(&path).map_err(|e| {
            log(
                LogLevel::Error,
                "load_settings",
                &format!("Fehler beim Lesen der settings.json: {}", e),
            );
            format!("Fehler beim Lesen der settings.json: {}", e)
        })?;
        serde_json::from_str(&settings_file).map_err(|e| {
            log(
                LogLevel::Error,
                "load_settings",
                &format!("Fehler beim Parsen der settings.json: {}", e),
            );
            format!("Fehler beim Parsen der settings.json: {}", e)
        })
    } else {
        log(
            LogLevel::Warn,
            "load_settings",
            "settings.json existiert nicht, lade Defaults.",
        );
        Ok(Settings::default())
    }
}

#[tauri::command]
pub fn save_settings(settings: Settings) -> Result<(), String> {
    let path = get_settings_path();
    let settings_file = serde_json::to_string(&settings).map_err(|e| {
        log(
            LogLevel::Error,
            "save_settings",
            &format!("Fehler beim Serialisieren der settings.json: {}", e),
        );
        format!("Fehler beim Serialisieren der settings.json: {}", e)
    })?;

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| {
            log(
                LogLevel::Error,
                "save_settings",
                &format!("Fehler beim Erstellen des Verzeichnisses: {}", e),
            );
            format!("Fehler beim Erstellen des Verzeichnisses: {}", e)
        })?;
    }

    fs::write(path.clone(), settings_file).map_err(|e| {
        log(
            LogLevel::Error,
            "save_settings",
            &format!("Fehler beim Schreiben der settings.json: {}", e),
        );
        format!("Fehler beim Schreiben der settings.json: {}", e)
    })?;

    log(
        LogLevel::Info,
        "save_settings",
        "✅ settings.json gespeichert.",
    );
    Ok(())
}

#[tauri::command]
pub fn get_imported_sounds() -> Result<Vec<String>, String> {
    let path = get_settings_path();
    if path.exists() {
        let settings_file = fs::read_to_string(&path).map_err(|e| {
            log(
                LogLevel::Error,
                "get_imported_sounds",
                &format!("Fehler beim Lesen der settings.json: {}", e),
            );
            format!("Fehler beim Lesen der settings.json: {}", e)
        })?;
        let settings: Settings = serde_json::from_str(&settings_file).map_err(|e| {
            log(
                LogLevel::Error,
                "get_imported_sounds",
                &format!("Fehler beim Parsen der settings.json: {}", e),
            );
            format!("Fehler beim Parsen der settings.json: {}", e)
        })?;
        Ok(settings.imported_sounds)
    } else {
        log(
            LogLevel::Warn,
            "get_imported_sounds",
            "settings.json existiert nicht, lade leere Liste.",
        );
        Ok(Vec::new())
    }
}

#[tauri::command]
pub fn add_imported_sound(path: String) -> Result<(), String> {
    let mut settings = load_settings()?;
    settings.add_imported_sound(path);
    save_settings(settings)?;
    Ok(())
}

#[tauri::command]
pub fn remove_imported_sound(path: String) -> Result<(), String> {
    let mut settings = load_settings()?;
    if settings.remove_imported_sound(&path) {
        save_settings(settings)?;
        Ok(())
    } else {
        Err(format!(
            "Pfad '{}' nicht gefunden in den importierten Sounds",
            path
        ))
    }
}
