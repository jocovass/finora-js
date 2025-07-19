import { UTCDate } from '@date-fns/utc';

import { parsedEnv } from '../../utils/parse-env';

export const getLoginEmailHtml = (otp: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Welcome to Finora!</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .header {
        font-size: 24px;
        font-weight: bold;
        color: #333;
    }
    .message {
        font-size: 16px;
        color: #555;
        margin: 20px 0;
    }
    .code-box {
        background-color: #f0f0f5;
        padding: 15px;
        border-radius: 6px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #222;
    }
    .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999;
        text-align: center;
    }
    </style>
</head>
<body>
    <div class="container">
    <div class="header">Hi there,</div>
    <div class="message">
        Here's your login code for ${parsedEnv.APP_NAME}:
    </div>
    <div class="code-box">${otp}</div>
    <div class="message">
        This code will expire in 5 minutes. Never share it with anyone.
    </div>
    <div class="footer">
        &copy; ${new UTCDate().getFullYear()} ${parsedEnv.APP_NAME}. All rights reserved.
    </div>
    </div>
</body>
</html>
`;

export const getLoginEmailText = (otp: string) => `
Hi there,

Here's your login code for ${parsedEnv.APP_NAME}:

${otp}

This code will expire in 5 minutes. Never share it with anyone.

– ${parsedEnv.APP_NAME} Team
`;
