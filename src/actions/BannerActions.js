const slugify = require('slugify');
const { getModel, getConnection } = require('../connection/database');
const { Promise } = require('bluebird');
const Banner = getModel('Banner');
const uploadCloud = require('../middlewares/uploadCloud');

module.exports.createBanner = async (args = {}, file) => {
    const { link, horizontal = false, category } = args;

    const result = await uploadCloud.uploadToCloudinary(file, 'banner');
    let data;
    data = {
        link,
        horizontal,
        image: result.secure_url,
    };
    if (category) data.category = category;
    const newBanner = new Banner(data);

    return await newBanner.save();
};

module.exports.getBanner = async (args = {}) => {
    const { horizontal, category } = args;
    const query = {};
    if (category === 'false') {
        query.category = { $exists: false };
    } else {
        query.category = category;
    }
    if (horizontal) query.horizontal = horizontal;

    const banner = await Banner.find(query).lean();
    return banner;
};

module.exports.deleteBanner = async (id) => {
    return await Banner.delete({ _id: id });
};

module.exports.getAllBanner = async (args) => {
    const { page, limit, is_active } = args;
    const skip = (page - 1) * limit;

    const _getBanner = Banner.find({ is_active })
        .populate({
            path: 'category',
            model: 'Category',
        })
        .skip(skip)
        .limit(limit)
        .lean();

    const _getCount = Banner.countDocuments({ is_active });
    const [banners, count] = await Promise.all([_getBanner, _getCount]);
    const pages = Math.ceil(count / limit) || 1;
    return { data: banners, pages, limit, page };
};
