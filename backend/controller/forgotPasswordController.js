const User = require('../model/Users');
const Otp = require('../model/otp');
const sgMail = require('@sendgrid/mail')
require('dotenv').config();

const forgotPasswordController = async (req, resp) => {

    let userExist = await User.findOne({ email: req.body.email })
    console.log('user ecxoir', userExist.email);
    let otp = ''

    if (userExist) {

        const generateOTP = (length = 4) => {
        
            for (let i = 0; i < length; i++) {
                otp += Math.floor(Math.random() * 10)
            }
            User.updateMany()
            return otp
        }


        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        console.log('cereate  key from send grid', process.env.SENDGRID_API_KEY);
        const msg = {
            to: userExist.email, // Change to your recipient
            from: 'kapil@fealtytechnologies.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
    
            html:   `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Amrutam Jewellery</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 hrs</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">OTP:${generateOTP()}</h2>
    <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p> Amrutam Jewellery</p>
      <p>our brand</p>
      <p>Indore</p>
    </div>
  </div>
</div>` ,


            

        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                resp.json({message: "Success"});
                let newOTP = {
                    email : userExist.email,
                    otp : otp,
                   }
                saveOtp(newOTP);

            })
            .catch((error) => {
                console.error(error)
                resp.send(error)
            })

    }

}

const saveOtp = async (req, resp) => {
    console.log("ressssss.....", req)

    let otpExist = await Otp.findOne({ email: req.email })
    if (otpExist)
    {
    console.log('user ecxoir', otpExist);
    otpExist.otp = req.otp;
    let result = await Otp.findOneAndUpdate({ email: req.email }, { $set: otpExist }, { new: true });
    console.log("updated otp ", result);
    }
    // let otp = ''
    let otpKey = new Otp(req);
    if (!otpExist) {
        let result = await otpKey.save();
        console.log("result.........................", result) 
    }
}

module.exports = forgotPasswordController;  