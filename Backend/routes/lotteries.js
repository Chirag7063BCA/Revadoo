const express = require('express');
const router = express.Router();

const lotteryController = require('../Controllers/lotteryController');
const { protectRoute } = require('../middleware/authMiddleware');

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  return next();
};

router.post('/admin/create', protectRoute, requireAdmin, lotteryController.createLottery);
router.get('/admin/list', protectRoute, requireAdmin, lotteryController.getAllLotteries);
router.put('/admin/:lotteryId/update', protectRoute, requireAdmin, lotteryController.updateLottery);
router.post('/admin/:lotteryId/publish', protectRoute, requireAdmin, lotteryController.publishLottery);
router.post('/admin/:lotteryId/announce', protectRoute, requireAdmin, lotteryController.announceLottery);
router.delete('/admin/:lotteryId/delete', protectRoute, requireAdmin, lotteryController.deleteLottery);
router.get('/admin/:lotteryId/tickets', protectRoute, requireAdmin, lotteryController.getLotteryTickets);

router.get('/published', lotteryController.getPublishedLotteries);
router.post('/:lotteryId/buy', protectRoute, lotteryController.buyTicket);
router.get('/user/my-tickets', protectRoute, lotteryController.getUserTickets);
router.get('/results', lotteryController.getLotteryResults);

module.exports = router;