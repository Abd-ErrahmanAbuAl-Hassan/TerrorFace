// /src/utils/formatTime.js

export const formatTime = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString(); 
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hr', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0)
      return `${count}${interval.label} ago`;
  }
  return 'just now';
};
