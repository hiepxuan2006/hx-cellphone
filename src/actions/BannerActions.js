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

    console.log(query);
    const banner = await Banner.find(query).lean();
    return banner;
};

module.exports.deleteBanner = async (id) => {
    return await Banner.delete({ _id: id });
};
