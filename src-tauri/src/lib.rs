use std::sync::Arc;
use tauri::Builder;

mod api;
mod cache;
mod db;
mod import;
mod settings;

use api::handlers::{delete_sound, get_imported_paths, get_sounds, import_directory, import_sound, Api}; // Imports der Handler
use cache::cache::Cache;
use db::connection::DatabasePool;
use db::sound::SoundRepository;
use import::importer::Importer;

#[tokio::main]
pub async fn run() {
    let db_pool = Arc::new(
        DatabasePool::new("mongodb://localhost:27017", "soundlab")
            .await
            .unwrap(),
    );
    let sound_repo = Arc::new(SoundRepository::new(db_pool.get_db()));
    let cache = Arc::new(Cache::new(100));
    let importer = Arc::new(Importer::new(sound_repo.clone(), cache.clone()));
    let api = Arc::new(Api::new(sound_repo.clone(), importer.clone(), cache.clone()));

    Builder::default()
        .manage(api)  // Hier wird `api` als State an die App übergeben
        .invoke_handler(tauri::generate_handler![
            import_sound,
            import_directory,
            get_sounds,
            delete_sound,
            get_imported_paths
        ])
        .run(tauri::generate_context!())
        .expect("Fehler beim Starten der Tauri-App");
}
