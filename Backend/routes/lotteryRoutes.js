const express = require('express');
const router = express.Router();
const lotteryController = require('../Controllers/lotteryController');
const { protectRoute: auth } = require('../middleware/authMiddleware');

// ADMIN ROUTES
router.post('/admin/create', lotteryController.createLottery);
router.get('/admin/list', lotteryController.getAllLotteries);
router.put('/admin/:lotteryId/update', lotteryController.updateLottery);
router.post('/admin/:lotteryId/publish', lotteryController.publishLottery);
router.post('/admin/:lotteryId/announce', lotteryController.announceLottery);
router.delete('/admin/:lotteryId/delete', lotteryController.deleteLottery);
router.get('/admin/:lotteryId/tickets', lotteryController.getLotteryTickets);

// USER ROUTES
router.get('/published', lotteryController.getPublishedLotteries);
router.post('/:lotteryId/buy', auth, lotteryController.buyTicket);
router.get('/user/my-tickets', auth, lotteryController.getUserTickets);
router.get('/results', lotteryController.getLotteryResults);

module.exports = router;
