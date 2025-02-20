use crate::utils::logger::{log, LogLevel};
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
        log(
            LogLevel::Info,
            "Config::new",
            "Creating new Config instance.",
        );
        Self {
            imported_paths: vec![],
        }
    }

    fn load() -> Self {
        let config_dir = config_dir().expect("Failed to get config directory");
        let config_path = config_dir.join("soundlab").join("config.json");

        match fs::read_to_string(&config_path) {
            Ok(content) => {
                log(
                    LogLevel::Info,
                    "Config::load",
                    &format!("Loading config from '{}'", config_path.display()),
                );
                serde_json::from_str(&content).unwrap_or_else(|_| {
                    log(
                        LogLevel::Error,
                        "Config::load",
                        &format!("Failed to parse config, using default settings."),
                    );
                    Self::new()
                })
            }
            Err(_) => {
                log(
                    LogLevel::Warn,
                    "Config::load",
                    "Config file not found, using default settings.",
                );
                Self::new()
            }
        }
    }

    fn save(&self) {
        let config_dir = config_dir().expect("Failed to get config directory");
        let config_path = config_dir.join("soundlab").join("config.json");

        if let Some(parent) = config_path.parent() {
            if !parent.exists() {
                if let Err(e) = fs::create_dir_all(parent) {
                    log(
                        LogLevel::Error,
                        "Config::save",
                        &format!("Failed to create config directory: {}", e),
                    );
                    return;
                }
            }
        }

        match serde_json::to_string_pretty(self) {
            Ok(content) => {
                if let Err(e) = fs::write(&config_path, content) {
                    log(
                        LogLevel::Error,
                        "Config::save",
                        &format!("Failed to save config: {}", e),
                    );
                } else {
                    log(
                        LogLevel::Info,
                        "Config::save",
                        &format!("Config saved successfully to '{}'", config_path.display()),
                    );
                }
            }
            Err(e) => log(
                LogLevel::Error,
                "Config::save",
                &format!("Failed to serialize config: {}", e),
            ),
        }
    }
}

pub fn add_import_path(path: String) {
    let mut settings = SETTINGS.lock().unwrap();
    if !settings.imported_paths.contains(&path) {
        settings.imported_paths.push(path);
        settings.save();
    }
}

pub fn remove_import_path(path: &str) -> Vec<String> {
    let mut settings = SETTINGS.lock().unwrap();

    if let Some(index) = settings.imported_paths.iter().position(|p| p == path) {
        settings.imported_paths.remove(index);
        settings.save();
    }

    settings.imported_paths.clone()
}

pub fn get_import_paths() -> Vec<String> {
    SETTINGS.lock().unwrap().imported_paths.clone()
}
