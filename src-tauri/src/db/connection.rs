use crate::utils::logger::{log, LogLevel};
use sqlx::{Error, Pool, Sqlite};
use std::fs;
use std::path::Path;
use std::sync::Arc;

#[derive(Clone)]
pub struct DatabasePool {
    db: Arc<Pool<Sqlite>>,
}

impl DatabasePool {
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

    pub fn get_db(&self) -> Arc<Pool<Sqlite>> {
        log(
            LogLevel::Debug,
            "DatabasePool::get_db",
            "Returning database pool reference.",
        );
        self.db.clone()
    }
}
