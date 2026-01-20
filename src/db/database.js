const Database = require("better-sqlite3")



const db =
  process.env.NODE_ENV === 'test'
    ? new Database(':memory:')
    : new Database('database.sqlite');

//users
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    passwordHash TEXT,
    role TEXT
  )
    `).run()

//events

db.prepare(`
    
    CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    date TEXT,
    time TEXT,
    organizerId TEXT
    )

    `).run()


//event participants



db.prepare(`
  CREATE TABLE IF NOT EXISTS event_participants (
    eventId TEXT,
    userId TEXT,
    UNIQUE(eventId, userId)
  )
`).run();

module.exports = db