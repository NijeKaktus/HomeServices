import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/conversations', async (req, res) => {
  try {
    const { customerId, providerId, customerUserId, providerUserId } = req.body;

    let cId = customerId;
    let pId = providerId;

    if (customerUserId && !customerId) {
      const customer = await prisma.customer.findUnique({ where: { userId: customerUserId } });
      if (!customer) return res.status(404).json({ error: 'Customer nije pronađen' });
      cId = customer.id;
    }

    if (providerUserId && !providerId) {
      const provider = await prisma.serviceProvider.findUnique({ where: { userId: providerUserId } });
      if (!provider) return res.status(404).json({ error: 'Provider nije pronađen' });
      pId = provider.id;
    }

    if (!cId || !pId) {
      return res.status(400).json({ error: 'Customer ID and Provider ID su obavezni' });
    }

    const include = {
      customer: { include: { user: { select: { id: true, name: true, email: true } } } },
      provider: { include: { user: { select: { id: true, name: true, email: true } } } }
    };

    let conversation = await prisma.conversation.findFirst({
      where: { customerId: cId, providerId: pId },
      include
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { customerId: cId, providerId: pId },
        include
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error creating/finding conversation:', error);
    res.status(500).json({ error: 'Greška pri kreiranju razgovora' });
  }
});

router.get('/conversations/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.userId) },
      include: { customer: true, serviceProvider: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }

    const include = {
      messages: { orderBy: { createdAt: 'desc' as const }, take: 1 }
    };

    let conversations = [];

    if (user.customer) {
      conversations = await prisma.conversation.findMany({
        where: { customerId: user.customer.id },
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          provider: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } }
        },
        orderBy: { lastMessageAt: 'desc' }
      });
    } else if (user.serviceProvider) {
      conversations = await prisma.conversation.findMany({
        where: { providerId: user.serviceProvider.id },
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          customer: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } }
        },
        orderBy: { lastMessageAt: 'desc' }
      });
    }

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju razgovora' });
  }
});

router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const messages = await prisma.message.findMany({
      where: { conversationId: parseInt(req.params.conversationId) },
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Greška pri dohvatanju poruka' });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;

    if (!conversationId || !senderId || !content) {
      return res.status(400).json({ error: 'Svi podaci su obavezni' });
    }

    const message = await prisma.message.create({
      data: { conversationId, senderId, content },
      include: { sender: { select: { id: true, name: true } } }
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: content, lastMessageAt: new Date() }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Greška pri slanju poruke' });
  }
});

router.patch('/messages/:messageId/read', async (req, res) => {
  try {
    await prisma.message.update({
      where: { id: parseInt(req.params.messageId) },
      data: { isRead: true }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Greška pri označavanju poruke' });
  }
});

export default router;