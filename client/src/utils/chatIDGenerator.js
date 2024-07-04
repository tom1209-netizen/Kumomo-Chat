const generateChatId = (userId1, userId2) => {
  if (!userId1 || !userId2) {
    throw new Error(`ID undefined! ID1: ${userId1}, ID2: ${userId2}`);
  }

  return userId1 > userId2 ? `${userId1}${userId2}` : `${userId2}${userId1}`;
};

export default generateChatId;
