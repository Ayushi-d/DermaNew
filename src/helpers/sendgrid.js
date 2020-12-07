const CONFIG = {
  SENDGRIDURL: 'https://api.sendgrid.com/v3/mail/send',
};

function sendGridEmail(key, to, from, subject, body, type = 'text/plain') {
  const isSuccess = sendEmail(key, to, from, subject, body, type);
  return isSuccess;
}

async function sendEmail(key, to, from, subject, body, type) {
  try {
    const response = await fetch(CONFIG.SENDGRIDURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + key,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: to,
              },
            ],
            subject: subject,
          },
        ],
        from: {
          email: from,
          name: 'Derma Cupid',
        },
        content: [
          {
            type: type,
            value: body,
          },
        ],
      }),
    });
    return true;
  } catch (error) {
    return false;
  }
}

export default sendGridEmail;
