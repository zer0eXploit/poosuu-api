const accountCreationEmail = (name) => {
  const html = `
    <!doctype html>
    <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body style="font-family: sans-serif; background-color: #fafafa;">
      <div style="padding: 15px;">
        <img src="https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=900&h=300&fit=crop" alt="Poo Suu Header" style="display: block; width: 100%; border-radius: 4px;">
        <h2 style="text-align: center;">Poo Suu Admin Account Creation</h2>
        <h3>Hi ${name}!</h3>
        <p>
          Your account has been created and you can login now. Please be sure to change your password.
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
  Hi ${name}! Your account has been created and you can login now. Please be sure to change your password.
  `;

  return [html, plainText];
};

export default accountCreationEmail;
