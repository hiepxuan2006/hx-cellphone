const Joi = require('joi');
const OrderAction = require('../actions/OrderAction');
const { sendError, sendSuccess } = require('../constants/response');
module.exports.createOrder = (req, res) => {
    const { body } = req;
    OrderAction.createOrder(body).then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.getOrderByOrderCode = (req, res) => {
    const { order_code } = req.body;

    OrderAction.getOrderByOrderCode(order_code)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.checkOrder = (req, res) => {
    const query = req.query;
    OrderAction.checkOrder(query).then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.changeStatusOrder = (req, res) => {
    const { query } = req;
    OrderAction.changeStatusOrder(query)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getListOrder = async (req, res) => {
    try {
        const { query } = req;
        const validator = Joi.object({
            order_status: Joi.string().trim(),
            limit: Joi.number().integer().max(100).default(10),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });
        const validated = await validator.validateAsync(query);
        OrderAction.getListOrder(validated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {
        sendError(req, res)(error);
    }
};

module.exports.searchOrder = (req, res) => {
    const { query } = req;

    OrderAction.searchOrder(query).then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.getOrderByDate = (req, res) => {
    OrderAction.getOrderByDate().then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.getCountOrder = (req, res) => {
    OrderAction.getCountOrder().then(sendSuccess(req, res)).catch(sendError(req, res));
};
