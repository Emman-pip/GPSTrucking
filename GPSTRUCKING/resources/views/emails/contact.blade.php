<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Message</title>
    <style>
        /* Basic email-safe styling */
        body {
            background: #f6f9fc;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .header {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #111827;
        }
        .label {
            font-weight: bold;
            color: #374151;
        }
        .value {
            margin-bottom: 15px;
            color: #1f2937;
        }
        .message-box {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap;
            color: #111827;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">New Message From Your Website</div>

    <div class="label">Name:</div>
    <div class="value">{{ $name }}</div>

    <div class="label">Email:</div>
    <div class="value">{{ $email }}</div>

    <div class="label">Message:</div>
    <div class="message-box">
        {{ $body }}
    </div>
</div>

</body>
</html>
