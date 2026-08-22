export const formatCredits = (amount) => {
  if (amount === undefined || amount === null) return '0 Credits';
  return `${Number(amount).toLocaleString('en-IN')} Credits`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatShortTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};
