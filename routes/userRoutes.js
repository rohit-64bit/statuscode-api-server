const express = require('express');
const router = express.Router();
const User = require('../models/User');
const errorLooger = require('../utils/errorLooger');
const Otp = require('../models/Otp');
const bcyrpt = require('bcrypt');
const verifyUser = require('../middlewares/verifyUser');
const client = require('../utils/mailer');

router.post('/signup', async (req, res) => {

  try {

    const { name, email, password, dob } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    const salt = await bcyrpt.genSalt(10);

    const hashedPassword = await bcyrpt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, dob });

    const otp = await user.generateOTP();

    // mail the otp to user
    await client.sendMail(
      {
        from: process.env.MAIL,
        to: `${user.email}`,
        subject: `Hey ${user.name} welcome! please verify your email.`,
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
                <td style="background-color: #000000; color: #ffffff; font-size: 2rem; font-weight: bold; padding: 2rem; text-align: center;">Hey! ${user.name} welcome 👋</td>
              </tr>
              <tr>
                <td style="padding: 2rem;">
        
                <p style="font-size: 1rem;">
                </p>
        
                  <div style="margin-top: 2rem;display:flex; flex-direction: column; gap:10px;">
        
                    <div style="font-size: 0.8rem;">Please verify your email by using the otp below</div>
        
                    <p style="font-size: 1rem; font-weight: bold; text-align: center; margin:auto; background-color: white; color: black; padding:10px 30px 10px 30px; border-radius:5px; margin-top:30px">${otp}</p>
        
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
      message: "Profile Created",
      data: user.id,
      redirectType: "verify"
    });

  } catch (error) {

    errorLooger(error, req, res);

  }

})

router.post('/verify', async (req, res) => {

  try {

    const { userID, otp } = req.body;

    const validateUser = await User.findById(userID);

    if (!validateUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await validateUser.verifyOTP(otp, userID);

    await client.sendMail(
      {
        from: process.env.MAIL,
        to: `${validateUser.email}`,
        subject: `Hey ${validateUser.name} Thankyou! for joining us.`,
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
                <td style="background-color: #000000; color: #ffffff; font-size: 2rem; font-weight: bold; padding: 2rem; text-align: center;">Hey! ${validateUser.name} welcome 👋</td>
              </tr>
              <tr>
                <td style="padding: 2rem;">
        
                <p style="font-size: 1rem;">
                </p>
        
                  <div style="margin-top: 2rem;display:flex; flex-direction: column; gap:10px;">
        
                    <div style="font-size: 0.8rem;">Your email is verified successfully now you can login using your password.</div>
        
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

    res.status(200).json({
      success: true,
      message: 'OTP verified',
      redirectType: 'login'
    });

  } catch (error) {

    errorLooger(error, req, res);

  }

})

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const validateUser = await User.findOne({
      email
    });

    if (!validateUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!validateUser.isAuth) {

      const otp = await validateUser.generateOTP();

      // mail the otp to user
      await client.sendMail(
        {
          from: process.env.MAIL,
          to: `${validateUser.email}`,
          subject: `Hey ${validateUser.name} ! please verify your email to continue.`,
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
                <td style="background-color: #000000; color: #ffffff; font-size: 2rem; font-weight: bold; padding: 2rem; text-align: center;">Hey! ${validateUser.name} welcome 👋</td>
              </tr>
              <tr>
                <td style="padding: 2rem;">
        
                <p style="font-size: 1rem;">
                </p>
        
                  <div style="margin-top: 2rem;display:flex; flex-direction: column; gap:10px;">
        
                    <div style="font-size: 0.8rem;">Please verify your email by using the otp below</div>
        
                    <p style="font-size: 1rem; font-weight: bold; text-align: center; margin:auto; background-color: white; color: black; padding:10px 30px 10px 30px; border-radius:5px; margin-top:30px">${otp}</p>
        
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

      return res.status(200).json({
        success: true,
        message: 'Please verify your email to continue',
        redirectType: 'verify',
        data: validateUser.id
      })

    }

    const isMatch = await bcyrpt.compare(password, validateUser.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid password'
      });
    }

    const token = await validateUser.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: token
    });

  } catch (error) {

    errorLooger(error, req, res);

  }

})

router.put('/update-profile', verifyUser, async (req, res) => {
  try {

    const { name, email, weight, dob, password } = req.body;

    const validateUser = await User.findById(req.user.id);

    let data = {}

    if (name) {
      data.name = name;
    }

    if (email) {
      data.email = email;
    }

    if (weight) {
      data.details.weight = weight;
    }

    if (dob) {
      data.dob = dob;
    }

    if (password) {
      await validateUser.updatePassword(password);
    }

    await validateUser.updateOne(data);

    res.status(200).json({
      success: true,
      message: 'Profile updated'
    });

  } catch (error) {

    errorLooger(error, req, res);

  }
})

router.get('/', verifyUser, async (req, res) => {

  try {

    res.status(200).json({
      success: true,
      data: req.user.profile
    });

  } catch (error) {

    errorLooger(error, req, res);

  }

})

module.exports = router;