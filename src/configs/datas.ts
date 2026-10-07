import { MoveType, NotificationType, RestaurantType } from "../types";

let time = new Date(Date.now());

export const notifications_datas: NotificationType[] = [{
    'time': time,
    'roomId': '101',
    'label': 'coming',
    'value': "Lorem ipsum dolor sit amet consectetur. frku ekdhub ehu edwhu",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'sold',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'label': 'restaurant',
    'value': "Lorem ipsum dolor sit amet consectetur.",
}];

export const restauration_datas: RestaurantType[] = [{
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '102',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
}, {
    'time': (time = new Date(time.getTime() - 60*60*24*1000)),
    'roomId': '101',
    'client': "Client 1",
    'article': "fwesd",
    'price': 20300,
}];

export const moves_datas: MoveType[] = [{
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "arrivée",
    'roomId': '101',
    'client': "Smith",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}, {
    'sens': "départ",
    'roomId': '104',
    'client': "Mme Charlotte",
    'come_at': (time = new Date(time.getTime() - 60*60*24*1000)),
    'go_at': (time = new Date(time.getTime() - 60*60*24*1000)),
}];
