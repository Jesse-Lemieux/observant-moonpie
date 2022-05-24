const router = require('express').Router();
const {
    addThought,
    addReaction,
    removeThought,
    removeReaction,
    getAllThoughts,
    getThoughtById,
    updateThought
} = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts)
router.route('/:userId').post(addThought)
router
    .route('/:userId/:thoughtId')
    .get(getThoughtById)
    .post(addReaction)
    .put(updateThought)
    .delete(removeThought)
router.route('/:userId/:thoughtId/:reactionId').delete(removeReaction)

module.exports = router;