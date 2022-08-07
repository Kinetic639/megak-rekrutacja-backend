// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql2 = require('mysql2/promise');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuid } = require('uuid');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hash } = require('bcrypt');

(async () => {
  const connection = await mysql2.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'megak_hr',
    namedPlaceholders: true,
    decimalNumbers: true,
  });

  connection.execute(
    'INSERT INTO  `user` (`id`, `email`, `password`, `active`, `userType`) VALUES(:id, :email, :password,:active, :userType )',
    {
      id: uuid(),
      email: process.argv[2],
      password: await hash(process.argv[3], 10),
      userType: 'admin',
      active: 1,
    },
  );
  await connection.end();
})();
