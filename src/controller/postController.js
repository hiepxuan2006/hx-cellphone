const Joi = require('joi');
const PostAction = require('../actions/PostAction');
const { sendError, sendSuccess } = require('../constants/response');
module.exports.createNewPost = async (req, res) => {
    const { body, file } = req;

    PostAction.createNewPost(body, file)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getAllTopic = (req, res) => {
    PostAction.getAllTopic().then(sendSuccess(req, res)).catch(sendError(req, res));
};

// //////
module.exports.createNewPaper = async (req, res) => {
    const { body, file } = req;
    console.log(req);
    PostAction.createNewPaper(body, file)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getNewsPaper = async (req, res) => {
    try {
        const data = req.query;
        const validator = Joi.object({
            title: Joi.string().trim(),
            limit: Joi.number().integer().max(100).default(10),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });
        const validated = await validator.validateAsync(data);
        PostAction.getNewsPaper(validated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {
        sendError(req, res)(error);
    }
};

module.exports.getNewsPaperById = (req, res) => {
    const { id } = req.params;
    PostAction.getNewsPaperById(id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getNewsPaperGroupTopic = (req, res) => {
    PostAction.getNewsPaperGroupTopic()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.updatePost = (req, res) => {
    const { body, file } = req;
    const { id } = req.params;
    PostAction.updatePost(id, body, file)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};
