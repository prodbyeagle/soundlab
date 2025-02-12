use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;
use dirs;

#[derive(Serialize, Deserialize, Default, Debug)]
struct Settings {
    current_theme: String,
    imported_sounds: Vec<String>,
}

// Globaler Lazy-Store (wird hier vor allem zum Laden/Speichern verwendet)
// static SETTINGS: Lazy<Mutex<Settings>> = Lazy::new(|| Mutex::new(Settings::default()));

/// Ermittelt den Pfad zur settings.json, z.B. C:\Users\<User>\AppData\Roaming\soundlab\settings.json
pub fn get_settings_path() -> PathBuf {
    let app_data_path = dirs::data_dir().unwrap().join("soundlab");
    app_data_path.join("settings.json")
}

/// Lädt die Einstellungen aus settings.json (oder liefert Default zurück, falls die Datei nicht existiert)
fn load_settings() -> Result<Settings, String> {
    let path = get_settings_path();
    if path.exists() {
        let settings_file = fs::read_to_string(&path)
            .map_err(|e| format!("Fehler beim Lesen der settings.json: {}", e))?;
        serde_json::from_str(&settings_file)
            .map_err(|e| format!("Fehler beim Parsen der settings.json: {}", e))
    } else {
        Ok(Settings::default())
    }
}

/// Speichert die Einstellungen in settings.json
fn save_settings(settings: &Settings) -> Result<(), String> {
    let path = get_settings_path();
    let settings_file = serde_json::to_string(settings)
        .map_err(|e| format!("Fehler beim Serialisieren der settings.json: {}", e))?;
    fs::create_dir_all(path.parent().unwrap())
        .map_err(|e| format!("Fehler beim Erstellen des Verzeichnisses: {}", e))?;
    fs::write(&path, settings_file)
        .map_err(|e| format!("Fehler beim Schreiben der settings.json: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn get_imported_sounds() -> Result<Vec<String>, String> {
    let settings = load_settings()?;
    Ok(settings.imported_sounds)
}

#[tauri::command]
pub fn add_imported_sound(path: String) -> Result<(), String> {
    let mut settings = load_settings()?;
    settings.imported_sounds.push(path);
    save_settings(&settings)?;
    Ok(())
}

#[tauri::command]
pub fn get_available_themes() -> Result<Vec<String>, String> {
    // Bestimme das Themes-Verzeichnis relativ zur settings.json
    let themes_dir = get_settings_path().parent().unwrap().join("themes");
    
    // Falls das Verzeichnis nicht existiert, einfach erstellen und evtl. ein Default-Theme anlegen
    if !themes_dir.exists() {
        fs::create_dir_all(&themes_dir)
            .map_err(|e| format!("Fehler beim Erstellen des Themes-Verzeichnisses: {}", e))?;
        // Optional: Du könntest hier direkt ein Default-Theme erstellen.
    }
    
    let entries = fs::read_dir(&themes_dir)
        .map_err(|e| format!("Fehler beim Lesen des Themes-Verzeichnisses: {}", e))?;
    
    let mut themes = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| format!("Fehler beim Einlesen eines Theme-Eintrags: {}", e))?;
        let path = entry.path();
        if path.is_file() {
            if let Some(ext) = path.extension() {
                if ext == "json" {
                    if let Some(name) = path.file_stem().and_then(|s| s.to_str()) {
                        themes.push(name.to_string());
                    }
                }
            }
        }
    }
    Ok(themes)
}
