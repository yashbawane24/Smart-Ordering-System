import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getActivePolls = async (req, res, next) => {
  try {
    const polls = await prisma.menuPoll.findMany({
      where: { status: 'ACTIVE' },
      include: {
        options: {
          include: {
            _count: { select: { votes: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let myVote = null;
    if (req.user && req.user.role === 'STUDENT' && polls.length > 0) {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (student) {
        myVote = await prisma.menuVote.findFirst({
          where: {
            studentId: student.id,
            pollId: polls[0].id
          }
        });
      }
    }

    return successResponse(res, 200, 'Menu polls fetched', {
      polls,
      myVote
    });
  } catch (error) {
    next(error);
  }
};

export const submitVote = async (req, res, next) => {
  try {
    const { id } = req.params; // pollId
    const { optionId } = req.body;

    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    if (!optionId) {
      return errorResponse(res, 400, 'optionId is required');
    }

    const poll = await prisma.menuPoll.findUnique({ where: { id } });
    if (!poll || poll.status !== 'ACTIVE') {
      return errorResponse(res, 400, 'Poll is not currently active');
    }

    // Upsert vote (1 vote per student per poll)
    const vote = await prisma.menuVote.upsert({
      where: {
        pollId_studentId: {
          pollId: id,
          studentId: student.id
        }
      },
      update: {
        optionId,
        createdAt: new Date()
      },
      create: {
        pollId: id,
        optionId,
        studentId: student.id
      }
    });

    return successResponse(res, 200, 'Vote recorded successfully', vote);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to submit vote');
  }
};

export const createPollAdmin = async (req, res, next) => {
  try {
    const { title, description, options, endDate } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return errorResponse(res, 400, 'Title and at least 2 voting options are required');
    }

    const endTime = endDate ? new Date(endDate) : new Date(Date.now() + 3 * 86400 * 1000);

    const poll = await prisma.menuPoll.create({
      data: {
        title,
        description,
        endTime,
        status: 'ACTIVE',
        options: {
          create: options.map(opt => ({
            optionName: typeof opt === 'string' ? opt : opt.optionName
          }))
        }
      },
      include: { options: true }
    });

    return successResponse(res, 201, 'Menu poll created', poll);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to create poll');
  }
};

export const getPollResultsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const poll = await prisma.menuPoll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            _count: { select: { votes: true } }
          }
        }
      }
    });

    if (!poll) {
      return errorResponse(res, 404, 'Poll not found');
    }

    const totalVotes = poll.options.reduce((acc, opt) => acc + opt._count.votes, 0);

    const formattedOptions = poll.options.map(opt => ({
      id: opt.id,
      name: opt.optionName,
      votes: opt._count.votes,
      percentage: totalVotes > 0 ? Number(((opt._count.votes / totalVotes) * 100).toFixed(1)) : 0
    }));

    return successResponse(res, 200, 'Poll results retrieved', {
      id: poll.id,
      title: poll.title,
      totalVotes,
      options: formattedOptions
    });
  } catch (error) {
    next(error);
  }
};
