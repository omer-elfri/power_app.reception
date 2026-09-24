use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
    accept_hdr_async,
    tungstenite::handshake::server::{Request, Response}
};
use std::sync::Arc;
use tokio::sync::Mutex;
use futures_util::{StreamExt};
use tauri::Emitter;
use crate::server_listener::handle_listener;

use crate::types::{EspStatus, EspData, EspMap};

pub async fn start_server(
    esp_map: EspMap,
    app_handle: tauri::AppHandle,
) {
    let port = std::env::var("VITE_WEB_SOCKET_PORT")
        .unwrap_or_else(|_| "81".to_string());
    let listener = TcpListener::bind(format!("0.0.0.0:{}", port))
        .await.expect("Impossible de démarrer le serveur WebSocket");
    println!("WebSocket démarré sur le port {}", port);

    loop {
        let (stream, _address) = listener.accept()
            .await.expect("Erreur lors de l'acceptation");
        let app_handle_clone = app_handle.clone();
        let esp_map_clone = esp_map.clone();

        tokio::spawn(async move {
            let Some(_) = handle_connection(
                app_handle_clone,
                esp_map_clone,
                stream,
            ).await else { return; };
        });
    }
}

async fn handle_connection( // Connexion
    app_handle: tauri::AppHandle,
    esp_map: EspMap,
    stream: TcpStream,
) -> Option<EspData> {
    let mut room_id = String::new();
    let mut power = String::new();

    let callback = |request: &Request, response: Response| {
        let uri = request.uri();

        if let Some(query) = uri.query() {
            for parameter in query.split('&') {
                let mut parts = parameter.split('=');
                let key = parts.next().unwrap_or("");
                let value = parts.next().unwrap_or("");

                if key == "roomId" {
                    room_id = value.to_string();
                }
                if key == "power" {
                    power = value.to_string();
                }
            }
        }
        Ok(response)
    };

    match accept_hdr_async(stream, callback).await {
        Ok(web_socket) => {
            println!("CH-{} ✅ {}", room_id, power);

            let (write, read) = web_socket.split();

            let esp = EspData {
                room_id: room_id.clone(),
                web_socket: Arc::new(Mutex::new(write)),
                power: power.clone(),
            };

            app_handle.emit("power-status", EspStatus {
                room_id: esp.room_id.clone(),
                power: esp.power.to_string(),
            }).unwrap();

            esp_map.lock().await.insert(
                esp.clone().room_id,
                esp.clone(),
            );
            handle_listener(
                esp_map.clone(),
                app_handle.clone(),
                esp.clone(),
                read
            ).await;

            disconnection(
                app_handle,
                esp_map,
                esp.room_id.clone()
            ).await;

            Some(esp)
        },

        Err(error) => {
            println!("Erreur WebSocket : {}", error);
            None
        }
    }
}

async fn disconnection( // Disonnexion
    app_handle: tauri::AppHandle,
    esp_map: EspMap,
    room_id: String,
) {
    println!("CH-{} ❌", room_id.clone());

    app_handle.emit("power-status", EspStatus {
        room_id: room_id.clone(),
        power: "NONE".to_string(),
    }).unwrap();

    esp_map.lock().await.remove(&room_id);
}
