import type { FilterQuery, UpdateQuery } from 'mongoose';
import { InvitationModel, type InvitationDocument } from './invitation.model';

export class InvitationRepository {
  create(payload: Partial<InvitationDocument>) {
    return InvitationModel.create(payload);
  }

  findById(id: string) {
    return InvitationModel.findById(id)
      .populate('eventId', 'title date venue hostId')
      .populate('userId', 'name email avatar')
      .lean();
  }

  findByEventId(eventId: string) {
    return InvitationModel.find({ eventId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();
  }

  findByUserId(userId: string, eventId?: string) {
    const filter: FilterQuery<InvitationDocument> = { userId };
    if (eventId) {
      filter.eventId = eventId;
    }
    return InvitationModel.find(filter)
      .populate('eventId', 'title date venue hostId')
      .sort({ createdAt: -1 })
      .lean();
  }

  findByEventIdAndUserId(eventId: string, userId: string) {
    return InvitationModel.findOne({ eventId, userId }).lean();
  }

  updateById(id: string, payload: UpdateQuery<InvitationDocument>) {
    return InvitationModel.findByIdAndUpdate(id, payload, { new: true })
      .populate('eventId', 'title date venue hostId')
      .populate('userId', 'name email avatar')
      .lean();
  }

  deleteById(id: string) {
    return InvitationModel.findByIdAndDelete(id);
  }

  deleteByEventId(eventId: string) {
    return InvitationModel.deleteMany({ eventId });
  }

  list(filter: FilterQuery<InvitationDocument> = {}) {
    return InvitationModel.find(filter)
      .populate('eventId', 'title date venue hostId')
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();
  }

  listPaginated(
    filter: FilterQuery<InvitationDocument> = {},
    page: number = 1,
    pageSize: number = 10,
    sort?: Record<string, 1 | -1>
  ) {
    const skip = (page - 1) * pageSize;
    const query = InvitationModel.find(filter)
      .populate('eventId', 'title date venue hostId')
      .populate('userId', 'name email avatar');
    if (sort) {
      query.sort(sort);
    }
    return query
      .skip(skip)
      .limit(pageSize)
      .lean();
  }

  countDocuments(filter: FilterQuery<InvitationDocument> = {}) {
    return InvitationModel.countDocuments(filter);
  }

  countByEventId(eventId: string) {
    return InvitationModel.countDocuments({ eventId });
  }

  countByEventIdAndStatus(eventId: string, status: string) {
    return InvitationModel.countDocuments({ eventId, status });
  }
}

export const invitationRepository = new InvitationRepository();

