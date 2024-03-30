import { connectionConfig } from "./config";

class PeerConnection {
  public peer: RTCPeerConnection | null = null;
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection(connectionConfig);
    }
  }
  async setLocalDescription(answer: RTCSessionDescriptionInit) {
    if (!this.peer) return;
    await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (!this.peer) return;
    if (offer) {
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();

      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }
  async createOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}
export default new PeerConnection();
