import { db } from '../../utils/db.js'

async function index (req, res) {
  const result = await db.execute('SELECT * FROM todos')
  res.status(200).json({ todos: result.rows })
}

async function store (req, res) {
  const result = await db.execute(
    'INSERT INTO todos (title, description, completed) VALUES (?, ?, ?) RETURNING *',
    [req.body.title, req.body.description || null, req.body.completed || false]
  )

  const created = (result && Array.isArray(result.rows) && result.rows.length)
    ? result.rows[0]
    : {
        id: result?.lastInsertRowid || result?.insertId || null,
        title: req.body.title,
        description: req.body.description || null,
        completed: req.body.completed || false
      }

  res.status(201).json({
    todo: created,
    message: 'Todo created successfully'
  })
}

export { index, store }