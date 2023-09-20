const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mysql_todo_list',
  connectionLimit: 10
});

const createUser = async (uname, pwd) => {
  try {
    const [{ insertId }] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [uname, pwd]); // [{}, undefined]
    const [[newUser]] = await pool.query('SELECT * FROM users WHERE id = ?', [insertId]); // [ [{}], [] ]
    return newUser;
  } catch (err) {
    console.log(err);
  }
};

const createTodo = async (title, completed, userId) => {
  await pool.query('INSERT INTO todos (title, completed, user_id) VALUES (?, ?, ?)', [title, completed, userId]);
};

const deleteUser = async userId => {
  await pool.query('DELETE FROM todos WHERE user_id = ?', [userId]);
  await pool.query('DELETE FROM users WHERE id = ?', [userId]);
};

const deleteTodo = async todoId => {
  await pool.query('DELETE FROM todos WHERE id = ?', [todoId]);
};

const getUser = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result[0];
};

const getTodo = async userId => {
  const result = await pool.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
  return result[0];
};

const updateUser = async (password, userId) => {
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, userId]);
};

const updateTodo = async (newData, todoId) => {
  // { title: 'Walking' },  { completed: true }, { title: 'Walking', completed: false }

  let arr = [];
  let value = [];
  if (newData.title !== undefined) {
    arr.push('title = ?'); // ['title = ?']
    value.push(newData.title);
  }
  if (newData.completed !== undefined) {
    arr.push('completed = ?');
    value.push(newData.completed);
  }
  value.push(todoId);

  //  ['title = ?'], ['completed = ?'], ['title = ?', 'completed = ?']
  let sql = 'UPDATE todos SET ' + arr.join(', ') + ' WHERE id = ?';
  await pool.query(sql, value);
};

const run = async () => {
  // const result = await createUser('hong', '111111'); // { id: 3, username: 'money', password: '098765'}
  // console.log(result);
  // createTodo('Jogging', true, 1);
  // deleteUser(2);
  // await updateUser('999999', 1);
  // const users = await getUser();
  // console.log(users);
  updateTodo({ title: 'Homework', completed: 1 }, 3);
};

run();

// // register
// app.use()
// app.get()
// app.post('/register', (req, res, next) => {
//   // body, params, query, headers
//   // validate
//   // creatUser
// })
// app.post('/login', (req, res, next) => {
//   // body, params, query, headers
//   // validate

// })
// app.post('/todo', (req, res, next) => {
//   // body, params, query, headers
//   // validate
//   // createTodo
// })
// app.delete('/todo', (req, res, next) => {
//   // body, params, query, headers
//   // validate
//   // deleteTodo
// })
// app.put()
// app.delete()
