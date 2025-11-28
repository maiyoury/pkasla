import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../utils/logger';
import { GuestModel } from '../modules/guests/guest.model';

const dropGuestIndex = async () => {
  try {
    logger.info('Dropping unique index on guests collection...');
    
    // Drop the unique index userId_1_eventId_1 if it exists
    const indexes = await GuestModel.collection.getIndexes();
    logger.info({ indexes }, 'Current indexes');
    
    if (indexes['userId_1_eventId_1']) {
      await GuestModel.collection.dropIndex('userId_1_eventId_1');
      logger.info('✅ Successfully dropped unique index userId_1_eventId_1');
    } else {
      logger.info('ℹ️  Index userId_1_eventId_1 does not exist, nothing to drop');
    }
    
    // List remaining indexes
    const remainingIndexes = await GuestModel.collection.getIndexes();
    logger.info({ remainingIndexes: Object.keys(remainingIndexes) }, 'Remaining indexes');
    
  } catch (error: any) {
    // If index doesn't exist, that's okay
    if (error.code === 27 || error.codeName === 'IndexNotFound') {
      logger.info('ℹ️  Index does not exist, nothing to drop');
    } else {
      throw error;
    }
  }
};

const run = async () => {
  try {
    await connectDatabase();
    await dropGuestIndex();
    logger.info('✅ Index drop completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Failed to drop index');
    process.exit(1);
  } finally {
    await disconnectDatabase().catch((err) =>
      logger.error({ err }, 'Failed to close database connection'),
    );
  }
};

void run();

