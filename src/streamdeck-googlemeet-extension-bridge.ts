#!/Users/jvandenberghe/.nvm/versions/node/v12.10.0/bin/node

// Might be good to use an explicit path to node on the shebang line
// in case it isn't in PATH when launched by Chrome
// Thanks https://github.com/simov/native-messaging

process.title = 'googlemeetbridge';

import { Server } from 'ws';

const clients: WebSocket[] = [];
const webSocketServer = new Server({ port: 1987 });

webSocketServer.on('connection', function connection(ws) {
	ws.on('message', handleIncomingMessages);
});

function handleIncomingMessages(message: string) {
	try {
		const msg: any = JSON.parse(message);

		if (msg.type === 'identify') {
			// @ts-ignore
			clients.push(ws);
		} else {
			broadcast(message);
		}
	} catch (e) {
		broadcast(message);
	}
}

function broadcast(message: string) {
	clients.forEach((client) => {
		client.send(message);
	});
}
