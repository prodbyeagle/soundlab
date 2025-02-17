use dirs::config_dir;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;

lazy_static! {
    static ref SETTINGS: Mutex<Config> = Mutex::new(Config::load());
}

/// Represents the configuration of the application, specifically managing imported paths.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    /// List of paths to the imported sound files.
    imported_paths: Vec<String>,
}

impl Config {
    /// Creates a new `Config` instance with an empty list of imported paths.
    ///
    /// # Returns
    ///
    /// A new `Config` instance with no imported paths.
    fn new() -> Self {
        Self {
            imported_paths: vec![],
        }
    }

    /// Loads the configuration from the `config.json` file located in the user’s configuration directory.
    ///
    /// # Returns
    ///
    /// A `Config` instance containing the imported paths, or a default instance if the file does not exist or is invalid.
    fn load() -> Self {
        let config_dir = config_dir().expect("Failed to get config directory");
        let config_path = config_dir.join("soundlab").join("config.json");

        match fs::read_to_string(config_path) {
            Ok(content) => serde_json::from_str(&content).unwrap_or_else(|_| Self::new()),
            Err(_) => Self::new(),
        }
    }

    /// Saves the current configuration (imported paths) to the `config.json` file.
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

/// Adds a new import path to the configuration and saves it.
///
/// # Arguments
///
/// * `path` - The path to be added to the list of imported paths.
pub fn add_import_path(path: String) {
    let mut settings = SETTINGS.lock().unwrap();
    if !settings.imported_paths.contains(&path) {
        settings.imported_paths.push(path);
        settings.save();
    }
}

/// Retrieves the list of all imported paths from the configuration.
///
/// # Returns
///
/// A vector containing all the imported paths.
pub fn get_import_paths() -> Vec<String> {
    SETTINGS.lock().unwrap().imported_paths.clone()
}
