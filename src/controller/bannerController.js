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

module.exports.geAllBanner = async (req, res) => {
    try {
        const { query } = req;
        const validator = Joi.object({
            is_active: Joi.boolean().optional().default(true),
            limit: Joi.number().integer().max(100).default(10),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });
        const paramsValidated = await validator.validateAsync(query);
        BannerActions.getAllBanner(paramsValidated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {}
};
