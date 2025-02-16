use mongodb::{options::ClientOptions, Client, Database};
use std::sync::Arc;

#[derive(Clone)]
pub struct DatabasePool {
    db: Arc<Database>,
}

impl DatabasePool {
    pub async fn new(uri: &str, db_name: &str) -> Result<Self, mongodb::error::Error> {
        let options = ClientOptions::parse(uri).await?;
        let client = Client::with_options(options)?;
        let db = client.database(db_name);
        Ok(Self { db: Arc::new(db) })
    }

    pub fn get_db(&self) -> Arc<Database> {
        self.db.clone()
    }
}
