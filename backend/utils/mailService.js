const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME || 'trannhunguyen78@gmail.com',
        pass: process.env.MAIL_PASSWORD || 'ulmfrjtuiqncqayz',
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendOTP = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: '"Hotel Admin" <trannhunguyen78@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Your OTP Code", // Subject line
            text: `Your OTP code is ${otp}. It expires in 10 minutes.`, // plain text body
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px 30px;
        }
        .otp-box {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .info-text {
            color: #666666;
            font-size: 16px;
            line-height: 1.6;
            margin: 20px 0;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning p {
            margin: 0;
            color: #856404;
            font-size: 14px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            margin: 5px 0;
            color: #999999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Hotel</h1>
        </div>
        
        <div class="content">
            <p class="info-text">Xin chào,</p>
            <p class="info-text">Bạn đã yêu cầu mã OTP để xác thực tài khoản của mình. Vui lòng sử dụng mã dưới đây:</p>
            
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
            </div>
            
            <p class="info-text">Mã OTP này sẽ hết hạn sau <strong>10 phút</strong>.</p>
            
            <div class="warning">
                <p><strong>⚠️ Lưu ý:</strong> Không chia sẻ mã OTP này với bất kỳ ai. Nhân viên của chúng tôi sẽ không bao giờ yêu cầu mã này.</p>
            </div>
            
            <p class="info-text">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
            
            <p class="info-text">Trân trọng,<br><strong>Hotel Admin Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© 2025 Hotel Admin. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>
            `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

module.exports = {
    sendOTP
};
