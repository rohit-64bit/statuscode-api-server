const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({

    paymentByUserID: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    paymentToAgentID: {
        type: Schema.Types.ObjectId,
        ref: 'agent',
        required: true
    },
    orderID: {
        type: String,
        required: true
    },
    paymentID: {
        type: String,
    },
    signature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true,
        enum: ['created', 'paid', 'failed']
    }

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('payment', PaymentSchema);