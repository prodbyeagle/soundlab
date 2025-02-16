use futures::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId, DateTime};
use mongodb::Collection;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Sound {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub path: String,
    pub created_at: DateTime,
}

pub struct SoundRepository {
    collection: Arc<Collection<Sound>>,
}

impl SoundRepository {
    pub fn new(db: Arc<mongodb::Database>) -> Self {
        let collection = db.collection::<Sound>("sounds");
        Self {
            collection: Arc::new(collection),
        }
    }

    pub async fn insert(&self, sound: Sound) -> mongodb::error::Result<ObjectId> {
        let result = self.collection.insert_one(sound).await?;
        Ok(result.inserted_id.as_object_id().unwrap())
    }

    pub async fn get_all(&self) -> mongodb::error::Result<Vec<Sound>> {
        let cursor = self.collection.find(doc! {}).await?;
        let results: Vec<Sound> = cursor.try_collect().await?;
        Ok(results)
    }

    pub async fn delete(&self, id: ObjectId) -> mongodb::error::Result<()> {
        self.collection.delete_one(doc! { "_id": id }).await?;
        Ok(())
    }
}
