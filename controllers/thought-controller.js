const { User, Thought} = require('../models')

const thoughtController = {
    addThought({params, body}, res){
        console.log(params);
        Thought.create(body)
        .then (({_id}) => {
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

    addReaction({ params, body}, res) {
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

    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.ThoughtId })
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No Thought with this id!' });
            }
            return User.findOneAndUpdate(
              { _id: params.userId },
              { $pull: { thoughts: params.ThoughtId } },
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

      removeReaction({ params }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          { $pull: { replies: { reactionId: params.reactionId } } },
          { new: true }
        )
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      }
}