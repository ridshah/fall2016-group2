'use strict';

var blueprint = require('@onehilltech/blueprint')
;

var User = blueprint.app.models.User
  , Post = blueprint.app.models.Post
;


class bucketPost {
    constructor(post, author) {
        this.post = post;
        this.author = author;
    }
}

class bucketHolder {
    constructor(tag) {
        this.tag = tag;
        this.msgList = [];
    }
}

function UserController() {
    blueprint.BaseController.call(this);
}

function inArray(string, array) {

    for (var k = 0; k < array.length; k++) {
        if (string == array[k]) {
            return true;
        }
    }
    return false;
}

blueprint.controller(UserController);

UserController.prototype.showMe = function () {
    return function (req, res, callback) {

        function sortPosts(buckets, postsForBuckets) {
            var bucketList = [];
            var postToInsert;
            var postAuthor;

            for (var i = 0; i < buckets.length; i++) {
                var currentBucket = new bucketHolder(buckets[i]);
                for (var j = 0; j < postsForBuckets.length; j++) {
                    if (inArray(buckets[i], postsForBuckets[j].tags)) {
                        postToInsert = postsForBuckets[j];
                        var currentPost = new bucketPost(postToInsert, postAuthor);
                        currentBucket.msgList.push(currentPost);
                    }
                }
                bucketList.push(currentBucket);
            }
            return bucketList;
        }

        Post.find({createdBy: req.user._id}, 'postText postTime tags', function (err, result) {
            if (err) return callback(new HttpError(500, 'Cannot retrieve posts'));
            Post.find({$text: {$search: req.user.tags.join(" ")}}, 'postText postTime tags createdBy', function (err,postList) {
                if (err) return callback(new HttpError(500, 'Cannot retrieve posts'));

                var bucketList = sortPosts(req.user.tags, postList);

                res.render('user.handlebars', {
                    user: req.user,
                    msg: result,
                    buckets: req.user.tags,
                    bucketList: bucketList
                });
            }).lean(); //Using lean so Mongo returns JSON objects that are easier to read from
        }).lean();
    }
};

UserController.prototype.createBucket = function () {
    return {
        execute: function (req, res, callback) {
            var bucketName = req.body.bucketTag;
            User.findById(req.user.id, function (err, usr) {
                if (err) throw err;
                usr.tags.push(bucketName.toLowerCase());
                usr.save(function (err) {
                    if (err) throw err;
                });
            });
            res.redirect('/users/me');
        }
    }
};

module.exports = UserController;