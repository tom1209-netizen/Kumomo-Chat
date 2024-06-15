export const generateChatId = (userId1, userId2) => {
  return userId1 > userId2 ? `${userId1}${userId2}` : `${userId2}${userId1}`;
};
