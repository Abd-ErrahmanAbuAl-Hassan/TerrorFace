// /src/utils/avatarGenerator.js

export const generateAvatar = (username) => {
  const base = 'https://ui-avatars.com/api/';
  const name = encodeURIComponent(username);
  return `${base}?name=${name}&background=random`;
};
