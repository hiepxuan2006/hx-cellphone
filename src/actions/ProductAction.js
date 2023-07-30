const slugify = require('slugify');
const { getModel, getConnection } = require('../connection/database');
const uploadCloud = require('../middlewares/uploadCloud');
const Promise = require('bluebird');
const { validationResult } = require('express-validator');
const Product = getModel('Product');
const ProductAttribute = getModel('ProductAttribute');
const ProductVariant = getModel('ProductVariant');
const Category = getModel('Category');

module.exports.createProduct = async (args = {}) => {
    const session = await getConnection().startSession();
    session.startTransaction();
    try {
        const {
            name,
            description,
            price,
            tags,
            category,
            relation,
            images,
            salientFeatures,
            product_class,
            key_word,
            sale,
            variants = [],
            attributes = [],
            childCategory,
        } = args;

        let newProduct = new Product({
            title: name,
            slug: slugify(name, {
                replacement: '-',
                remove: undefined,
                lower: true,
                strict: true,
                locale: 'vi',
                trim: true,
            }),
            sale_price: sale,
            key_word,
            category,
            images,
            product_class,
            relation,
            description,
            retail_price: price,
            tags,
            salient_features: salientFeatures,
            sub_category: childCategory,
        });

        const resultAttr = await Promise.map(
            attributes,
            async (attribute) => {
                const newAttribute = await ProductAttribute(attribute);
                return await newAttribute.save({ session });
            },
            {
                concurrency: 1,
            },
        );

        const attrId = resultAttr.map((item) => item._id);

        const resultVariant = await Promise.map(
            variants,
            async (variant) => {
                const { options } = variant;
                const title =
                    name + ' / ' + options.map((option) => option.name).join(' / ');
                const newVariant = new ProductVariant(
                    Object.assign({}, variant, {
                        title,
                        product: newProduct._id,
                        image_uris: variant.image_path,
                    }),
                );
                return await newVariant.save({ session });
            },
            { concurrency: 1 },
        );

        const variantId = resultVariant.map((item) => item._id);

        newProduct = new Product(
            Object.assign(newProduct, {
                variants: variantId,
                attributes: attrId,
            }),
        );

        await newProduct.save({ session });
        await session.commitTransaction();
        session.endSession();
        return newProduct;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error);
    } finally {
        session.endSession();
    }
};

const builtQuery = (args = {}) => {
    const { title, is_active, is_deleted } = args;
    const query = {};
    if (title) {
        query.title = {
            $regex: new RegExp(title, 'gi'),
        };
    }

    if (is_deleted) {
        query.is_deleted = is_deleted;
        query.is_active = false;
    } else {
        query.is_active = is_active;
    }
    return query;
};

module.exports.getProducts = async (args = {}) => {
    const { limit = 10, page = 1, sort_by, order, ...rest } = args;
    const skip = (page - 1) * limit;
    const query = builtQuery(rest);
    const sortBy = { [sort_by]: order };
    const products = await Product.find(query)
        .populate({
            path: 'variants',
            model: ProductVariant,
        })
        .populate({ path: 'attributes', model: ProductAttribute })
        .populate({ path: 'category', model: Category })
        .limit(limit)
        .sort(sortBy)
        .skip(skip)
        .sort({ _id: -1 })
        .lean();
    return products;
};

module.exports.getProductBySlug = async (args = {}) => {
    const { id, slug } = args;

    const product = await Product.findOne({ slug })
        .populate({ path: 'attributes', model: ProductAttribute })
        .populate({ path: 'variants', model: ProductVariant })
        .populate({ path: 'category', model: Category })
        .populate({ path: 'relation', model: Product })
        .lean();
    return product;
};

