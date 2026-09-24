use std::collections::HashMap;
use std::sync::Arc;

use serde::Serialize;
use tokio::net::TcpStream;
use tokio::sync::Mutex;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::WebSocketStream;
use futures_util::stream::SplitSink;

#[derive(Serialize, Clone, Debug)]
pub struct EspStatus {
    pub room_id: String,
    pub power: String,
}

#[derive(Clone)]
pub struct EspData {
    pub room_id: String,
    pub web_socket: Arc<Mutex<SplitSink<WebSocketStream<TcpStream>, Message>>>,
    pub power: String,
}
pub type EspMap = Arc<Mutex<HashMap<String, EspData>>>;



// #[derive(Clone)]
// pub struct AuthSession {
//     pub name: String,
// }

// pub struct AppState {
//     auth: AuthSession,
//     esp_map: EspMap,
// }


// struct Auth {
//     name: String,
//     password: String,
// }
// pub vec<Auth> users = [
//     Auth({
//         name: "Hillary",
//         password: "A",
//     }),
//     Auth({
//         name: "Romuald",
//         password: "B",
//     }),
// ]
