const { sendError, sendSuccess } = require('../constants/response');
const CategoryAction = require('../actions/CategoryAction');

module.exports.createCategory = (req, res) => {
    const { body } = req;
    const image = req.files;
    CategoryAction.createCategory(body, image)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getCategories = (req, res) => {
    CategoryAction.getCategories().then(sendSuccess(req, res)).catch(sendError(req, res));
};

module.exports.getCategoriesById = (req, res) => {
    const { id } = req.params;
    CategoryAction.getCategoriesById(id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getCategoryChildren = (req, res) => {
    const { id } = req.params;
    CategoryAction.getCategoryChildren(id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.getCategoryParent = (req, res) => {
    CategoryAction.getCategoryParent()
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};

module.exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    CategoryAction.deleteCategory(id)
        .then(sendSuccess(req, res))
        .catch(sendError(req, res));
};
