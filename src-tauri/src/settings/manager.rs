use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;

const CONFIG_PATH: &str = "config.json";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    imported_paths: Vec<String>,
}

impl Config {
    fn new() -> Self {
        Self {
            imported_paths: vec![],
        }
    }

    fn load() -> Self {
        match fs::read_to_string(CONFIG_PATH) {
            Ok(content) => serde_json::from_str(&content).unwrap_or_else(|_| Self::new()),
            Err(_) => Self::new(),
        }
    }

    fn save(&self) {
        let content = serde_json::to_string_pretty(self).unwrap();
        fs::write(CONFIG_PATH, content).unwrap();
    }
}

lazy_static! {
    static ref SETTINGS: Mutex<Config> = Mutex::new(Config::load());
}

/// Fügt einen neuen Import-Pfad hinzu und speichert ihn
pub fn add_import_path(path: String) {
    let mut settings = SETTINGS.lock().unwrap();
    if !settings.imported_paths.contains(&path) {
        settings.imported_paths.push(path);
        settings.save();
    }
}

/// Gibt alle gespeicherten Import-Pfade zurück
pub fn get_import_paths() -> Vec<String> {
    SETTINGS.lock().unwrap().imported_paths.clone()
}
