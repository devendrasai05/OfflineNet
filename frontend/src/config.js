let SERVER_URL = `http://${window.location.hostname}:5000`;
let API_URL = `${SERVER_URL}/api`;

export function setServerURL(serverURL) {
  if (!serverURL) {
    throw new Error("Server URL is required.");
  }

  SERVER_URL = serverURL;
  API_URL = `${SERVER_URL}/api`;

  console.log("🌐 OfflineNet server configured:", SERVER_URL);
}

export function getServerURL() {
  return SERVER_URL;
}

export function getApiURL() {
  return API_URL;
}

export { SERVER_URL, API_URL };