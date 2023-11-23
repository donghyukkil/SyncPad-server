exports.isUserIdValid = id => {
  const validFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return validFormat.test(id);
};
