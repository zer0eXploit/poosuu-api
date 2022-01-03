const passwordReset = (name, url) => {
  const html = `
      <!doctype html>
      <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif; background-color: #fafafa;">
        <div style="padding: 15px;">
          <img src="https://images.unsplash.com/photo-1560972550-aba3456b5564?w=700&h=200&fit=crop" alt="Poo Suu Header" style="display: block; width: 100%;">
          <h2 style="text-align: center;">Password Reset</h2>
          <h3>Hi ${name}!</h3>
          <p>
            Someone has requested a password reset email to your Poo Suu admin account. If it is not you, you can safely discard this email.
          </p>
          <p>
            <a href="${url}">Reset My Password</a>
          </p>
          <p>
            The above link expires in 30 minutes.
          </p>
          <br />
          <p>
            <b>Best Regards,</b> <br /><br /> <span style="font-size: 14px;">The Poo Suu Admin Team</span>
          </p>
        </div>
      </body>
      </html>
    `;
  const plainText = `
    Hi ${name}! Someone has requested a password reset email to your Poo Suu admin account. If it is not you, you can safely discard this email. Please follow this link to reset your password. ${url}
    `;

  return [html, plainText];
};

export default passwordReset;
