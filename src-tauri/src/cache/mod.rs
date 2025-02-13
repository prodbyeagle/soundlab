use crate::logger::{log, LogLevel};
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite, Row};
use std::path::PathBuf;
use tokio::fs;
use tokio::sync::OnceCell;

static DB: OnceCell<Pool<Sqlite>> = OnceCell::const_new();

/// Asynchrones Erstellen des Cache-Verzeichnisses und Rückgabe des vollständigen Pfads zur DB.
async fn get_cache_path() -> PathBuf {
    let cache_dir = dirs::data_dir().unwrap().join("soundlab");
    fs::create_dir_all(&cache_dir).await.unwrap();
    cache_dir.join("cache.db")
}

#[tauri::command]
pub async fn init_cache() -> Result<(), String> {
    let db_path = get_cache_path().await;
    let db_url = format!("sqlite://{}", db_path.to_string_lossy());

    // Zum Debuggen: Logge den verwendeten DB-Pfad
    log(LogLevel::Info, "init_cache", &format!("DB URL: {}", db_url));

    // Verwende Pool-Optionen, um die Anzahl der Verbindungen zu steuern
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .map_err(|e| format!("Fehler beim Verbinden mit der Cache-DB: {}", e))?;

    // Setze Performance-optimierende PRAGMA-Parameter
    sqlx::query("PRAGMA journal_mode = WAL;")
        .execute(&pool)
        .await
        .map_err(|e| format!("Fehler beim Setzen von PRAGMA journal_mode: {}", e))?;

    sqlx::query("PRAGMA synchronous = NORMAL;")
        .execute(&pool)
        .await
        .map_err(|e| format!("Fehler beim Setzen von PRAGMA synchronous: {}", e))?;

    // Überprüfe, ob die Tabelle existiert, falls nicht, erstelle sie
    let table_check =
        sqlx::query!("SELECT name FROM sqlite_master WHERE type='table' AND name='sounds';")
            .fetch_optional(&pool)
            .await
            .map_err(|e| format!("Fehler beim Überprüfen der Tabelle: {}", e))?;

    if table_check.is_none() {
        // Tabelle existiert nicht, also erstellen
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS sounds (id INTEGER PRIMARY KEY, path TEXT UNIQUE);",
        )
        .execute(&pool)
        .await
        .map_err(|e| format!("Fehler beim Erstellen der Tabelle: {}", e))?;
        log(
            LogLevel::Info,
            "init_cache",
            "✅ Tabelle 'sounds' wurde erstellt.",
        );
    }

    DB.set(pool)
        .map_err(|_| "Cache-DB bereits initialisiert".to_string())?;

    log(LogLevel::Info, "init_cache", "✅ Cache-DB initialisiert.");
    Ok(())
}

#[tauri::command]
pub async fn add_to_cache(path: &str) -> Result<(), String> {
    let db = DB.get().ok_or("Cache-DB nicht initialisiert")?;

    sqlx::query("INSERT OR IGNORE INTO sounds (path) VALUES (?);")
        .bind(path)
        .execute(db)
        .await
        .map_err(|e| format!("Fehler beim Einfügen in die Cache-DB: {}", e))?;

    log(
        LogLevel::Info,
        "add_to_cache",
        &format!("➕ Sound hinzugefügt: {}", path),
    );
    Ok(())
}

#[tauri::command]
pub async fn remove_from_cache(path: &str) -> Result<(), String> {
    let db = DB.get().ok_or("Cache-DB nicht initialisiert")?;

    sqlx::query("DELETE FROM sounds WHERE path = ?;")
        .bind(path)
        .execute(db)
        .await
        .map_err(|e| format!("Fehler beim Löschen aus der Cache-DB: {}", e))?;

    log(
        LogLevel::Info,
        "remove_from_cache",
        &format!("❌ Sound entfernt: {}", path),
    );
    Ok(())
}

#[tauri::command]
pub async fn get_cached_sounds() -> Result<Vec<String>, String> {
    let db = DB.get().ok_or("Cache-DB nicht initialisiert")?;

    let rows = sqlx::query("SELECT path FROM sounds;")
        .fetch_all(db)
        .await
        .map_err(|e| format!("Fehler beim Abrufen aus der Cache-DB: {}", e))?;

    let sounds: Vec<String> = rows.into_iter().map(|row| row.get("path")).collect();

    Ok(sounds)
}
