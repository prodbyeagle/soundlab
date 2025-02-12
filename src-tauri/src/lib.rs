mod cache;
mod import;
mod settings;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            import::import_file,
            import::import_directory,
            cache::clear_cache,
            settings::get_imported_sounds,
            settings::add_imported_sound,
            settings::get_available_themes,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
