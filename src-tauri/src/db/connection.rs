use crate::utils::logger::{log, LogLevel};
use sqlx::{Error, Pool, Sqlite};
use std::fs;
use std::path::Path;
use std::sync::Arc;

/// Represents a connection pool for an SQLite database.
#[derive(Clone)]
pub struct DatabasePool {
    db: Arc<Pool<Sqlite>>,
}

impl DatabasePool {
    /// Creates a new database connection pool.
    ///
    /// This function attempts to connect to an SQLite database at the specified path.
    /// If the database file does not exist, it will be created.
    ///
    /// # Arguments
    ///
    /// * `db_path` - The file path of the SQLite database.
    ///
    /// # Returns
    ///
    /// Returns a `Result` containing the `DatabasePool` on success or an `sqlx::Error` on failure.
    pub async fn new(db_path: &str) -> Result<Self, Error> {
        log(
            LogLevel::Info,
            "DatabasePool::new",
            &format!("Attempting to connect to SQLite database at '{}'.", db_path),
        );

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

    /// Retrieves the database connection pool.
    ///
    /// This function returns an `Arc` containing the `sqlx::Pool<Sqlite>`.
    ///
    /// # Returns
    ///
    /// An `Arc<Pool<Sqlite>>` that can be shared across the application.
    pub fn get_db(&self) -> Arc<Pool<Sqlite>> {
        log(
            LogLevel::Debug,
            "DatabasePool::get_db",
            "Returning database pool reference.",
        );
        self.db.clone()
    }
}
