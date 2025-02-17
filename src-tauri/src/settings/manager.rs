use dirs::config_dir;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;

lazy_static! {
    static ref SETTINGS: Mutex<Config> = Mutex::new(Config::load());
}

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
        let config_dir = config_dir().expect("Failed to get config directory");
        let config_path = config_dir.join("soundlab").join("config.json");

        match fs::read_to_string(config_path) {
            Ok(content) => serde_json::from_str(&content).unwrap_or_else(|_| Self::new()),
            Err(_) => Self::new(),
        }
    }

    fn save(&self) {
        let config_dir = config_dir().expect("Failed to get config directory");
        let config_path = config_dir.join("soundlab").join("config.json");

        if !config_path.parent().unwrap().exists() {
            fs::create_dir_all(config_path.parent().unwrap())
                .expect("Failed to create config directory");
        }

        let content = serde_json::to_string_pretty(self).unwrap();
        fs::write(config_path, content).unwrap();
    }
}

pub fn add_import_path(path: String) {
    let mut settings = SETTINGS.lock().unwrap();
    if !settings.imported_paths.contains(&path) {
        settings.imported_paths.push(path);
        settings.save();
    }
}

pub fn get_import_paths() -> Vec<String> {
    SETTINGS.lock().unwrap().imported_paths.clone()
}
