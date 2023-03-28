const jwt = require("jsonwebtoken");

SECRET_KEY_DEFAULT = process.env.SECRET_KEY_TOKEN;
const { getModel } = require("../connection/database");
const getAccessToken = (req) => {
  const headerAuthor = (req.headers["authorization"] || "").trim();
  const fromXHeader = (req.headers["x-access-token"] || "").trim();

  const fromHeader = fromXHeader || headerAuthor;

  if (fromHeader) {
    return fromHeader.replace("Bearer ", "").trim();
  }

  return (req.body.token || req.query.token || "") + "";
};

module.exports.authorRoleAdmin = async (req, res, next) => {
  const Account = getModel("Account");
  const token = getAccessToken(req);
  try {
    if (!token) {
      throw new Error("No token provided.");
    } else {
      await jwt.verify(token, SECRET_KEY_DEFAULT, async (err, decoded) => {
        if (err) {
          throw new Error("Something went wrong. Please sign in again.");
        }
        const { id: _id, is_admin, email, role, exp } = decoded;
        if (exp < Date.now()) throw new Error("Access token invalid");
        const account = await Account.findOne({ _id, email });
        if (!account) throw new Error("Access token invalid");
        if (!is_admin) throw new Error("Access is denied");
        if (!role.includes("admin")) throw new Error("Access is denied");
        next();
      });
    }
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: error.message || "",
    });
  }
};

module.exports.authorization = async (req, res, next) => {
  const Account = getModel("Account");
  const token = getAccessToken(req);
  try {
    if (!token) {
      throw new Error("No token provided.");
    } else {
      await jwt.verify(token, SECRET_KEY_DEFAULT, async (err, decoded) => {
        if (err) {
          throw new Error("Something went wrong. Please sign in again.");
        }
        const { id: _id, is_admin, email, role, exp } = decoded;
        if (exp < Date.now()) throw new Error("Access token invalid");
        const account = await Account.findOne({ _id, email });
        if (!account) throw new Error("Access token invalid");
        next();
      });
    }
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: error.message || "",
    });
  }
};
