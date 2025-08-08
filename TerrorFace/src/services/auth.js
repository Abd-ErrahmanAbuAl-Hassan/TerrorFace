// /src/services/auth.js

import API from './api';

export const login = async (email, password) => {
  const res = await API.get(`/users?email=${email}&password=${password}`);
  return res.data[0];
};

export const register = async (userData) => {
  const res = await API.post('/users', userData);
  return res.data;
};
