import * as Joi from '@hapi/joi';

export const configEnvironmentsValidation = Joi.object({
  APP_NAME: Joi.string().required(),
  STAGE: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),
  // SWAGGER_SERVER_APP: Joi.string().required(),
  PATH_QUAKE_LOG: Joi.string().required(),
});
