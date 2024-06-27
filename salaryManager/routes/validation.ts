import { celebrate, Joi } from 'celebrate';

export const topicValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    text: Joi.string().required(),
  }),
});

export const messageValidation = celebrate({
  body: Joi.object().keys({
    text: Joi.string().required(),
    topic_id: Joi.string().required(),
  }),
});

export const commentValidation = celebrate({
  body: Joi.object().keys({
    text: Joi.string().required(),
    message_id: Joi.string().required(),
  }),
});
