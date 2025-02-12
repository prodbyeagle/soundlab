use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;

static CACHE: Lazy<Mutex<HashMap<String, String>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

/// Gibt einen Wert aus dem Cache zurück, falls vorhanden.
pub fn get(path: &str) -> Option<String> {
    let cache = CACHE.lock().ok()?;
    let result = cache.get(path).cloned();

    if result.is_some() {
        println!("[CACHE] ✅ Treffer: {}", path);
    } else {
        println!("[CACHE] ❌ Kein Eintrag für: {}", path);
    }

    result
}

/// Fügt einen neuen Wert in den Cache ein.
pub fn insert(path: &str, content: String) -> Result<(), String> {
    let mut cache = CACHE
        .lock()
        .map_err(|e| format!("Fehler beim Sperren des Caches: {}", e))?;

    println!("[CACHE] ➕ Hinzugefügt: {}", path);
    cache.insert(path.to_string(), content);
    Ok(())
}

/// Löscht den gesamten Cache.
#[tauri::command]
pub fn clear_cache() -> Result<(), String> {
    let mut cache = CACHE
        .lock()
        .map_err(|e| format!("Fehler beim Sperren des Caches: {}", e))?;

    println!("[CACHE] 🗑️ Cache geleert! ({} Einträge entfernt)", cache.len());
    cache.clear();
    Ok(())
}
