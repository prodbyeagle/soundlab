use std::fs;
use std::path::Path;
use crate::cache;

/// Importiert eine einzelne Datei und speichert sie im Cache.
#[tauri::command]
pub fn import_file(path: String) -> Result<String, String> {
    if cache::get(&path).is_some() {
        return Ok(path.clone());
    }

    fs::metadata(&path)
        .map_err(|e| format!("Fehler beim Zugriff auf die Datei '{}': {}", path, e))?;

    cache::insert(&path, path.clone())?;
    Ok(path)
}

/// Scannt ein Verzeichnis rekursiv nach MP3- und WAV-Dateien.
fn scan_directory(path: &Path, results: &mut Vec<String>) -> Result<(), String> {
    let entries = fs::read_dir(path)
        .map_err(|e| format!("Fehler beim Lesen des Verzeichnisses '{}': {}", path.display(), e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Fehler beim Einlesen eines Verzeichniseintrags: {}", e))?;
        let file_path = entry.path();

        if file_path.is_dir() {
            scan_directory(&file_path, results)?;
        } else if let Some(ext) = file_path.extension() {
            if ext == "mp3" || ext == "wav" {
                if let Some(path_str) = file_path.to_str() {
                    println!("📁 Gefunden: {}", path_str);
                    results.push(path_str.to_string());
                }
            }
        }
    }

    Ok(())
}

/// Importiert alle MP3- und WAV-Dateien aus einem Ordner rekursiv.
#[tauri::command]
pub fn import_directory(path: String) -> Result<Vec<String>, String> {
    let mut results = Vec::new();
    let root_path = Path::new(&path);

    if !root_path.exists() {
        return Err(format!("Das Verzeichnis '{}' existiert nicht!", path));
    }

    println!("🔍 Starte Scan für Verzeichnis: {}", path);
    scan_directory(root_path, &mut results)?;
    println!("✅ Scan abgeschlossen. {} Dateien gefunden.", results.len());

    Ok(results)
}
