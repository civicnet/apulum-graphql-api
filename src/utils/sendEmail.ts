import * as sgMail from '@sendgrid/mail';

export const sendEmail = async (recipient: string, url: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  // const client = new SparkPost(process.env.SPARKPOST_API_KEY);
  // console.log("Sending email with key " + process.env.SPARKPOST_API_KEY);
  /* const response = */ sgMail.send({
      to: recipient,
      from: 'testing@karman-graphql-api.ro',
      subject: 'Confirm account link',
      html: `
        <html>
          <body>
            <p>
              Confirm your account at <a href="${url}">${url}</a>
            </p>
          </body>
        </html>
      `
    },
  );

  // console.log("Sent ", response);
};
