import * as SparkPost from 'sparkpost';

export const sendEmail = async (recipient: string, url: string) => {
  const client = new SparkPost(process.env.SPARKPOST_API_KEY);
  const response = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'testing@sparkpostbox.com',
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
    recipients: [{ address: recipient }]
  });

  console.log(response);
};
