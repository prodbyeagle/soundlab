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
        Self { pool }
    }

    pub async fn exists(&self, name: &str) -> Result<bool, sqlx::Error> {
        let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM sounds WHERE name = ?")
            .bind(name)
            .fetch_one(self.pool.as_ref())
            .await?;

        Ok(row.0 > 0)
    }

    pub async fn get(&self, id: i64) -> Result<Sound, Error> {
        let result = sqlx::query_as::<_, Sound>(
            "SELECT id, name, path, is_favorite, tags FROM sounds WHERE id = ?",
        )
        .bind(id)
        .fetch_one(&*self.pool)
        .await;

        match result {
            Ok(sound) => Ok(sound),
            Err(err) => {
                log(
                    LogLevel::Error,
                    "SoundRepository::get",
                    &format!("Failed to fetch sound with ID {}: {:?}", id, err),
                );
                Err(err)
            }
        }
    }

    pub async fn update(&self, sound: &Sound) -> Result<(), Error> {
        let result = sqlx::query(
            "UPDATE sounds SET name = ?, path = ?, is_favorite = ?, tags = ? WHERE id = ?",
        )
        .bind(&sound.name)
        .bind(&sound.path)
        .bind(sound.is_favorite)
        .bind(&sound.tags)
        .bind(sound.id)
        .execute(&*self.pool)
        .await;

        match result {
            Ok(_) => {
                Ok(())
            }
            Err(err) => {
                log(
                    LogLevel::Error,
                    "SoundRepository::update",
                    &format!("Failed to update sound with ID {:?}: {:?}", sound.id, err),
                );
                Err(err)
            }
        }
    }

    pub async fn insert(&self, sound: Sound) -> Result<i64, Error> {
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
        let result =
            sqlx::query_as::<_, Sound>("SELECT id, name, path, is_favorite, tags FROM sounds")
                .fetch_all(&*self.pool)
                .await;

        match result {
            Ok(sounds) => Ok(sounds),
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
        let result = sqlx::query("DELETE FROM sounds WHERE id = ?")
            .bind(id)
            .execute(&*self.pool)
            .await;

        match result {
            Ok(_) => {
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
