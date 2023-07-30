const express = require('express');
const router = express.Router();
const path = require('path');
const Oauth = require('./middlewares/Oauth');
const uploadImage = require('./helper/upload');
const multer = require('./middlewares/multer');

/**
 * Account
 */
router.get('/ping', (req, res) => {
    res.send('ping pong');
});
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
const accountCtl = require('./controller/account');
router.post('/account/register', accountCtl.registerAccount);
router.post('/account/login', accountCtl.login);
router.post('/account/login', accountCtl.loginAdmin);

router.post('/set-role/:accountId', Oauth.authorRoleAdmin, accountCtl.settingRole);
router.get('/account/get-account/', Oauth.authorRoleAdmin, accountCtl.getAccount);

router.post('/account/auth/google', accountCtl.authGoogle);
router.get('/account/secret', Oauth.authorization, accountCtl.secretAccount);
router.get('/account/secret', Oauth.authorRoleAdmin, accountCtl.secretAccountAdmin);
router.post('/account/create-account', Oauth.authorRoleAdmin, accountCtl.createAccount);
router.get(
    '/account/get-detail-account',
    Oauth.authorRoleAdmin,
    accountCtl.getDetailAccount,
);
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////category
const categoryCtl = require('./controller/category');

router.post(
    '/category/create-category',
    multer.fields([
        { name: 'icon', maxCount: 1 },
        { name: 'image', maxCount: 8 },
    ]),
    // uploadImage.handleImageUploadIcon,
    categoryCtl.createCategory,
);
router.get('/category/get-categories', categoryCtl.getCategories);
router.get('/category/get-category/:id', categoryCtl.getCategoriesById);
router.get('/category/get-category-children/:id', categoryCtl.getCategoryChildren);
router.delete('/category/delete-category/:id', categoryCtl.deleteCategory);
router.get('/category/get-category-parent', categoryCtl.getCategoryParent);
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//product
const productCtl = require('./controller/productController');

//----webapp

//----admin
router.post('/product/create-product', productCtl.createProduct);
router.post('/product/relation-product', productCtl.relationProduct);
router.get('/product/change-status-special', productCtl.changeStatusSpecial);
router.delete('/product/delete-product/:id', productCtl.deleteProduct);
router.post('/product/key_word/create_key', productCtl.createKeyWord);
router.get('/product/key_word/get_key_words', productCtl.getTags);

//
router.get('/product/get-products', productCtl.getProducts);
router.get('/product/get-products-category', productCtl.getProductsByCategory);
router.post('/product/get-product', productCtl.getProductBySlug);
router.get('/product/get-product-group', productCtl.getProductGroupCategory);
router.post('/product/search-product', productCtl.searchProduct);
// /
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////slider//////
const sliderCtrl = require('./controller/sliderController');
router.post('/slider/create-slider', multer.single('image'), sliderCtrl.createSlider);
router.get('/slider/get-sliders', sliderCtrl.getSlider);
router.get('/slider/get-slider/:id', sliderCtrl.getSliderById);
router.delete('/slider/delete-slider/:id', sliderCtrl.deleteSlider);
router.get('/slider/search-slider', sliderCtrl.searchSlider);
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// order
const orderCtl = require('./controller/OrderController');
//---------webapp
router.post('/order/create-order', orderCtl.createOrder);

//---------admin
router.get('/order/get-orders', orderCtl.getListOrder);
router.get(
    '/order/get-order-by-account',
    Oauth.authorRoleAdmin,
    orderCtl.getOrderByAccount,
);
router.get('/order/count-order', Oauth.authorRoleAdmin, orderCtl.getCountOrder);
router.get('/order/change-status-order', orderCtl.changeStatusOrder);
router.get('/order/analytic-order/get-order-by-date', orderCtl.getOrderByDate);

// end order
router.post('/order/get-order-by-code', orderCtl.getOrderByOrderCode);
router.get('/order/check-order', orderCtl.checkOrder);
router.get('/order/search-order', orderCtl.searchOrder);
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//post
const postCtl = require('./controller/postController');

router.post('/post/create-topic', multer.single('image'), postCtl.createNewPost);
router.get('/post/get-all-topic', postCtl.getAllTopic);
router.get('/post/get-news-paper', postCtl.getNewsPaper);
router.get('/post/get-news-paper/group-topic', postCtl.getNewsPaperGroupTopic);
router.get('/post/get-news-paper/:id', postCtl.getNewsPaperById);
router.post('/post/create-news-paper', multer.single('image'), postCtl.createNewPaper);
router.post('/post/update/post/:id', multer.single('image'), postCtl.updatePost);
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// /////////
const bannerCtrl = require('./controller/bannerController');

router.post('/banner/create', multer.single('image'), bannerCtrl.createBanner);
router.get('/banner/get-banner', bannerCtrl.getBanner);
router.delete('/banner/delete-banner/:id', bannerCtrl.deleteBanner);
router.get('/banner/get-all-banner', bannerCtrl.geAllBanner);
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// upload images

router.post('/upload/post', uploadImage.handleImageUploadMultiPost, async (req, res) => {
    const { body } = req;
    const data = req.file;
    res.json({ success: true, data });
});
router.post('/upload/product', uploadImage.handleImageUploadMulti, async (req, res) => {
    const { body } = req;
    const data = req.file;
    res.json({ success: true, data });
});

router.post('/upload', multer.array('image', '10'), productCtl.uploadImageCloud);
module.exports = router;
