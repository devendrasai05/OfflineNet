const dgram = require("dgram");

const DISCOVERY_PORT = 41234;
const DISCOVERY_MESSAGE = "OFFLINENET_DISCOVER";
const DISCOVERY_TIMEOUT = 3000;

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

      socket.send(
        Buffer.from(DISCOVERY_MESSAGE),
        DISCOVERY_PORT,
        "255.255.255.255",
        (error) => {
          if (error) {
            clearTimeout(timeout);

            finish(reject, error);
            return;
          }

          console.log("📡 OfflineNet discovery request sent.");
        }
      );
    });
  });
}

module.exports = {
  discoverOfflineNetHost,
};