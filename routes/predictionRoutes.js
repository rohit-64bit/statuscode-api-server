const express = require('express');
const errorLooger = require('../utils/errorLooger');
const router = express.Router();
const { spawn } = require('child_process');
const spawnPython = require('../utils/spawnPython');

router.post('/generate', async (req, res) => {

    try {

        const { data, age, gender } = req.body;

        const args = [
            ['../server/ml/type_doctor.py', `${age} year old ${gender}`, data],
            ['../server/ml/possible_diseases.py', data],
            ['../server/ml/precure.py', `${age} year old ${gender}`, data],
        ]

        const returnedData = args.map(async arg => {
            return await spawnPython(arg)
        })

        const predictions = await Promise.all(returnedData);

        function convertToValidJSON(input) {
            // Remove carriage return and newline characters, trim whitespace, and replace single quotes with double quotes
            const jsonString = input.replace(/\r\n/g, '').replace(/'/g, '"');
            return JSON.parse(jsonString);
        }

        const jsonObjects = predictions.map(convertToValidJSON);

        res.status(200).json({
            success: true,
            message: "Prediction generated",
            data: jsonObjects
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

module.exports = router;