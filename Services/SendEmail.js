const nodeoutlook= require('nodejs-nodemailer-outlook');
function myEmail(dest , message) {


    nodeoutlook.sendEmail({
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        from: process.env.EMAIL_USER,
        to: dest,
        subject: 'Hey you, awesome!',
        html: message,
        text: 'This is text version!',

        
    }
    );
}
module.exports={
    myEmail
}
