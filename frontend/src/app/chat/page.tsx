'use client';

import {useEffect, useMemo, useState} from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import {useTranslations} from 'next-intl';
import SectionHeader from '@/components/SectionHeader';

type Message = {
  id: string;
  author: string;
  content: string;
  time: string;
  self?: boolean;
};

type Room = {
  id: string;
  name: string;
  topic: string;
  members: number;
  statusLabel: string;
  unread: number;
};

const buildRooms = (t: (key: string) => string): Room[] => [
  {
    id: 'care',
    name: t('rooms.care.name'),
    topic: t('rooms.care.topic'),
    members: 8,
    statusLabel: t('rooms.care.status'),
    unread: 3
  },
  {
    id: 'onboarding',
    name: t('rooms.onboarding.name'),
    topic: t('rooms.onboarding.topic'),
    members: 6,
    statusLabel: t('rooms.onboarding.status'),
    unread: 0
  },
  {
    id: 'partners',
    name: t('rooms.partners.name'),
    topic: t('rooms.partners.topic'),
    members: 5,
    statusLabel: t('rooms.partners.status'),
    unread: 1
  }
];

const buildThreads = (t: (key: string) => string): Record<string, Message[]> => ({
  care: [
    {
      id: 'care-1',
      author: t('people.lisa'),
      content: t('messages.care.one'),
      time: '09:05'
    },
    {
      id: 'care-2',
      author: t('people.you'),
      content: t('messages.care.two'),
      time: '09:06',
      self: true
    },
    {
      id: 'care-3',
      author: t('people.otto'),
      content: t('messages.care.three'),
      time: '09:08'
    }
  ],
  onboarding: [
    {
      id: 'onboarding-1',
      author: t('people.mila'),
      content: t('messages.onboarding.one'),
      time: '10:12'
    },
    {
      id: 'onboarding-2',
      author: t('people.you'),
      content: t('messages.onboarding.two'),
      time: '10:14',
      self: true
    },
    {
      id: 'onboarding-3',
      author: t('people.jonas'),
      content: t('messages.onboarding.three'),
      time: '10:15'
    }
  ],
  partners: [
    {
      id: 'partners-1',
      author: t('people.elin'),
      content: t('messages.partners.one'),
      time: '13:42'
    },
    {
      id: 'partners-2',
      author: t('people.you'),
      content: t('messages.partners.two'),
      time: '13:44',
      self: true
    },
    {
      id: 'partners-3',
      author: t('people.samir'),
      content: t('messages.partners.three'),
      time: '13:47'
    }
  ]
});

export default function ChatPage() {
  const t = useTranslations('chat');
  const rooms = useMemo(() => buildRooms(t), [t]);
  const baseThreads = useMemo(() => buildThreads(t), [t]);

  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id ?? 'care');
  const [threads, setThreads] = useState(baseThreads);
  const [composer, setComposer] = useState('');

  useEffect(() => {
    setThreads(baseThreads);
  }, [baseThreads]);

  const activeRoom = rooms.find((room) => room.id === activeRoomId) ?? rooms[0];
  const activeMessages = threads[activeRoomId] ?? [];

  const quickReplies = [
    t('quickReplies.checkin'),
    t('quickReplies.summary'),
    t('quickReplies.schedule')
  ];

  const handleSend = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: t('people.you'),
      content: trimmed,
      time: t('time.now'),
      self: true
    };

    setThreads((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] ?? []), userMessage]
    }));
    setComposer('');

    window.setTimeout(() => {
      const reply: Message = {
        id: `assistant-${Date.now()}`,
        author: t('people.assistant'),
        content: t(`autoReplies.${activeRoomId}`),
        time: t('time.now')
      };

      setThreads((prev) => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] ?? []), reply]
      }));
    }, 700);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />

      <Box className="chat-layout">
        <Stack spacing={2} className="chat-sidebar">
          <Typography variant="subtitle1" sx={{fontWeight: 600}}>
            {t('sidebarTitle')}
          </Typography>
          <Stack spacing={1.5}>
            {rooms.map((room) => (
              <Card
                key={room.id}
                className={`chat-room ${room.id === activeRoomId ? 'active' : ''}`}
                onClick={() => setActiveRoomId(room.id)}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">{room.name}</Typography>
                      {room.unread > 0 ? (
                        <Chip
                          label={room.unread}
                          size="small"
                          color="secondary"
                        />
                      ) : null}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {room.topic}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={room.statusLabel} size="small" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        {room.members} {t('membersLabel')}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Card className="info-card">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4">{t('focus.title')}</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t('focus.one')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('focus.two')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('focus.three')}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Card className="chat-panel">
          <Box className="chat-panel-header">
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography variant="h3">{activeRoom?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeRoom?.topic}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={t('status.live')} size="small" color="primary" />
                  <IconButton aria-label={t('actions.more')}>
                    <MoreHorizIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <AvatarGroup max={4}>
                  <Avatar>{t('avatars.one')}</Avatar>
                  <Avatar>{t('avatars.two')}</Avatar>
                  <Avatar>{t('avatars.three')}</Avatar>
                  <Avatar>{t('avatars.four')}</Avatar>
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary">
                  {t('presence')}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box className="chat-thread">
            {activeMessages.map((message) => (
              <Box
                key={message.id}
                className={`chat-message ${message.self ? 'self' : ''}`}
              >
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">{message.author}</Typography>
                  <Typography variant="body2">{message.content}</Typography>
                  <Typography variant="caption" className="chat-message-meta">
                    {message.time}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>

          <Divider />

          <Box className="chat-composer">
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="subtitle2" color="text.secondary">
                  {t('quickRepliesTitle')}
                </Typography>
                {quickReplies.map((reply) => (
                  <Chip
                    key={reply}
                    label={reply}
                    size="small"
                    variant="outlined"
                    onClick={() => handleSend(reply)}
                  />
                ))}
              </Stack>
              <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  value={composer}
                  placeholder={t('composerPlaceholder')}
                  onChange={(event) => setComposer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSend(composer);
                    }
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={() => handleSend(composer)}
                  sx={{alignSelf: {xs: 'stretch', sm: 'flex-end'}}}
                >
                  {t('sendLabel')}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
