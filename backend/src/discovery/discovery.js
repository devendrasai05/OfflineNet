import dgram from "dgram";
import os from "os";

const DISCOVERY_PORT = 41234;
const DISCOVERY_MESSAGE = "OFFLINENET_DISCOVER";

function getLocalIPv4Address() {
  const interfaces = os.networkInterfaces();

  for (const interfaceName of Object.keys(interfaces)) {
    for (const network of interfaces[interfaceName]) {
      if (
        network.family === "IPv4" &&
        !network.internal &&
        !network.address.startsWith("169.254.")
      ) {
        return network.address;
      }
    }
  }

  return null;
}

export function startDiscoveryServer(serverPort) {
  const socket = dgram.createSocket("udp4");

  socket.on("error", (error) => {
    console.error("❌ UDP discovery error:", error);
    socket.close();
  });

  socket.on("message", (message, remote) => {
    const request = message.toString().trim();

    console.log(
      `📡 Discovery request received from ${remote.address}:${remote.port}`
    );

    if (request !== DISCOVERY_MESSAGE) {
      return;
    }

    const localIP = getLocalIPv4Address();

    if (!localIP) {
      console.error("❌ Could not determine local LAN IP address.");
      return;
    }

    const response = JSON.stringify({
      service: "OfflineNet",
      host: localIP,
      port: serverPort,
    });

    socket.send(
      Buffer.from(response),
      remote.port,
      remote.address,
      (error) => {
        if (error) {
          console.error("❌ Failed to send discovery response:", error);
          return;
        }

        console.log(
          `📡 Discovery response sent: http://${localIP}:${serverPort}`
        );
      }
    );
  });

  socket.bind(DISCOVERY_PORT, "0.0.0.0", () => {
    console.log(
      `📡 OfflineNet discovery server listening on UDP port ${DISCOVERY_PORT}`
    );
  });

  return socket;
}