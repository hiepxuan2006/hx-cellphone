const { sendError, sendSuccess } = require('../constants/response');
const ProductAction = require('../actions/ProductAction');
const CategoryAction = require('../actions/CategoryAction');
const Joi = require('joi');
module.exports.createProduct = (req, res) => {
    const { body } = req;
    ProductAction.createProduct(body)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getProducts = async (req, res) => {
    try {
        const data = req.query;
        const validator = Joi.object({
            is_deleted: Joi.boolean().optional(),
            is_active: Joi.boolean().optional().default(true),
            title: Joi.string().trim(),
            order: Joi.string().valid('asc', 'desc').default('desc'),
            limit: Joi.number().integer().max(100).default(10),
            sort_by: Joi.string().valid('created', 'retail_price').default('created'),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });

        const validated = await validator.validateAsync(data);

        ProductAction.getProducts(validated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {
        sendError(req, res)(error);
    }
};

module.exports.getProductBySlug = (req, res) => {
    const query = req.body;

    ProductAction.getProductBySlug(query)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getProductsByCategory = async (req, res) => {
    try {
        const query = req.query;
        const validator = Joi.object({
            is_deleted: Joi.boolean().optional(),
            is_active: Joi.boolean().optional().default(true),
            title: Joi.string().trim(),
            sort_by: Joi.string().valid('created', 'retail_price').default('created'),
            order: Joi.string().valid('asc', 'desc').default('desc'),
            id: Joi.string().trim(),
            limit: Joi.number().integer().max(100).default(10),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });

        const validated = await validator.validateAsync(query);
        ProductAction.getProductsByCategory(validated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {
        sendError(req, res)(error);
    }
};

module.exports.getProductGroupCategory = (req, res) => {
    ProductAction.getProductGroupCategory()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    ProductAction.deleteProduct(id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.searchProduct = async (req, res) => {
    try {
        const query = req.query;
        const validator = Joi.object({
            title: Joi.string().trim(),
            limit: Joi.number().integer().max(100).default(10),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });
        const validated = await validator.validateAsync(query);
        ProductAction.searchProduct(validated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {
        sendError(req, res)(error);
    }
};

module.exports.uploadImageCloud = (req, res) => {
    const files = req.files;
    ProductAction.uploadImageCloud(files)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.createKeyWord = (req, res) => {
    const { body } = req;
    ProductAction.createKeyWord(body)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};
module.exports.relationProduct = (req, res) => {
    const { body } = req;
    ProductAction.relationProduct(body)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};
module.exports.getTags = async (req, res) => {
    try {
        const { query } = req;
        const validator = Joi.object({
            title: Joi.string().trim(),
            limit: Joi.number().integer().max(100).default(10),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });
        const validated = await validator.validateAsync(query);
        ProductAction.getTags(validated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {
        sendError(req, res)(error);
    }
};

module.exports.changeStatusSpecial = (req, res) => {
    const { query } = req;
    ProductAction.changeStatusSpecial(query)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};
