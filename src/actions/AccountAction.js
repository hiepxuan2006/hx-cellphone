const { getModel } = require('../connection/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const falcon = require('../helper/falcon');
const Account = getModel('Account');

module.exports.registerAccount = async (args = {}) => {
    const Account = getModel('Account');
    const { email, password, name, phone } = args;

    if (!email || !password || !name || !phone) throw new Error('Missing params !');

    const account = await Account.findOne({ email }).lean();

    if (account) throw new Error('Email already exists');
    const hashPassword = await bcrypt.hashSync(password, salt);

    const newAccount = new Account({
        email,
        password: hashPassword,
        name,
        auth_type: 'local',
        phone_number: phone,
    });

    const result = await newAccount.save();
    return { message: 'Register success', email: result.email };
};

module.exports.login = async (args = {}) => {
    const { password, email } = args;
    const _prefix = 'refresh:token';

    const _getKeyRefreshToken = (email) => {
        return `${_prefix}:${email}`;
    };

    const account = await Account.findOne({ email }).lean();
    if (!account) {
        throw new Error('Email or password fail');
    }
    const { email: emailDb, _id, is_admin, roles, password: passwordDb } = account;
    const validatorPassword = await bcrypt.compareSync(password, passwordDb);
    if (!validatorPassword) throw new Error('Email or password fail');

    const token = await jwt.sign(
        { id: _id, email, role: roles, is_admin },
        'hiepxuan19980620',
        {
            expiresIn: '1d',
        },
    );
    const refreshToken = await jwt.sign(
        { id: _id, email, role: roles },
        'refresh-hiepxuan19980620',
    );
    const keySaveCateRefreshToken = _getKeyRefreshToken(email);
    await falcon.set({
        key: keySaveCateRefreshToken,
        value: refreshToken,
    });
    return {
        email: emailDb,
        roles,
        is_admin,
        access_token: token,
    };
};

module.exports.loginAdmin = async (args = {}) => {
    const { password, email } = args;

    if (!password || !email) throw new Error('Missing params');

    const account = await Account.findOne({ email }).lean();

    if (!account) {
        throw new Error('Email or password fail');
    }

    const { email: emailDb, _id, is_admin, roles, password: passwordDb } = account;
    if (!is_admin) throw new Error('Authorization !');

    const validatorPassword = await bcrypt.compareSync(password, passwordDb);
    if (!validatorPassword) throw new Error('Email or password fail');

    const token = await jwt.sign(
        { id: _id, email, role: roles, is_admin },
        'hiepxuan19980620',
        {
            expiresIn: '1d',
        },
    );
    delete account.password;
    return {
        id: _id,
        user: account,
        roles,
        is_admin,
        access_token: token,
    };
};

module.exports.settingRole = async (args = {}) => {
    const { accountId, role } = args;
    const account = await Account.findOneAndUpdate(
        { _id: accountId },
        { $addToSet: { roles: 'admin' } },
    ).lean();
    return accountId;
};

const builtQuery = (args = {}) => {
    const { search, is_active, is_deleted } = args;
    const query = {};
    if (search) {
        query.email = {
            $regex: new RegExp(search, 'gi'),
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

module.exports.getAccount = async (args = {}) => {
    const { limit, page, ...rest } = args;
    const skip = (page - 1) * limit;
    const query = builtQuery(rest);
    const _accounts = Account.find(query)
        .limit(limit)
        .skip(skip)
        .sort({ _id: -1 })
        .lean();
    const _getTotal = Account.countDocuments({ query }).lean();

    const [accounts, getTotal] = await Promise.all([_accounts, _getTotal]);

    const pages = Math.ceil(getTotal / limit) || 1;
    return {
        accounts,
        limit,
        page,
        pages,
    };
};

module.exports.authGoogle = async (args = {}) => {
    const { email, familyName, givenName, googleId, imgUrl, name } = args;

    const renderAccessToken = async (id, email, roles, is_admin) => {
        return await jwt.sign({ id, email, role: roles, is_admin }, 'hiepxuan19980620', {
            expiresIn: '1d',
        });
    };
    const isExitsAccount = await Account.findOne({
        id_google: googleId,
        auth_type: 'google',
    })
        .select('-password')
        .lean();
    if (isExitsAccount) {
        const { _id, email, roles, is_admin } = isExitsAccount;
        const access_token = await renderAccessToken(_id, email, roles, is_admin);

        return { profile: isExitsAccount, access_token, roles, is_admin };
    }

    const isExitAccountLocal = await Account.findOne({
        email: email,
        auth_type: 'local',
    }).lean();

    if (isExitAccountLocal) {
        const dataUpdate = {
            $push: { auth_type: 'google' },
            id_google: googleId,
            name: name,
            avatar: imgUrl,
        };

        const { _id, email, roles, is_admin } = isExitAccountLocal;
        if (!isExitAccountLocal.avatar) dataUpdate['avatar'] = imgUrl;
        await Account.updateOne({ email: email }, dataUpdate);
        const access_token = await renderAccessToken(_id, email, roles, is_admin);

        const profile = await Account.findOne({ email: email })
            .select('-password')
            .lean();
        return { profile, access_token, roles, is_admin };
    }
    const account = new Account({
        auth_type: 'google',
        id_google: googleId,
        name: name,
        avatar: imgUrl,
        email,
    });
    const profile = await account.save();
    const { _id, email: emailRel, roles, is_admin } = account;
    const access_token = await renderAccessToken(_id, emailRel, roles, is_admin);

    return { profile, access_token, roles, is_admin };
};

module.exports.secretAccount = async (args = {}) => {
    return args;
};

module.exports.secretAccountAdmin = async () => {
    return true;
};

module.exports.createAccount = async (args) => {
    const { name, email, phone, role } = args;
    if (!email || !role || !name || !phone) throw new Error('Missing params !');

    const accountExits = await Account.findOne({
        $or: [{ email: email }, { phone_number: phone }],
    }).lean();

    if (accountExits) throw new Error('Email or phone registered');

    const hashPassword = await bcrypt.hashSync('123456', salt);
    const newAccount = new Account(
        Object.assign(
            { name, email, phone_number: phone, roles: role },
            { password: hashPassword, auth_type: 'local' },
        ),
    );
    console.log(newAccount);
    return await newAccount.save();
};

module.exports.getDetailAccount = async (id) => {
    const account = await Account.findOne({ _id: id }).select('-password').lean();
    if (!account) throw new Error('Account not found !');

    return account;
};
