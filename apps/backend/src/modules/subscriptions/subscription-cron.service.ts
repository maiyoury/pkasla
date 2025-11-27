import { userSubscriptionRepository } from './user-subscription.repository';
import { logger } from '@/utils/logger';

/**
 * Service for handling subscription expiration and renewal
 */
class SubscriptionCronService {
  /**
   * Check and expire subscriptions that have passed their end date
   */
  async expireSubscriptions(): Promise<void> {
    try {
      const expiredSubscriptions = await userSubscriptionRepository.findExpiredSubscriptions();
      
      if (expiredSubscriptions.length === 0) {
        logger.info('No expired subscriptions found');
        return;
      }

      logger.info(`Found ${expiredSubscriptions.length} expired subscriptions`);

      for (const subscription of expiredSubscriptions) {
        const subscriptionId = (subscription as any)._id?.toString() || (subscription as any).id;
        
        if (!subscriptionId) {
          logger.warn('Subscription missing ID, skipping');
          continue;
        }

        await userSubscriptionRepository.updateById(subscriptionId, {
          $set: { status: 'expired' },
        });

        logger.info(`Expired subscription: ${subscriptionId}`);
      }

      logger.info(`Successfully expired ${expiredSubscriptions.length} subscriptions`);
    } catch (error: any) {
      logger.error('Error expiring subscriptions:', error);
      throw error;
    }
  }

  /**
   * Check subscriptions that are about to expire (within 7 days)
   * This can be used to send reminder emails
   */
  async checkUpcomingExpirations(): Promise<any[]> {
    try {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const upcomingExpirations = await userSubscriptionRepository.list({
        status: 'active',
        endDate: {
          $gte: new Date(),
          $lte: sevenDaysFromNow,
        },
      });

      logger.info(`Found ${upcomingExpirations.length} subscriptions expiring within 7 days`);
      return upcomingExpirations;
    } catch (error: any) {
      logger.error('Error checking upcoming expirations:', error);
      throw error;
    }
  }
}

export const subscriptionCronService = new SubscriptionCronService();

