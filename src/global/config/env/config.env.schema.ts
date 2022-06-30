import * as Joi from '@hapi/joi';

// Exemplify the schema for the environment variables
export const configEnvironmentsValidation = Joi.object({
  APP_NAME: Joi.string().required(),
  STAGE: Joi.string().required(),
  GITHUB_REPO: Joi.string().required(),
  SWAGGER_SERVER_APP: Joi.string().required(),
  SWAGGER_DESCRIPTION: Joi.string().required(),
  SWAGGER_TITLE: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),
  LOG_PATH: Joi.string().required(),
  DEVELOPER_NAME: Joi.string().required(),
  DEVELOPER_EMAIL: Joi.string().required(),
  DEVELOPER_GITHUB_ACCOUNT: Joi.string().required(),
});
