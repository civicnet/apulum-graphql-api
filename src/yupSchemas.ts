import * as yup from 'yup';
import { passwordTooShort } from './modules/register/errorMessages';

export const registerPasswordValidation = yup
  .string()
  .min(3, passwordTooShort)
  .max(255);