module.exports.getProductsByCategory = async (args) => {
    const { id, limit, page, sort_by, order } = args;
    const skip = (page - 1) * limit;
    if (!id) throw new Error('Missing params');

    const sortBy = { [sort_by]: order };
    const _getProducts = Product.find({ category: id })
        .populate({ path: 'attributes', model: ProductAttribute })
        .populate({ path: 'variants', model: ProductVariant })
        .populate({ path: 'category', model: Category })
        .skip(skip)
        .sort(sortBy)
        .limit(limit)
        .lean();
    const _getTotal = Product.countDocuments({ category: id });

    const [total, products] = await Promise.all([_getTotal, _getProducts]);
    const pages = Math.ceil(total / limit) || 1;
    return {
        data: products,
        limit,
        page,
        pages,
    };
};

module.exports.getProductGroupCategory = async () => {
    const categories = await Category.find().lean();

    const sets = (items, id = '0', link = 'parent_id') =>
        items
            .filter((item) => item[link] === id)
            .map((item) => ({ ...item, children: sets(items, item._id.toString()) }));

    const categoryFilter = sets(categories);

    const productGroup = await Promise.map(
        categoryFilter,
        async (category) => {
            const products = await Product.find({ category: category._id })
                .limit(12)
                .lean();
            return {
                category,
                products,
            };
        },
        {
            concurrency: 1,
        },
    );
    return productGroup;
};
module.exports.deleteProduct = async (id) => {
    const product = await Product.findOne({ _id: id }).lean();

    if (!product) throw new Error('product not found');

    const data = await Product.updateOne(
        { _id: id },
        {
            $set: { is_deleted: true, is_active: false },
        },
    ).lean();
    return data;
};

module.exports.searchProduct = async (args = {}) => {
    const { title, page, limit } = args;

    const skip = (page - 1) * limit;
    const query = {};

    if (title) {
        query.title = {
            $regex: new RegExp(title, 'gi'),
        };
    }
    const _getProducts = Product.find(query)
        .populate({ path: 'attributes', model: ProductAttribute })
        .populate({ path: 'variants', model: ProductVariant })
        .populate({ path: 'category', model: Category })
        .skip(skip)
        .limit(limit)
        .lean();
    const _getTotal = Product.countDocuments(query).lean();

    const [products, total] = await Promise.all([_getProducts, _getTotal]);

    const pages = Math.ceil(total / limit) || 1;
    return {
        data: products,
        page,
        limit,
        pages,
    };
};

module.exports.uploadImageCloud = async (files) => {
    const result = await uploadCloud.uploadMultiToCloudinary(files, 'product');
    return result;
};

module.exports.relationProduct = async (args = {}) => {
    const { relations = [] } = args;

    if (!relations.length) throw new Error('Missing params');

    await Promise.map(
        relations,
        async (item) => {
            const relationsOther = relations.filter((value) => value !== item);
            const product = await Product.findOne({ _id: item }).lean();
            const { relation = [] } = product;
            // const newRelation = [...relation, ...relationsOther];
            return await Product.updateOne(
                { _id: item },
                { $set: { relation: relationsOther } },
            );
        },
        { concurrency: 1 },
    );
    return true;
};

module.exports.changeStatusSpecial = async (args) => {
    const { id, status } = args;
    if (!id) throw new Error('Missing params');

    const product = await Product.findOneAndUpdate(
        { _id: id },
        { $set: { special: status } },
    ).lean();
    return product;
};
// /////////////////
const Tag = getModel('Tag');
module.exports.createKeyWord = async (args = {}) => {
    const { title } = args;
    if (!title) throw new Error('missing params');

    const newTag = new Tag({
        title,
        slug: slugify(title, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: true,
            locale: 'vi',
            trim: true,
        }),
    });
    return await newTag.save();
};

module.exports.getTags = async (args = {}) => {
    const { limit, page, ...rest } = args;
    const skip = (page - 1) * limit;
    const _getTag = Tag.find().limit(limit).skip(skip).lean();
    const _getTotal = Tag.countDocuments();

    const [tags, total] = await Promise.all([_getTag, _getTotal]);

    const pages = Math.floor(total / limit);

    return { tags, limit, page, pages };
};
