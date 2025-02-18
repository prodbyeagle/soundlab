use crate::utils::logger::{log, LogLevel};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, Error, FromRow, SqlitePool};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Sound {
    pub id: Option<i64>,
    pub name: String,
    pub path: String,
    pub is_favorite: bool,
    pub tags: Json<Vec<String>>,
}

pub struct SoundRepository {
    pool: Arc<SqlitePool>,
}

impl SoundRepository {
    pub fn new(pool: Arc<SqlitePool>) -> Self {
        log(
            LogLevel::Info,
            "SoundRepository::new",
            "Initializing SoundRepository.",
        );
        Self { pool }
    }

    pub async fn insert(&self, sound: Sound) -> Result<i64, Error> {
        log(
            LogLevel::Info,
            "SoundRepository::insert",
            &format!("Inserting sound: {:?}", sound),
        );
        let result =
            sqlx::query("INSERT INTO sounds (name, path, is_favorite, tags) VALUES (?, ?, ?, ?)")
                .bind(&sound.name)
                .bind(&sound.path)
                .bind(sound.is_favorite)
                .bind(&sound.tags)
                .execute(&*self.pool)
                .await;

        match result {
            Ok(res) => {
                let id = res.last_insert_rowid();
                log(
                    LogLevel::Info,
                    "SoundRepository::insert",
                    &format!("Successfully inserted sound with ID: {}", id),
                );
                Ok(id)
            }
            Err(err) => {
                log(
                    LogLevel::Error,
                    "SoundRepository::insert",
                    &format!("Failed to insert sound: {:?}", err),
                );
                Err(err)
            }
        }
    }

    pub async fn get_all(&self) -> Result<Vec<Sound>, Error> {
        log(
            LogLevel::Info,
            "SoundRepository::get_all",
            "Fetching all sounds.",
        );
        let result =
            sqlx::query_as::<_, Sound>("SELECT id, name, path, is_favorite, tags FROM sounds")
                .fetch_all(&*self.pool)
                .await;

        match result {
            Ok(sounds) => {
                log(
                    LogLevel::Info,
                    "SoundRepository::get_all",
                    &format!("Fetched {} sounds.", sounds.len()),
                );
                Ok(sounds)
            }
            Err(err) => {
                log(
                    LogLevel::Error,
                    "SoundRepository::get_all",
                    &format!("Failed to fetch sounds: {:?}", err),
                );
                Err(err)
            }
        }
    }

    pub async fn delete(&self, id: i64) -> Result<(), Error> {
        log(
            LogLevel::Info,
            "SoundRepository::delete",
            &format!("Deleting sound with ID: {}", id),
        );
        let result = sqlx::query("DELETE FROM sounds WHERE id = ?")
            .bind(id)
            .execute(&*self.pool)
            .await;

        match result {
            Ok(_) => {
                log(
                    LogLevel::Info,
                    "SoundRepository::delete",
                    &format!("Successfully deleted sound with ID: {}", id),
                );
                Ok(())
            }
            Err(err) => {
                log(
                    LogLevel::Error,
                    "SoundRepository::delete",
                    &format!("Failed to delete sound with ID {}: {:?}", id, err),
                );
                Err(err)
            }
        }
    }
}
