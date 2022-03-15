const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const RoomKV = {};

app.post('/api/room', (req, res) => {
  const offer = req.body.offer;
  const roomId = generateId();
  RoomKV[roomId] = {
    roomId,
    offer,
  };

  console.log(`Room ${roomId} created`);
  res.json(RoomKV[roomId]);
});

app.put('/api/room/:roomId', (req, res) => {
  const answer = req.body.answer;
  const { roomId } = req.params;
  RoomKV[roomId].answer = answer;

  console.log(`Remote controller is joining room ${roomId}`);
  res.json(RoomKV[roomId]);
});

app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  res.json(RoomKV[roomId]);
});

app.listen(22315, () => console.log('Example FRemote server listening on port 22315!'));
