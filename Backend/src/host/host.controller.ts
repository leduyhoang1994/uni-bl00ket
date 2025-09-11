import { Socket } from "socket.io";
import HostModel from "./host.model";
import HostRepository from "./host.repo";
import HostSocket from "./host.socket";

export default class HostController {
    private hostId: string;
    private host: HostModel;
    private hostRepo: HostRepository;
    private hostSocket: HostSocket;

    constructor(hostId: string, socket: Socket) {
        this.hostId = hostId;
        this.hostRepo = new HostRepository(hostId);
        this.hostSocket = new HostSocket(hostId, socket);
    }

    public async init() {
        // Load host data into host here
    }

    public async create() {
        await this.onCreated();
    }
    public async onCreated() {}

    public async join() {
        await this.onJoined();
    }
    public async onJoined() {}

    public async leave() {
        await this.onLeaved();
    }
    public async onLeaved() {}
}
