const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next) => {

    try {

        const token = req.header('token');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const validateUser = await User.findById(decoded.id).select('-password');

        if (!validateUser || !validateUser.isAuth) {
            return res.status(404).json({
                success: false,
                error: 'Access denied'
            });
        }

        const data = {
            id: decoded.id,
            type: decoded.type,
            profile: validateUser
        }

        req.user = data;

        next();

    } catch (error) {

        errorLooger(error, req, res);

    }

}

module.exports = verifyUser;