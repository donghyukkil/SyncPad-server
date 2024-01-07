import express from 'express';
import { post, logout } from '../controllers/login.controller';
import {
  createText,
  uploadText,
  getTexts,
  putText,
  deleteText,
} from '../controllers/texts.controller';
import {
  createRoom,
  getroom,
  deleteRoom,
} from '../controllers/room.controller';
import verifyToken from '../middlewares/verifyToken';
import verifyCookie from '../middlewares/verifyCookie';

const router = express.Router();

router.post('/', verifyToken, post);

router.post('/logout', logout);

router.post('/:userId/create', createText);
router.post('/:userId/upload', uploadText);
router.get('/:userId/texts', getTexts);
router.put('/:userId/texts/:textId', putText);
router.delete('/:userId/texts/:textId', deleteText);

router.post('/:userId/createRoom', createRoom);
router.get('/:userId/getRooms', getroom);
router.delete('/:userId/deleteRooms/:roomId', verifyCookie, deleteRoom);

export default router;
