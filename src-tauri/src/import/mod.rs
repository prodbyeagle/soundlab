use crate::logger::{log, LogLevel};
use crate::settings::{load_settings, save_settings};
use std::path::Path;
use tokio::fs;

pub async fn scan_directory(path: &Path) -> Result<Vec<String>, String> {
    let mut results = Vec::new();
    let mut stack = vec![path.to_path_buf()];

    while let Some(current_path) = stack.pop() {
        let mut entries = fs::read_dir(&current_path).await.map_err(|e| {
            format!(
                "Fehler beim Lesen des Verzeichnisses '{}': {}",
                current_path.display(),
                e
            )
        })?;

        while let Some(entry) = entries
            .next_entry()
            .await
            .map_err(|e| format!("Fehler beim Lesen eines Eintrags: {}", e))?
        {
            let file_path = entry.path();
            if file_path.is_dir() {
                stack.push(file_path);
            } else if let Some(ext) = file_path.extension() {
                if ext == "mp3" || ext == "wav" {
                    if let Some(path_str) = file_path.to_str() {
                        results.push(path_str.to_string());
                    }
                }
            }
        }
    }

    Ok(results)
}

#[tauri::command]
pub async fn import_folder(folder_path: String) -> Result<(), String> {
    let root_path = Path::new(&folder_path);
    if !root_path.exists() || !root_path.is_dir() {
        return Err(format!("📂 Ungültiges Verzeichnis: {}", folder_path));
    }

    let scanned_files = scan_directory(root_path).await?;
    let mut settings = load_settings()?;

    settings.imported_sounds.extend(scanned_files);
    settings.imported_sounds.sort();
    settings.imported_sounds.dedup();

    save_settings(settings.clone())?; // Übergib den Wert und nicht die Referenz

    log(
        LogLevel::Info,
        "import_folder",
        &format!(
            "✅ Import abgeschlossen: {} Sounds",
            settings.imported_sounds.len()
        ),
    );

    Ok(())
}
