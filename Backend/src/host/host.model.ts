export default class HostModel {
  started: boolean = false;

  async start() {
    this.started = true;
  }
}
