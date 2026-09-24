use futures_util::{SinkExt, StreamExt, stream::SplitStream};
use tokio::time::{Duration};

use tokio::net::{TcpStream};
use tokio_tungstenite::{WebSocketStream, tungstenite::Message};
use tauri::Emitter;
use crate::types::{EspStatus, EspData, EspMap};

pub async fn handle_listener( // Message ESP32
    esp_map: EspMap,
    app: tauri::AppHandle,
    esp: EspData,
    mut read: SplitStream<WebSocketStream<TcpStream>>,
) {
    let timeout = tokio::time::sleep(Duration::from_secs(5));
    tokio::pin!(timeout);

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
                                room_id: esp.clone().room_id,
                                power: if text == "POWER_OK" { "ON".to_string() }
                                    else if text == "POWER_KO" { "OFF".to_string() }
                                    else { "NONE".to_string() },
                            }).unwrap();

                            esp_map.lock().await.insert(
                                esp.clone().room_id,
                                esp.clone()
                            );
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
