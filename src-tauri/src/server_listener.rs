use futures_util::{SinkExt, StreamExt, stream::{SplitStream}};
use tokio::time::{
    // self, 
    Duration};

use tokio::net::{//TcpListener,
     TcpStream};
use tokio_tungstenite::{
    WebSocketStream,
    // accept_hdr_async,
    tungstenite::{
        Message,
        // handshake::server::{Request, Response}
    }
};
// use std::sync::Arc;
// use tokio::sync::Mutex;
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
    let timeout = tokio::time::sleep(Duration::from_secs(5));
    tokio::pin!(timeout);

    // while let Some(message) = read.next().await {

    loop {
        tokio::select! {
            message = read.next() => {

                match message {
                    Some(Ok(Message::Text(message))) => {
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

                    Some(Ok(Message::Ping(data))) => {
                        timeout.as_mut().reset(
                            tokio::time::Instant::now() + Duration::from_secs(5)
                        );
                        esp.web_socket
                            .lock().await
                            .send(Message::Pong(data)).await;
                    //     clearTimeout(timeout);
                    //     pong
                    //     timeoutId = setTimeout ... après 5
                    //         esp.websocket.close()
                        // println!("CH-{} ← PING", esp.room_id);
                    }

                    Some(Ok(Message::Close(_))) => {
                        break;
                    }

                    Some(Ok(_)) => { }

                    Some(Err(error)) => {
                        println!("Erreur réception : {}", error);
                        break;
                    }

                    None => break,
                }
            }
            _ = &mut timeout => {
                esp.web_socket
                    .lock().await
                    .close().await;
                break;
            }
        }
    }
    // }
}
