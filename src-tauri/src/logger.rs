use chrono::Local;
use std::fs::{create_dir_all, OpenOptions};
use std::io::Write;
use std::sync::Mutex;
use once_cell::sync::Lazy;

#[derive(Debug)]
pub enum LogLevel {
    Info,
    Warn,
    Error,
    // Debug,
}

static LOGGER: Lazy<Mutex<Logger>> = Lazy::new(|| Mutex::new(Logger::new()));

pub struct Logger {
    log_file: Option<std::fs::File>,
}

impl Logger {
    fn new() -> Self {
        let log_dir = "logs";
        let log_path = format!("{}/soundlab.log", log_dir);

        if let Err(e) = create_dir_all(log_dir) {
            eprintln!("Logger Error: Failed to create log directory: {}", e);
            return Logger { log_file: None };
        }

        let log_file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_path)
            .ok();

        Logger { log_file }
    }

    fn log(&mut self, level: LogLevel, function: &str, message: &str) {
        let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        let log_msg = format!("[{}] [{}] [{}]: \"{}\"", timestamp, Self::level_to_str(&level), function, message);

        println!("{}", log_msg);

        if let Some(ref mut file) = self.log_file {
            let _ = writeln!(file, "{}", log_msg);
        }
    }

    fn level_to_str(level: &LogLevel) -> &'static str {
        match level {
            LogLevel::Info => "INFO",
            LogLevel::Warn => "WARN",
            LogLevel::Error => "ERROR",
            // LogLevel::Debug => "DEBUG",
        }
    }
}

pub fn log(level: LogLevel, function: &str, message: &str) {
    if let Ok(mut logger) = LOGGER.lock() {
        logger.log(level, function, message);
    }
}
