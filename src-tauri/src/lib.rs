use dirs::config_dir;
use std::fs;
use std::sync::Arc;
use tauri::Builder;
use utils::logger::Logger;

mod api;
mod cache;
mod db;
mod import;
mod settings;
mod utils;

use crate::utils::logger::{log, LogLevel};
use api::handlers::{
    delete_sound, get_imported_paths, get_sounds, import_directory, import_sound, recache_sounds,
    remove_imported_path, toggle_favorite, Api,
};
use cache::cache_module::Cache;
use db::connection::DatabasePool;
use db::sound::SoundRepository;
use import::importer::Importer;

#[tokio::main]
pub async fn run() {
    Logger::clear_file();

    let app_data_path = config_dir().expect("Failed to get AppData directory");
    let db_path = app_data_path.join("soundlab").join("database.db");

    if !db_path.parent().unwrap().exists() {
        fs::create_dir_all(db_path.parent().unwrap()).expect("Failed to create directory");
    }

    let db_pool = Arc::new(
        DatabasePool::new(db_path.to_str().expect("Invalid path"))
            .await
            .expect("Database connection failed"),
    );

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS sounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            is_favorite BOOLEAN NOT NULL DEFAULT 0, 
            tags JSON NOT NULL DEFAULT '[]'      
        )",
    )
    .execute(&*db_pool.get_db())
    .await
    .expect("Failed to create sounds table");

    let sound_repo = Arc::new(SoundRepository::new(db_pool.get_db()));
    let cache = Arc::new(Cache::new(100));
    let importer = Arc::new(Importer::new(sound_repo.clone(), cache.clone()));

    let api = Arc::new(Api::new(sound_repo.clone(), Arc::clone(&importer)));

    log(LogLevel::Info, "run", "Starting application");

    Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage((*api).clone())
        .invoke_handler(tauri::generate_handler![
            import_sound,
            import_directory,
            get_sounds,
            toggle_favorite,
            delete_sound,
            get_imported_paths,
            remove_imported_path,
            recache_sounds
        ])
        .run(tauri::generate_context!())
        .expect("Error starting Tauri application");
}
