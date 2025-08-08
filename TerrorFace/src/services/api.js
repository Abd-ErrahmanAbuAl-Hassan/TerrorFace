// /src/services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'https://terrorserver-hxeaa0gpaefmdyat.italynorth-01.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
