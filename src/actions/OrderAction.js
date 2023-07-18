const { getModel, getConnection } = require('../connection/database');
const Promise = require('bluebird');
const Order = getModel('Order');
const OrderItem = getModel('OrderItem');
const Product = getModel('Product');
const ProductVariant = getModel('ProductVariant');
module.exports.createOrder = async (args = {}) => {
    const session = await getConnection().startSession();
    session.startTransaction();

    try {
        const {
            name,
            address,
            product,
            note,
            deliveryType,
            phone,
            totalPrice,
            customer_id,
            pay,
        } = args;

        const shipping_address = Object.values(address)
            .reverse()
            .map((item) => item)
            .join(',');

        const newOrder = new Order({
            customer_id,
            order_at: Date.now(),
            delivery_type: deliveryType,
            shipping_address,
            order_code: 'DH' + Date.now(),
            name,
            phone_number: phone,
            note,
            price_total: totalPrice,
            payment_type: pay,
        });
        const newOrderItems = await Promise.map(
            product,
            async (item) => {
                const newOrderItem = new OrderItem({
                    order_id: newOrder._id,
                    product_id: item._id,
                    product_variant_id: item.variants._id,
                    discount: item.variants.sale,
                    quantity: item.quantity,
                    price: item.variants.retail_price,
                    image_uris: item.images,
                });
                return await newOrderItem.save();
            },
            {
                concurrency: 1,
            },
        );

        const newOrderItemsId = newOrderItems.map((item) => item._id);
        const order = Object.assign(newOrder, { order_item: newOrderItemsId });
        await order.save();
        await session.commitTransaction();
        session.endSession();

        return order;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error);
    } finally {
        session.endSession();
    }
};

module.exports.getOrderByOrderCode = async (order_code) => {
    if (!order_code) throw new Error('Params missing');
    const order = await Order.findOne({ order_code })
        .populate({
            path: 'order_item',
            populate: {
                path: 'product_variant_id',
                model: ProductVariant,
            },
        })

        .lean();
    if (!order) throw new Error('Order not found');
    return order;
};

module.exports.checkOrder = async (args = {}) => {
    const { orderCode, phone } = args;
    const order = await Order.findOne({ order_code: orderCode, phone }).populate({
        path: 'order_item',
        populate: {
            path: 'product_variant_id',
            model: ProductVariant,
        },
    }).lean;

    if (!order) throw new Error('order not found');
};

module.exports.changeStatusOrder = async (args) => {
    const { _id, status } = args;

    const order = await Order.findOne({ _id: _id }).lean();

    if (!order) throw new Error('Order not found');
    let updateData;
    if (status === 'confirmed') {
        updateData = { status, confirmed_at: Date.now() };
    }
    if (status === 'cancelled') {
        updateData = { status, cancelled_at: Date.now() };
    }
    if (status === 'shipping') {
        updateData = { status, shipping_at: Date.now() };
    }
    if (status === 'delivered') {
        updateData = { status, delivered_at: Date.now() };
    }
    if (status === 'delivery') {
        updateData = { status };
    }
    if (status === 'pending' || status === 'processing') {
        updateData = { status };
    }

    if (!updateData) throw new Error('Fail');

    await Order.updateOne({ _id: _id }, { $set: updateData }).lean();

    return true;
};

module.exports.getListOrder = async (args) => {
    const { limit, page, order_status } = args;
    let query = {};
    if (order_status !== 'all') query.status = order_status;
    const skip = (page - 1) * limit;
    const _getOrders = Order.find(query)
        .limit(limit)
        .skip(skip)
        .sort({ created: -1 })
        .populate({
            path: 'order_item',
            populate: {
                path: 'product_variant_id',
                model: ProductVariant,
            },
        })
        .lean();
    const _getTotal = Order.countDocuments(query);

    const [orders, toTal] = await Promise.all([_getOrders, _getTotal]);

    const pages = Math.ceil(toTal / limit) || 1;
    return {
        orders,
        limit,
        page,
        pages,
    };
};

module.exports.searchOrder = async (args = {}) => {
    const { order_code = '' } = args;

    if (!order_code) throw new Error('Missing order_code!');

    const order = await Order.findOne({ order_code }).lean();
    if (!order) throw new Error('Order not found!');
    return order;
};

module.exports.getOrderByDate = async () => {
    var startDate = new Date(new Date().setDate(new Date().getDate() - 12));
    var endDate = new Date();

    var dateArray = [];
    var currentDate = new Date(endDate);

    while (currentDate >= startDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() - 1);
    }
    const dailyTotal = await Order.aggregate([
        {
            $match: {
                order_at: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$order_at' } },
                totalAmount: { $sum: '$price_total' },
            },
        },
        {
            $group: {
                _id: null,
                dailyTotal: {
                    $push: {
                        time: '$_id',
                        totalAmount: '$totalAmount',
                    },
                },
            },
        },
        {
            $project: {
                dailyTotal: {
                    $map: {
                        input: dateArray,
                        as: 'time',
                        in: {
                            $let: {
                                vars: {
                                    matchingData: {
                                        $filter: {
                                            input: '$dailyTotal',
                                            cond: { $eq: ['$$this.time', '$$time'] },
                                        },
                                    },
                                },
                                in: {
                                    time: '$$time',
                                    totalAmount: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$$matchingData' }, 0] },
                                            then: {
                                                $first: '$$matchingData.totalAmount',
                                            },
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $unwind: '$dailyTotal',
        },
        {
            $sort: { 'dailyTotal.time': 1 },
        },
        {
            $group: {
                _id: null,
                dailyTotal: { $push: '$dailyTotal' },
            },
        },
        {
            $project: {
                _id: 0,
                dailyTotal: 1,
            },
        },
    ]);

    const orderMonth = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%m', date: '$order_at' } },
                totalAmount: { $sum: '$price_total' },
                hasOrder: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: null,
                dailyTotal: {
                    $push: {
                        time: { $toInt: '$_id' },
                        totalAmount: '$totalAmount',
                        hasOrder: '$hasOrder',
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                dailyTotal: {
                    $map: {
                        input: [
                            { time: 1 },
                            { time: 2 },
                            { time: 3 },
                            { time: 4 },
                            { time: 5 },
                            { time: 6 },
                            { time: 7 },
                            { time: 8 },
                            { time: 9 },
                            { time: 10 },
                            { time: 11 },
                            { time: 12 },
                        ],
                        as: 'm',
                        in: {
                            time: '$$m.time',
                            totalAmount: {
                                $reduce: {
                                    input: '$dailyTotal',
                                    initialValue: 0,
                                    in: {
                                        $cond: [
                                            { $eq: ['$$this.time', '$$m.time'] },
                                            { $add: ['$$value', '$$this.totalAmount'] },
                                            '$$value',
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    ]);
    const dailyMonth = orderMonth[0].dailyTotal;
    const dailyDay = dailyTotal.length ? dailyTotal[0].dailyTotal : dailyTotal;
    return { dailyMonth, dailyDay };
};

module.exports.getCountOrder = async () => {
    const countPending = Order.countDocuments({ status: 'pending' });
    const countConfirmed = Order.countDocuments({ status: 'confirmed' });
    const countProcessing = Order.countDocuments({ status: 'processing' });
    const countDelivery = Order.countDocuments({ status: 'delivery' });

    const [pending, confirmed, processing, delivery] = await Promise.all([
        countPending,
        countConfirmed,
        countProcessing,
        countDelivery,
    ]);
    return { pending, confirmed, processing, delivery };
};
