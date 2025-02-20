use crate::utils::logger::{log, LogLevel};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, Error, FromRow, SqlitePool};
use std::sync::Arc;

/// Represents a sound entry in the database.
///
/// This struct maps to the `sounds` table, storing information about
/// individual sounds, including metadata such as name, file path,
/// favorite status, and associated tags.
#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Sound {
    /// The unique identifier for the sound entry.
    pub id: Option<i64>,
    /// The name of the sound file.
    pub name: String,
    /// The file system path where the sound is stored.
    pub path: String,
    /// A flag indicating whether the sound is marked as a favorite.
    pub is_favorite: bool,
    /// A JSON array of tags associated with the sound.
    pub tags: Json<Vec<String>>,
}

/// Provides an interface for database operations on the `sounds` table.
///
/// This repository encapsulates CRUD operations for managing sound records.
/// It abstracts database interactions and ensures proper logging of errors.
pub struct SoundRepository {
    pool: Arc<SqlitePool>,
}

impl SoundRepository {
    /// Creates a new `SoundRepository` instance.
    ///
    /// # Arguments
    ///
    /// * `pool` - A reference-counted SQLite connection pool.
    ///
    /// # Returns
    ///
    /// A new `SoundRepository` instance.
    pub fn new(pool: Arc<SqlitePool>) -> Self {
        Self { pool }
    }

    /// Checks if a sound with the given name exists in the database.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the sound to check.
    ///
    /// # Returns
    ///
    /// A `Result` indicating whether the sound exists (`true`) or not (`false`).
    pub async fn exists(&self, name: &str) -> Result<bool, sqlx::Error> {
        let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM sounds WHERE name = ?")
            .bind(name)
            .fetch_one(self.pool.as_ref())
            .await?;

        Ok(row.0 > 0)
    }

    /// Retrieves a sound entry by its ID.
    ///
    /// # Arguments
    ///
    /// * `id` - The unique identifier of the sound.
    ///
    /// # Returns
    ///
    /// A `Result` containing the `Sound` struct if found, or an error if not.
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

    /// Updates an existing sound entry in the database.
    ///
    /// # Arguments
    ///
    /// * `sound` - A reference to the `Sound` struct containing updated values.
    ///
    /// # Returns
    ///
    /// A `Result` indicating success or failure.
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
            Ok(_) => Ok(()),
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

    /// Inserts a new sound entry into the database.
    ///
    /// # Arguments
    ///
    /// * `sound` - The `Sound` struct representing the new entry.
    ///
    /// # Returns
    ///
    /// A `Result` containing the newly assigned ID or an error if the operation fails.
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
            Ok(res) => Ok(res.last_insert_rowid()),
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

    /// Retrieves all sound entries from the database.
    ///
    /// # Returns
    ///
    /// A `Result` containing a vector of `Sound` structs or an error if the query fails.
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

    /// Deletes a sound entry from the database by its ID.
    ///
    /// # Arguments
    ///
    /// * `id` - The ID of the sound to be deleted.
    ///
    /// # Returns
    ///
    /// A `Result` indicating success or failure.
    pub async fn delete(&self, id: i64) -> Result<(), Error> {
        let result = sqlx::query("DELETE FROM sounds WHERE id = ?")
            .bind(id)
            .execute(&*self.pool)
            .await;

        match result {
            Ok(_) => Ok(()),
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
