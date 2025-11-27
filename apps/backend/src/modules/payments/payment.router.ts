import { Router } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { authenticate } from '@/common/middlewares/authenticate';
import { createSubscriptionPaymentIntentHandler, createTemplatePaymentIntentHandler } from './payment.controller';
import { stripeWebhookHandler } from './webhook.controller';
import express from 'express';

const router = Router();

// Webhook endpoint (must be before body parsing middleware)
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  asyncHandler(stripeWebhookHandler),
);

// Payment intent endpoints (require authentication)
router.post(
  '/subscription/intent',
  authenticate,
  asyncHandler(createSubscriptionPaymentIntentHandler),
);

router.post(
  '/template/intent',
  authenticate,
  asyncHandler(createTemplatePaymentIntentHandler),
);

export const paymentRouter: Router = router;

