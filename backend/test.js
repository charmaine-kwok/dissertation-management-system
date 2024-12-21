const bcrypt = require('bcrypt');

const plaintextPassword = 'student2password';
const saltRounds = 10;

bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error during hashing:', err);
  } else {
    console.log('Hashed Password:', hash);
  }
});
