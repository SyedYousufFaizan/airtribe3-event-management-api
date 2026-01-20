exports.sendRegistrationEmail = (to, eventTitle) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`📧 Email sent to ${to} for event "${eventTitle}"`);
      resolve(true);
    }, 300); // simulate async delay
  });
};
