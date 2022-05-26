const { User, Thought} = require('../models')

const thoughtController = {
  //get all thoughts
    getAllThoughts(req, res) {
      Thought.find({})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
    },

    //get single thought by id
    getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.thoughtId })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
    },

    //update a thought
    updateThought({params, body}, res) {
      Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {new: true, runValidators: true})
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
    },

    //create new thought
    addThought({params, body}, res){
        console.log(params);
        Thought.create(body)
        .then (({_id}) => {
          //find a user to associate thought to
            return User.findOneAndUpdate(
                {_id: params.userId},
                {$push : {thoughts: _id}},
                {new: true}
            )
        })
        .then(dbUserData => {
            console.log(dbUserData);
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },

    //create new reaction
    addReaction({ params, body}, res) {
      //find a thought to associate reaction to
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}},
            {new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },

    //delete a thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No Thought with this id!' });
            }
            return User.findOneAndUpdate(
              { _id: params.userId },
              { $pull: { thoughts: params.thoughtId } },
              { new: true }
            );
          })
          .then(dbuserData => {
            if (!dbuserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbuserData);
          })
          .catch(err => res.json(err));
      },

      //delete a reaction
      removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }
        )
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      }
}

module.exports = thoughtController;