import * as yup from "yup";

import { ResolverMap } from "../../types/graphql-utils";
import { User } from '../../entity/User';
import { formatYupError } from '../../utils/formatYupError';
import { duplicateEmail, emailNotLongEnough, emailNotValid } from './errorMessages';
import { createConfirmEmailLink } from './createConfirmEmailLink';
import { sendEmail } from '../../utils/sendEmail';
import { registerPasswordValidation } from "../../yupSchemas";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(emailNotValid),
  password: registerPasswordValidation
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => `Bye.`,
  },
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments, { redis, url }) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch(err) {
        return formatYupError(err);
      }

      const { email, password } = args;

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id']
      });

      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: duplicateEmail
          }
        ];
      }

      const user = User.create({
        email,
        password,
      });

      await user.save();

      if (process.env.NODE_ENV !== 'test') {
        const emailLink = await createConfirmEmailLink(url, user.id, redis);
        const input = {
          to: email,
          subject: "Bun venit! Avem nevoie de confirmarea contului tau în Karman CMS",
          text: "Pentru a putea începe să folosești Karman, va trebui să confirmi această adresă de email, pentru a ne asigura că ești chiar tu. ",
          ctaText: "Confirmă email",
          ctaURL: emailLink,
        };
        sendEmail(input);
      }
      return null;
    }
  }
}

