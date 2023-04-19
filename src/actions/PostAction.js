const slugify = require('slugify');
const { getModel, getConnection } = require('../connection/database');
const { Promise } = require('bluebird');
const Post = getModel('Post');
const Topic = getModel('Topic');
const uploadCloud = require('../middlewares/uploadCloud');
module.exports.createNewPost = async (args = {}, file) => {
    const { title, label } = args;
    if (!title || !label) throw new Error('Missing params');
    const result = await uploadCloud.uploadToCloudinary(file, 'slider');
    const newSlider = new Topic({
        title,
        label,
        slug: slugify(title, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: true,
            locale: 'vi',
            trim: true,
        }),
        image: result.secure_url,
    });
    return await newSlider.save();
};

module.exports.getAllTopic = async () => {
    return await Topic.find().lean();
};

// //////////////////

module.exports.createNewPaper = async (args = {}, file) => {
    const { title, content, topicId, tags } = args;
    if (!title || !content || !topicId || !tags.length) throw new Error('missing params');
    let result;
    if (file) {
        result = await uploadCloud.uploadToCloudinary(file, 'post');
    }
    const newNewsPaper = new Post({
        title,
        content,
        topic_id: topicId,
        tags,
        slug: slugify(title, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: true,
            locale: 'vi',
            trim: true,
        }),
        image: result?.secure_url,
    });
    return await newNewsPaper.save();
    console.log(newNewsPaper);
    return;
};

module.exports.getNewsPaper = async (args = {}) => {
    const { limit, page, title } = args;

    const skip = (page - 1) * limit;

    const _getData = Post.find()
        .populate({
            path: 'topic_id',
            model: Topic,
        })
        .limit(limit)
        .sort({ created: -1 })
        .skip(skip)
        .lean();
    const _getCount = Post.countDocuments();

    const [data, count] = await Promise.all([_getData, _getCount]);
    const pages = Math.ceil(count / limit) || 1;
    return { post: data, limit, page, pages };
};

module.exports.getNewsPaperById = async (id) => {
    if (!id) throw new Error('Post not found');

    const post = await Post.findOne({ _id: id })
        .populate({
            path: 'topic_id',
            model: Topic,
        })
        .lean();
    if (!post) throw new Error('post not found');

    return post;
};

module.exports.getNewsPaperGroupTopic = async () => {
    const topics = await Topic.find().lean();

    const newPaper = await Promise.map(topics, async (topic) => {
        const posts = await Post.find({ topic_id: topic._id })
            .populate({
                path: 'topic_id',
                model: Post,
            })
            .lean();
        return { title: topic.title, posts: posts };
    });

    return newPaper;
};

module.exports.updatePost = async (id, args = {}, file) => {
    let result;
    let dataUpdate = args;
    if (file) {
        result = await uploadCloud.uploadToCloudinary(file, 'post');
        dataUpdate.image = result.secure_url;
    }
    return await Post.findOneAndUpdate({ _id: id }, { $set: dataUpdate });
};
