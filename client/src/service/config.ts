export const connectionConfig = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
  ],
};

export async function getStrem() {
  return await window.navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
}
