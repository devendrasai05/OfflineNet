const dgram = require("dgram");
const os = require("os");

const DISCOVERY_PORT = 41234;
const DISCOVERY_MESSAGE = "OFFLINENET_DISCOVER";
const DISCOVERY_TIMEOUT = 3000;

function ipToNumber(ip) {
  return ip
    .split(".")
    .reduce((result, octet) => (result << 8) + Number(octet), 0) >>> 0;
}

function numberToIp(number) {
  return [
    (number >>> 24) & 255,
    (number >>> 16) & 255,
    (number >>> 8) & 255,
    number & 255,
  ].join(".");
}

function getBroadcastAddress() {
  const interfaces = os.networkInterfaces();

  for (const interfaceName of Object.keys(interfaces)) {
    for (const network of interfaces[interfaceName]) {
      if (
        network.family === "IPv4" &&
        !network.internal &&
        !network.address.startsWith("169.254.")
      ) {
        const ip = ipToNumber(network.address);
        const subnetMask = ipToNumber(network.netmask);

        const broadcast = (ip | (~subnetMask >>> 0)) >>> 0;

        console.log(
          `📡 Using network interface ${interfaceName}: ${network.address}/${network.netmask}`
        );

        console.log(
          `📡 Calculated discovery broadcast address: ${numberToIp(
            broadcast
          )}`
        );

        return numberToIp(broadcast);
      }
    }
  }

  throw new Error("Could not determine a suitable LAN broadcast address.");
}

function discoverOfflineNetHost() {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");

    let settled = false;

    const finish = (callback, value) => {
      if (settled) {
        return;
      }

      settled = true;

      try {
        socket.close();
      } catch (error) {
        // Socket may already be closed.
      }

      callback(value);
    };

    const timeout = setTimeout(() => {
      finish(reject, new Error("OfflineNet host discovery timed out."));
    }, DISCOVERY_TIMEOUT);

    socket.on("error", (error) => {
      clearTimeout(timeout);

      finish(reject, error);
    });

    socket.on("message", (message, remote) => {
      clearTimeout(timeout);

      try {
        const response = JSON.parse(message.toString());

        if (
          response.service !== "OfflineNet" ||
          !response.host ||
          !response.port
        ) {
          return;
        }

        console.log(
          `📡 OfflineNet host discovered at ${response.host}:${response.port}`
        );

        finish(resolve, {
          host: response.host,
          port: Number(response.port),
          address: `http://${response.host}:${response.port}`,
        });
      } catch (error) {
        console.error(
          `❌ Invalid discovery response from ${remote.address}:`,
          error
        );
      }
    });

    socket.bind(() => {
      socket.setBroadcast(true);

      let broadcastAddress;

      try {
        broadcastAddress = getBroadcastAddress();
      } catch (error) {
        clearTimeout(timeout);

        finish(reject, error);
        return;
      }

      socket.send(
        Buffer.from(DISCOVERY_MESSAGE),
        DISCOVERY_PORT,
        broadcastAddress,
        (error) => {
          if (error) {
            clearTimeout(timeout);

            finish(reject, error);
            return;
          }

          console.log(
            `📡 OfflineNet discovery request sent to ${broadcastAddress}:${DISCOVERY_PORT}`
          );
        }
      );
    });
  });
}

module.exports = {
  discoverOfflineNetHost,
};