use chrono::Local;
use dirs::config_dir;
use once_cell::sync::Lazy;
use std::fs::{create_dir_all, OpenOptions};
use std::io::Write;
use std::sync::Mutex;

/// Enum to define different log levels for the application.
#[derive(Debug)]
pub enum LogLevel {
    Info,
    Error,
    Debug,
}

/// A thread-safe logger that writes logs to a file.
static LOGGER: Lazy<Mutex<Logger>> = Lazy::new(|| Mutex::new(Logger::new()));

/// Struct to manage logging, including writing to a log file.
pub struct Logger {
    log_file: Option<std::fs::File>,
}

impl Logger {
    /// Creates a new logger instance.
    ///
    /// This function sets up the log file and creates the `logs` directory in the application data path
    /// if it doesn't exist. It also sets up the log file (`soundlab.log`) for appending.
    ///
    /// # Returns
    /// A `Logger` instance.
    fn new() -> Self {
        let app_data_path = config_dir().expect("Failed to get config directory");
        let log_dir = app_data_path.join("soundlab").join("logs");

        if let Err(e) = create_dir_all(&log_dir) {
            eprintln!("Logger Error: Failed to create log directory: {}", e);
            return Logger { log_file: None };
        }

        let log_path = log_dir.join("soundlab.log");

        let log_file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_path)
            .ok();

        Logger { log_file }
    }

    /// Logs a message to the console and the log file.
    ///
    /// # Arguments
    /// * `level` - The log level (e.g., Info, Error, Debug).
    /// * `function` - The name of the function where the log was generated.
    /// * `message` - The log message.
    fn log(&mut self, level: LogLevel, function: &str, message: &str) {
        let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        let log_msg = format!(
            "[{}] [{}] [{}]: \"{}\"",
            timestamp,
            Self::level_to_str(&level),
            function,
            message
        );

        // Print to console
        println!("{}", log_msg);

        // Write to log file
        if let Some(ref mut file) = self.log_file {
            let _ = writeln!(file, "{}", log_msg);
        }
    }

    /// Converts a log level to its corresponding string representation.
    ///
    /// # Arguments
    /// * `level` - The log level to convert.
    ///
    /// # Returns
    /// A string representing the log level (e.g., "INFO", "ERROR", "DEBUG").
    fn level_to_str(level: &LogLevel) -> &'static str {
        match level {
            LogLevel::Info => "INFO",
            LogLevel::Error => "ERROR",
            LogLevel::Debug => "DEBUG",
        }
    }
}

/// Logs a message to the application log.
///
/// This function is used to log messages to both the console and a log file. It locks the global logger
/// instance and calls its `log` method to record the message.
///
/// # Arguments
/// * `level` - The log level (e.g., Info, Error, Debug).
/// * `function` - The name of the function where the log was generated.
/// * `message` - The message to log.
pub fn log(level: LogLevel, function: &str, message: &str) {
    if let Ok(mut logger) = LOGGER.lock() {
        logger.log(level, function, message);
    }
}
