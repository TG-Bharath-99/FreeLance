const Message = require('../models/Message');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Fetch messages where the current user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    res.json(messages);
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ message: 'Server error retrieving messages', error: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages/:userId
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const { content, projectId } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const newMessage = await Message.create({
      sender: currentUserId,
      receiver: userId,
      content,
      project: projectId || null,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Server error sending message', error: error.message });
  }
};

// @desc    Get all chat contacts for the current user
// @route   GET /api/messages/contacts
// @access  Private
exports.getContacts = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Find all distinct users the current user has messaged or received messages from
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name profileImage role')
      .populate('receiver', 'name profileImage role');

    // Extract unique contacts
    const contactsMap = new Map();

    messages.forEach((msg) => {
      let contact;
      if (msg.sender._id.toString() === currentUserId.toString()) {
        contact = msg.receiver;
      } else {
        contact = msg.sender;
      }

      if (!contactsMap.has(contact._id.toString())) {
        contactsMap.set(contact._id.toString(), {
          user: contact,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
        });
      }
    });

    const contacts = Array.from(contactsMap.values());
    res.json(contacts);
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ message: 'Server error retrieving contacts', error: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user.id,
      read: false
    });
    res.json({ unreadCount });
  } catch (error) {
    console.error('Get Unread Count Error:', error);
    res.status(500).json({ message: 'Server error retrieving unread count', error: error.message });
  }
};

// @desc    Mark messages as read from a specific sender
// @route   PATCH /api/messages/mark-read/:senderId
// @access  Private
exports.markRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    await Message.updateMany(
      { sender: senderId, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ message: 'Server error marking messages as read', error: error.message });
  }
};
