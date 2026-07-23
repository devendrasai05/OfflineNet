const onlineUsers = new Map();

export const addUser = (userId, socketId) => {
  onlineUsers.set(Number(userId), socketId);
};

export const removeUser = (userId) => {
  onlineUsers.delete(Number(userId));
};

export const getUserSocket = (userId) => {
  return onlineUsers.get(Number(userId));
};

export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};