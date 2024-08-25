const express = require('express');
const errorLooger = require('../utils/errorLooger');
const Agent = require('../models/Agent');
const router = express.Router();
const verifyAgent = require('../middlewares/verifyAgent');
const bcrypt = require('bcrypt');
const client = require('../utils/mailer');

router.post('/register', async (req, res) => {

    try {

        const { name, email, password, type, commision } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name, email and password'
            });
        }

        const validateAgent = await Agent.findOne({
            email
        })

        if (validateAgent) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);

        const secPass = await bcrypt.hash(password, salt);

        const agent = await Agent.create({
            name,
            email,
            password: secPass,
            type,
            commision
        })

        // mail the otp to user
        await client.sendMail(
            {
                from: process.env.MAIL,
                to: `${email}`,
                subject: `Hey ${name} welcome! your account is under review.`,
                html: `
                    <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #333;
              background-color: #f7f7f7;
              padding: 20px;
              margin: 0;
              width:100%;
              }
            </style>
          </head>
          <body>
            <table style="width: 100%; max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="background-color: #000000; color: #ffffff; font-size: 2rem; font-weight: bold; padding: 2rem; text-align: center;">
                  Healthalign
                </td>
              </tr>
        
              <tr>
                <td style="background-color: #000000; color: #ffffff; font-size: 2rem; font-weight: bold; padding: 2rem; text-align: center;">Hey! ${name} welcome 👋</td>
              </tr>
              <tr>
                <td style="padding: 2rem;">
        
                <p style="font-size: 1rem;">
                </p>
        
                  <div style="margin-top: 2rem;display:flex; flex-direction: column; gap:10px;">
        
                    <div style="font-size: 0.8rem;">Hey expert welcome to Healthalign your profile is under review and will be verified within 24 hours if eligible after successful verification you will receive a confirmation email.</div>
        
                  </div>
        
                </td>
              </tr>
              <tr>
                <td style="background-color: #000000; padding: 1rem; text-align: center;">
                  <a href="${process.env.CLIENT_URL}" style="font-weight: bold; color: #ffffff;">Healthalign</a>
                </td>
              </tr>
            </table>
          </body>
        </html>
                    `
            }
        ).catch(err => {
            console.error(err)
        });

        res.status(201).json({
            success: true,
            message: "Registration Successful"
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        const validateAgent = await Agent.findOne({
            email
        })

        if (!validateAgent) {
            return res.status(404).json({
                success: false,
                error: 'Invalid Credentials'
            });
        }

        const token = await validateAgent.generateAuthToken();

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token: token
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.get('/', verifyAgent, async (req, res) => {

    try {

        const validateAgent = await Agent.findById(req.agent.id).select('-password');

        if (!validateAgent || !validateAgent.isVerified) {
            return res.status(404).json({
                success: false,
                error: 'Account Not Found'
            });
        }

        res.status(200).json({
            success: true,
            data: validateAgent
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

module.exports = router;