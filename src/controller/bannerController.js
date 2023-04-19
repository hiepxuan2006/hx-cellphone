const BannerActions = require('../actions/BannerActions');
const { sendSuccess, sendError } = require('../constants/response');
const Joi = require('joi');

module.exports.createBanner = (req, res) => {
    const { body, file } = req;
    BannerActions.createBanner(body, file)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getBanner = (req, res) => {
    const query = req.query;
    BannerActions.getBanner(query).then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.deleteBanner = (req, res) => {
    const { id } = req.params;
    BannerActions.deleteBanner(id).then(sendSuccess(req, res)).catch(sendError(req, res));
};
