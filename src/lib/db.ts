import mysql from 'mysql2/promise';

const password = 'mysqlmattiagiorgio14';

const pool = mysql.createPool({
   host: 'localhost',
   user: 'root1',
   password: `${password}`,
   database: 'new_bmr_nextjs_db',
});

export default pool;