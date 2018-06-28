import * as sgMail from '@sendgrid/mail';

interface IEmailInput {
  to: string;
  subject: string;
  text: string;
  ctaText: string;
  ctaURL: string;
}

export const sendEmail = async (input: IEmailInput) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  sgMail.setSubstitutionWrappers('{{', '}}');

  sgMail.send({
    to: input.to,
    from: 'no-reply@karman-graphql-api.ro',
    subject: input.subject,
    text: input.text,
    html: '<p>' + input.text + '</p>',
    category: 'accountManagement',
    templateId: process.env.SENDGRID_SYSTEM_TEMPLATE,
    substitutions: {
      cta_text: input.ctaText,
      cta_url: input.ctaURL
    }
  });
};
