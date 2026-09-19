// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod websocket;
mod server_listener;
mod types;

use types::EspMap;
use tauri::State;
use tokio_tungstenite::tungstenite::Message;

use std::sync::Arc;
use std::collections::HashMap;
use tokio::sync::Mutex;
use futures_util::SinkExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenvy::dotenv().ok();
    let esp_map: EspMap = Arc::new(Mutex::new(HashMap::new()));

    tauri::Builder::default()
        .manage(esp_map.clone())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![power_control])
        .setup(|app| {
            let app_handle_clone = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                websocket::start(
                    esp_map.clone(),
                    app_handle_clone, 
                ).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command] // control power
async fn power_control(
    state: State<'_, EspMap>,
    room_id: String,
    power: String,
) -> Result<(), String> {

    let esp_map = state.lock().await;

    println!("CH-{} -> {}", room_id, power);

    if let Some(esp) = esp_map.get(&room_id) {
        esp.web_socket.lock()
            .await.send(Message::Text(power.into()))
            .await.map_err(|e| e.to_string())?;
    }
    Ok(())
}
