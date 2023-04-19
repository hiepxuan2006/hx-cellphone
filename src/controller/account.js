const { sendError, sendSuccess } = require('../constants/response');
const AccountAction = require('../actions/AccountAction');
const Joi = require('joi');

module.exports.registerAccount = (req, res) => {
    const { body } = req;
    AccountAction.registerAccount(body)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.login = (req, res) => {
    const { body } = req;
    AccountAction.login(body).then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.loginAdmin = (req, res) => {
    const { body } = req;
    AccountAction.loginAdmin(body).then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.settingRole = (req, res) => {
    const { accountId } = req.params;
    const { role } = req.body;

    AccountAction.settingRole({ accountId, role })
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getAccount = async (req, res) => {
    try {
        const data = req.query;

        const validator = Joi.object({
            is_deleted: Joi.boolean().optional(),
            is_active: Joi.boolean().optional().default(true),
            title: Joi.string().trim(),
            limit: Joi.number().integer().max(100).default(10),
            page: Joi.number().integer().default(1),
        }).options({ stripUnknown: true });

        const validated = await validator.validateAsync(data);

        AccountAction.getAccount(validated)
            .then(sendSuccess(req, res))
            .catch(sendError(req, res));
    } catch (error) {
        sendError(req, res)(error);
    }
};

module.exports.authGoogle = (req, res) => {
    const { body } = req;
    AccountAction.authGoogle(body).then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.secretAccount = (req, res) => {
    const { user } = req;
    AccountAction.secretAccount(user)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.secretAccountAdmin = (req, res) => {
    const { user } = req;
    AccountAction.secretAccountAdmin(user)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};
