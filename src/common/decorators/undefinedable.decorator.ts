import { ValidateIf } from 'class-validator';

/**
 * @description undefinedを許可するDecorator
 */
export const IsUndefinedable = () => {
  return ValidateIf((_, value) => value !== undefined);
};
