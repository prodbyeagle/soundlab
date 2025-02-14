mod cache;
mod import;
mod logger;
mod settings;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            import::import_folder,
            settings::get_imported_sounds,
            settings::get_imported_path,
            settings::add_imported_sound,
            settings::remove_imported_path,
            settings::load_settings,
            settings::save_settings,
            cache::init_cache,
            cache::add_to_cache,
            cache::remove_from_cache,
            cache::get_cached_sounds,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
