const slugify = require('slugify');

const { getModel } = require('../connection/database');
const uploadCloud = require('../middlewares/uploadCloud');
const Category = getModel('Category');
module.exports.createCategory = async (args = {}, file) => {
    const { name, parentId, key, categoryParent } = args;
    if (!name) throw new Error('missing params');
    const { icon = [], image = [] } = file;

    let iconPath = icon[0];
    let imagePath = image[0];

    if (iconPath) {
        const { secure_url } = await uploadCloud.uploadToCloudinary(iconPath);
        iconPath = secure_url;
    }
    if (imagePath) {
        const { secure_url } = await uploadCloud.uploadToCloudinary(imagePath);
        imagePath = secure_url;
    }

    const newCategory = new Category({
        name,
        parent_id: !!categoryParent ? categoryParent : '0',
        slug: slugify(name, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: true,
            locale: 'vi',
            trim: true,
        }),
        icon: iconPath,
        image: imagePath,
        label: name,
        key,
    });
    const result = await newCategory.save();
    return { message: 'success' };
};

module.exports.getCategories = async () => {
    const categories = await Category.find().lean();

    const sets = (items, id = '0', link = 'parent_id') =>
        items
            .filter((item) => item[link] === id)
            .map((item) => ({ ...item, children: sets(items, item._id.toString()) }));
    return sets(categories);
};

module.exports.getCategoriesById = async (category_id) => {
    const category = await Category.findOne({ _id: category_id }).lean();
    return category;
};

module.exports.getCategoryChildren = async (category_id) => {
    const category = await Category.findOne({ _id: category_id }).lean();
    const categories = await Category.find().lean();
    if (!category) throw new Error('Category not found');
    const sets = (items, id, link = 'parent_id') =>
        items
            .filter((item) => item[link] === id)
            .map((item) => ({ ...item, children: sets(items, item._id.toString()) }));

    return sets(categories, category._id.toString());
    return category;
};

module.exports.getCategoryParent = async () => {
    const category = await Category.find({ parent_id: 0 }).lean();

    return category;
};

module.exports.deleteCategory = async (id) => {
    if (!id) throw new Error('missing params');

    const category = await Category.findOne({ _id: id }).lean();
    const categories = await Category.find().lean();
    const sets = (items, id, link = 'parent_id') =>
        items
            .filter((item) => item[link] === id)
            .map((item) => ({ ...item, children: sets(items, item._id.toString()) }));

    const data = sets(categories, category._id.toString()).map((item) => item._id);
    const dataDelete = [category._id, ...data];

    return await Category.deleteMany({ _id: dataDelete });
};
