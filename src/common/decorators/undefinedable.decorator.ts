import { ValidateIf } from 'class-validator';

export const IsUndefinedable = () => {
  return ValidateIf((_, value) => value !== undefined);
};
