const errorLooger = (error, req, res) => {

    const errorResponse = {
        api_url: `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`,
        message: error.message,
        stack: error.stack
    }

    console.log(errorResponse);

    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    })

}

module.exports = errorLooger;