export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export const getToken = () => {
  const token =   localStorage.getItem("accessToken");
  return token;
};


export const getUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

