const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nodeUsers',
  password: 'Er325242',
  port: 5432,
})


const getUsers = (request, response) => {
  pool.query('SELECT * FROM user_login', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getUserByUser_name = (request, response) => {
  const user_name = request.params.user_name;
  pool.query(' SELECT * FROM user_login WHERE user_name = $1', [user_name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO user_login (user_name, user_password) VALUES ($1, $2)', [name, password], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with user_name: ${results.user_name}`)
  })
}

const updateUser = (request, response) => {
  const user_name = parseInt(request.params.user_name)
  const { name, password } = request.body

  pool.query(
    'UPDATE user_login SET user_name = $1, user_password = $2 WHERE user_id = $3',
    [name, password, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM user_login WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserByUser_name,
  createUser,
  updateUser,
  deleteUser,
}