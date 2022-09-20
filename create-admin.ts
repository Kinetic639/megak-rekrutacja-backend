// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql2 = require('mysql2/promise');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuid } = require('uuid');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hash } = require('bcrypt');

(async () => {
  const [, , email, password, firstName, lastName] = process.argv;
  if (!email) {
    return console.error(`Write your email
        correct syntax 
        npm run create:admin <email> <password> <firstName> <lastName>
        `);
  }

  if (!password) {
    return console.error(`Write your password
        correct syntax 
        npm run create:admin <email> <password> <firstName> <lastName>
        `);
  }
  if (!firstName) {
    return console.error(`Write your first and last name
        correct syntax 
        npm run create:admin <email> <password> <firstName> <lastName>
        `);
  }
  if (!lastName) {
    return console.error(`Write your first and last name
        correct syntax 
        npm run create:admin <email> <password> <firstName> <lastName>
        `);
  }

  const connection = await mysql2.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'megak_hr',
    namedPlaceholders: true,
    decimalNumbers: true,
  });

  connection.execute(
    'INSERT INTO  `user` (`firstName`,`lastName`, `id`, `email`, `password`, `active`, `userType`) VALUES(:firstName, :lastName, :id, :email, :password,:active, :userType )',
    {
      firstName,
      lastName,
      id: uuid(),
      email,
      password: await hash(password, 10),
      userType: 'admin',
      active: 1,
    },
  );
  await connection.end();
  console.log(`Admin account created
    email:${email}
    password: ${password}`);
})();
