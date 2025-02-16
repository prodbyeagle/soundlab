use mongodb::bson::{doc, oid::ObjectId};
use mongodb::Collection;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Settings {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub theme: String,
    pub volume: f32,
}

pub struct SettingsRepository {
    collection: Arc<Collection<Settings>>,
}

impl SettingsRepository {
    pub fn new(db: Arc<mongodb::Database>) -> Self {
        let collection = db.collection::<Settings>("settings");
        Self {
            collection: Arc::new(collection),
        }
    }

    pub async fn save(&self, settings: Settings) -> mongodb::error::Result<ObjectId> {
        let result = self.collection.insert_one(settings).await?;
        Ok(result.inserted_id.as_object_id().unwrap())
    }

    pub async fn load(&self) -> mongodb::error::Result<Option<Settings>> {
        // Filter mit einem leeren Document (findet das erste Dokument)
        self.collection.find_one(doc! {}).await
    }
}
