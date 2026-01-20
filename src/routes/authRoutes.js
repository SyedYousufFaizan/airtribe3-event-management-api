const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authControllers');
const { createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getMyEvents,
registerForEvent } = require('../controllers/eventController');
const auth = require('../middlewares/auth')
const role = require('../middlewares/rolesMiddleware')




router.post('/register', register);
router.post('/login', login);
router.post('/events', auth, role('organizer'), createEvent);


router.post('/events', auth, role('organizer'), createEvent);
router.put('/events/:id', auth, role('organizer'), updateEvent);
router.delete('/events/:id', auth, role('organizer'), deleteEvent);
router.get('/events', getAllEvents);
router.get('/events/my', auth, getMyEvents);
router.post('/events/:id/register', auth, registerForEvent);



module.exports = router;