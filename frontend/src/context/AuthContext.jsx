import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("offlinenet-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Shared online users state
  const [onlineUsers, setOnlineUsers] = useState([]);

  const login = (userData) => {
    localStorage.setItem(
      "offlinenet-user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const register = (userData) => {
    localStorage.setItem(
      "offlinenet-user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("offlinenet-user");
    localStorage.removeItem("offlinenet-token");

    setUser(null);
    setOnlineUsers([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };