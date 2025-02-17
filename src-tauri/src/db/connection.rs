use crate::utils::logger::{log, LogLevel};
use sqlx::{Error, Pool, Sqlite};
use std::fs;
use std::path::Path;
use std::sync::Arc;

/// Structure to manage a connection pool to a SQLite database.
#[derive(Clone)]
pub struct DatabasePool {
    db: Arc<Pool<Sqlite>>,
}

impl DatabasePool {
    /// Creates a new instance of `DatabasePool` and connects to the specified SQLite database.
    ///
    /// # Parameters
    ///
    /// - `db_path`: The file path for the SQLite database (e.g., "database.db").
    ///
    /// # Returns
    ///
    /// Returns a `Result` that either contains a successfully created `DatabasePool` or an error.
    pub async fn new(db_path: &str) -> Result<Self, Error> {
        log(
            LogLevel::Info,
            "DatabasePool::new",
            &format!("Attempting to connect to SQLite database at '{}'.", db_path),
        );

        // Prüfe, ob die Datei existiert. Falls nicht, wird sie erstellt.
        if !Path::new(db_path).exists() {
            fs::File::create(db_path).map_err(|e| {
                log(
                    LogLevel::Error,
                    "DatabasePool::new",
                    &format!("Unable to create database file '{}': {}", db_path, e),
                );
                e
            })?;
            log(
                LogLevel::Info,
                "DatabasePool::new",
                &format!("Database file '{}' created.", db_path),
            );
        }

        // Baue den Verbindungsstring im Format "sqlite://{db_path}"
        let connection_string = format!("sqlite://{}", db_path);

        match Pool::<Sqlite>::connect(&connection_string).await {
            Ok(pool) => {
                log(
                    LogLevel::Info,
                    "DatabasePool::new",
                    &format!(
                        "Successfully connected to SQLite database at '{}'.",
                        db_path
                    ),
                );
                Ok(Self { db: Arc::new(pool) })
            }
            Err(err) => {
                log(
                    LogLevel::Error,
                    "DatabasePool::new",
                    &format!("Error connecting to SQLite database: {}", err),
                );
                Err(err)
            }
        }
    }

    /// Returns a reference to the SQLite database pool.
    ///
    /// # Returns
    ///
    /// Returns an `Arc<Pool<Sqlite>>` representing the SQLite database pool.
    pub fn get_db(&self) -> Arc<Pool<Sqlite>> {
        log(
            LogLevel::Debug,
            "DatabasePool::get_db",
            "Returning database pool reference.",
        );
        self.db.clone()
    }
}
