use serde::{Deserialize, Serialize};
use sqlx::{Error, FromRow, SqlitePool};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct Sound {
    // Using an integer for the primary key. When inserting, this can be None.
    pub id: Option<i64>,
    pub name: String,
    pub path: String,
}

pub struct SoundRepository {
    pool: Arc<SqlitePool>,
}

impl SoundRepository {
    /// Creates a new repository from an Arc-wrapped SqlitePool.
    pub fn new(pool: Arc<SqlitePool>) -> Self {
        Self { pool }
    }

    /// Inserts a new sound into the database.
    /// Returns the auto-generated ID of the inserted sound.
    pub async fn insert(&self, sound: Sound) -> Result<i64, Error> {
        let result = sqlx::query("INSERT INTO sounds (name, path) VALUES (?, ?)")
            .bind(&sound.name)
            .bind(&sound.path)
            .execute(&*self.pool)
            .await?;
        Ok(result.last_insert_rowid())
    }

    /// Retrieves all sounds from the database.
    pub async fn get_all(&self) -> Result<Vec<Sound>, Error> {
        let sounds = sqlx::query_as::<_, Sound>("SELECT id, name, path FROM sounds")
            .fetch_all(&*self.pool)
            .await?;
        Ok(sounds)
    }

    /// Deletes a sound by its ID.
    pub async fn delete(&self, id: i64) -> Result<(), Error> {
        sqlx::query("DELETE FROM sounds WHERE id = ?")
            .bind(id)
            .execute(&*self.pool)
            .await?;
        Ok(())
    }
}
