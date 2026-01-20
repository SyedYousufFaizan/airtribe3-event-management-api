const { v4: uuidv4 } = require('uuid');
// const { sendRegistrationEmail } = require('../utils/email');
const db = require('../db/database');
const { sendRegistrationEmail } = require('../utils/email');


exports.createEvent = (req, res) => {
  const { title, description, date, time } = req.body;

  if (!title || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }


 db.prepare(`
    INSERT INTO events (id, title, description, date, time, organizerID)
    VALUES (?,?,?,?,?,?)
    `).run(uuidv4(),title, description, date, time, req.user.id)

  res.status(201).json("added successfully");
};


// UPDATE EVENT
exports.updateEvent = (req, res) => {
  const { title, description, date, time } = req.body;
  const { id } = req.params;
  console.log(id)

   const event = db.prepare(`
    SELECT * FROM events WHERE id =?
  `).get(id);


  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.organizerId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }


db.prepare(`
    UPDATE events
    SET title = ?, description = ?, date = ?, time = ? 
    WHERE id = ?
    `).run(
    title || event.title,
    description || event.description,
    date || event.date,
    time || event.time,
    id
    )

  res.json('updated successfully');
};

// DELETE EVENT
exports.deleteEvent = (req, res) => {
  const eventId = req.params.id;

  const event = db.prepare(`
    SELECT * FROM events WHERE id = ?
  `).get(eventId);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.organizerId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Remove participants first (clean DB)
  db.prepare(`
    DELETE FROM event_participants WHERE eventId = ?
  `).run(eventId);

  // Remove event
  db.prepare(`
    DELETE FROM events WHERE id = ?
  `).run(eventId);

  res.json({ message: 'Event deleted successfully' });
};

exports.getAllEvents = (req, res) => {
  const events = db.prepare(`
    SELECT 
      events.id,
      events.title,
      events.description,
      events.date,
      events.time,
      events.organizerId,
      users.email AS organizerEmail
    FROM events
    JOIN users ON users.id = events.organizerId
    ORDER BY events.date, events.time
  `).all();


  res.json(events);

};

// GET EVENTS USER REGISTERED IN
exports.getMyEvents = (req, res) => {
  const myEvents = events
    .filter(event => event.participants.includes(req.user.id))
    .map(event => {
      const participantNames = event.participants.map(userId => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
      });

      return {
        ...event,
        participants: participantNames
      };
    });

  res.json(myEvents);
};

// REGISTER FOR EVENT
exports.registerForEvent = async (req, res) => {
  const { id } = req.params;

  const event = db
    .prepare('SELECT * FROM events WHERE id = ?')
    .get(id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const result = db.prepare(`
    INSERT OR IGNORE INTO event_participants (eventId, userId)
    VALUES (?, ?)
  `).run(id, req.user.id);

  if (result.changes === 0) {
    return res.status(400).json({ message: 'Already registered' });
  }

  // async, non-blocking email
  sendRegistrationEmail(req.user.email, event.title)
    .catch(() => {});

  return res.status(201).json({
    message: 'Successfully registered for event'
  });
};