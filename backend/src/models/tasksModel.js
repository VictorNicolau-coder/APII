const connection = require('./connection')

const getAll = async() => {
    const tasks = await connection.execute('SELECT * FROM tasks');
    return tasks;
}

const getById = async(id) => {
    const task = await connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return task;
}

const createTask = async(task) => {
    const {title} = task
    const dateUTC = new Date(Date.now()).toUTCString()

    const query = 'INSERT INTO tasks(title, status, created_at) values(?, ?, ?)'

    const [createdTask] = await connection.execute(query, [title, 'pendente', dateUTC])

    return {insertId: createdTask.insertId};
}

const deleteTask = async(id) => {
    const [removedTask] = await connection.execute("DELETE from tasks WHERE id = ?", [id])
    return removedTask
}

const updateTask = async(id, task) => {
    const {title, status} = task

    const query = 'UPDATE tasks SET title = ?, status = ? WHERE id = ?'

    const [updatedTask] = await connection.execute(query, [title, status, id])
    return updatedTask
}

const searchUser = async (email) => {
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email])
    const usuario = rows[0]

    return usuario
}

module.exports = {
    getAll,
    getById,
    createTask,
    deleteTask,
    updateTask,
    searchUser
};