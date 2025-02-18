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

    pub async fn insert(&self, sound: Sound) -> Result<i64, Error> {
        let result =
            sqlx::query("INSERT INTO sounds (name, path, is_favorite, tags) VALUES (?, ?, ?, ?)")
                .bind(&sound.name)
                .bind(&sound.path)
                .bind(sound.is_favorite)
                .bind(&sound.tags)
                .execute(&*self.pool)
                .await?;
        Ok(result.last_insert_rowid())
    }

    pub async fn get_all(&self) -> Result<Vec<Sound>, Error> {
        let sounds =
            sqlx::query_as::<_, Sound>("SELECT id, name, path, is_favorite, tags FROM sounds")
                .fetch_all(&*self.pool)
                .await?;
        Ok(sounds)
    }

    pub async fn delete(&self, id: i64) -> Result<(), Error> {
        sqlx::query("DELETE FROM sounds WHERE id = ?")
            .bind(id)
            .execute(&*self.pool)
            .await?;
        Ok(())
    }
}
