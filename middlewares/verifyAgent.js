const jwt = require('jsonwebtoken');
const errorLooger = require('../utils/errorLooger');

const verifyAgent = async (req, res, next) => {

    try {

        const token = req.header('agent-token');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const data = {
            id: decoded.id,
            type: decoded.type
        }

        const validateAgent = await Agent.findById(data.id);

        if (!validateAgent || !validateAgent.isVerified) {
            return res.status(404).json({
                success: false,
                error: 'Access denied'
            });
        }

        req.agent = data;

        next();

    } catch (error) {

        errorLooger(error, req, res);

    }

}

module.exports = verifyAgent;