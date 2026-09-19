use tokio::net::{//TcpListener,
     TcpStream};
use tokio_tungstenite::{
    // accept_hdr_async,
    tungstenite::{
        Message,
        // handshake::server::{Request, Response}
    }
};
// use std::sync::Arc;
// use tokio::sync::Mutex;
use tokio_tungstenite::WebSocketStream;
use futures_util::{StreamExt, stream::{SplitStream}};
use tauri::Emitter;
// use tokio::time::{timeout, Duration};

use crate::types::{EspStatus, EspData,
    //  EspMap
};

pub async fn handle_listener( // Message ESP32
    app: tauri::AppHandle,
    esp: EspData,
    mut read: SplitStream<WebSocketStream<TcpStream>>,
) {
    // let timeoutId = 0;

    while let Some(message) = read.next().await {
        match message {
            Ok(Message::Text(message)) => {
            // Ok(message) => {
                // let text = message.to_text().unwrap();
                let text = message.to_string();
                println!("CH-{} <- {}", esp.room_id.clone(), text);

                if text == "POWER_OK"
                    || text == "POWER_KO"
                    || text == "DISCONNECTED"
                {
                    app.emit("power-status", EspStatus {
                        room_id: esp.room_id.clone(),
                        power: text.to_string(),
                    }).unwrap();
                }
            }

            // Ok(Message::Ping(data)) => {
            //     clearTimeout(timeout);
            //     pong
            //     timeoutId = setTimeout ... après 5s
            //         esp.websocket.close()
            //     // println!("CH-{} ← PING", esp.room_id);
            // }

            Ok(Message::Close(_)) => {
                println!("CH-{} ❌", esp.room_id.clone());

                app.emit("power-status", EspStatus {
                    room_id: esp.room_id.clone(),
                    power: "DISCONNECTED".to_string(),
                }).unwrap();
                break;
            }

            Ok(_) => { }

            Err(error) => {
                println!("Erreur réception : {}", error);
                break;
            }
        }
    }
}
