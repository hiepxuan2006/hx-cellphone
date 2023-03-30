const express = require("express")
const router = express.Router()
const path = require("path")
const Oauth = require("./middlewares/Oauth")
const passport = require("passport")
// require("./middlewares/passpost")
/**
 * Account
 */
router.get("/ping", (req, res) => {
  res.send("pingpong")
})
const accountCtl = require("./controller/account")
router.post("/register", accountCtl.registerAccount)
router.post("/login", accountCtl.login)
router.post("/set-role/:accountId", accountCtl.settingRole)
router.get("/account/get-account/", accountCtl.getAccount)

router.post("/account/auth/google", accountCtl.authGoogle)
router.get(
  "/account/secret",
  passport.authenticate("jwt", { session: false }),
  accountCtl.secretAccount
)

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.header("data", req.user)
    res.redirect("http://localhost:3000")
  }
)

const categoryCtl = require("./controller/category")

router.post("/category/create-category", categoryCtl.createCategory)
router.get("/category/get-category", categoryCtl.getCategory)
router.get("/category/get-category-id/:id", categoryCtl.getCategoriesById)

const productCtl = require("./controller/productController")
// const handleImageUpload = require("./helper/upload")
const uploadImage = require("./helper/upload")

router.post("/product/create-product", productCtl.createProduct)
router.get("/product/get-products", productCtl.getProducts)
router.get("/product/get-products-category", productCtl.getProductsByCategory)
router.get("/product/get-product", productCtl.getProductBySlug)
router.get("/product/get-product-group", productCtl.getProductGroupCategory)
router.get("/product/search-product", productCtl.searchProduct)
router.delete("/product/delete-product/:id", productCtl.deleteProduct)

const sliderCtrl = require("./controller/sliderController")
router.post(
  "/slider/create-slider",
  uploadImage.handleImageUploadMulti,
  sliderCtrl.createSlider
)
router.get("/slider/get-sliders", sliderCtrl.getSlider)
router.get("/slider/get-slider/:id", sliderCtrl.getSliderById)
router.delete("/slider/delete-slider/:id", sliderCtrl.deleteSlider)
router.get("/slider/search-slider", sliderCtrl.searchSlider)

// ////////////order
const orderCtl = require("./controller/OrderController")
router.post("/order/create-order", orderCtl.createOrder)
router.get("/order/get-order", orderCtl.getOrderById)
router.get("/order/get-order-code", orderCtl.getOrderByCodeAndPhone)
router.get("/order/change-status", orderCtl.changeStatusOrder)

// ///////post
const postCtl = require("./controller/postController")

router.post(
  "/post/create-topic",
  uploadImage.handleImageUploadMulti,
  postCtl.createNewPost
)
router.get("/post/get-all-topic", postCtl.getAllTopic)
router.get("/post/get-news-paper", postCtl.getNewsPaper)
router.get("/post/get-news-paper/group-topic", postCtl.getNewsPaperGroupTopic)
router.get("/post/get-news-paper/:id", postCtl.getNewsPaperById)
router.post(
  "/post/create-news-paper",
  uploadImage.handleImageUploadMulti,
  postCtl.createNewPaper
)
// upload images
router.post(
  "/upload/:folder",
  uploadImage.handleImageUploadMulti,
  async (req, res) => {
    const { body } = req
    const data = req.files
    res.json({ success: true, data })
  }
)
module.exports = router
