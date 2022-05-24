const { User } = require('../models')

const userController = {
  //get all users 
    getAllUsers(req, res) {
        User.find({})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    },

    //get single user by id
    getUserById({params}, res) {
        User.findOne({_id: params.id})
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    },

    //create new user
    createUser({ body }, res) {
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      },

      //update user info
      updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },

      //add a user id to friends array of selected user
      addFriend({params, body}, res) {
        User.findOneAndUpdate(
          {_id: params.userId},
          {$push: {friends: params.friendId}},
          {new: true, runValidators:true}
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

      //remove a user id from friends array of selected user
      removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true}
        )
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      },

      //delete user
      deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      }
};

module.exports = userController;