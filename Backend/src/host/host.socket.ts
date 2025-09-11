import { Socket } from "socket.io";

export default class HostSocket {
    private socket: Socket;
    private hostId: string;

    constructor(hostId: string, socket: Socket) {
        this.hostId = hostId;
        this.socket = socket;
    }
}