'use client';

import {useEffect, useMemo, useState} from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
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
import {useSearchParams} from 'next/navigation';

type Message = {
  id: string;
  author: string;
  content: string;
  time: string;
  self?: boolean;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatInlineMarkdown = (value: string) =>
  value
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

const renderMarkdown = (value: string) => {
  const escaped = escapeHtml(value.trim());
  const lines = escaped.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inOrderedList = false;
  let inUnorderedList = false;

  const closeLists = () => {
    if (inOrderedList) {
      htmlParts.push('</ol>');
      inOrderedList = false;
    }
    if (inUnorderedList) {
      htmlParts.push('</ul>');
      inUnorderedList = false;
    }
  };

  lines.forEach((line) => {
    if (!line.trim()) {
      closeLists();
      return;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      if (!inOrderedList) {
        closeLists();
        htmlParts.push('<ol>');
        inOrderedList = true;
      }
      const item = line.replace(/^\s*\d+\.\s+/, '');
      htmlParts.push(`<li>${formatInlineMarkdown(item)}</li>`);
      return;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      if (!inUnorderedList) {
        closeLists();
        htmlParts.push('<ul>');
        inUnorderedList = true;
      }
      const item = line.replace(/^\s*[-*]\s+/, '');
      htmlParts.push(`<li>${formatInlineMarkdown(item)}</li>`);
      return;
    }

    closeLists();
    htmlParts.push(`<p>${formatInlineMarkdown(line)}</p>`);
  });

  closeLists();
  return htmlParts.join('');
};

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
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const audience = roleParam === 'job-poster' ? 'job-poster' : 'job-seeker';
  const chatEndpoint = audience === 'job-poster'
    ? '/api/chat/job-poster'
    : '/api/chat/job-seeker';
  const audienceLabel = audience === 'job-poster'
    ? t('audience.jobPoster')
    : t('audience.jobSeeker');
  const baseThreads = useMemo(() => buildThreads(t), [t]);
  const activeRoomId = 'care';
  const activeRoom = {
    name: t('rooms.care.name'),
    topic: t('rooms.care.topic')
  };
  const [threads, setThreads] = useState(baseThreads);
  const [composer, setComposer] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setThreads(baseThreads);
  }, [baseThreads]);

  const activeMessages = threads[activeRoomId] ?? [];

  const quickReplies = [
    t('quickReplies.checkin'),
    t('quickReplies.summary'),
    t('quickReplies.schedule')
  ];

  const handleSend = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isSending) {
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

    setIsSending(true);
    try {
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: trimmed})
      });
      let payload: {reply?: string; error?: string} | null = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      if (!response.ok) {
        throw new Error(payload?.error || t('errors.requestFailed'));
      }
      const replyText = payload?.reply && payload.reply.trim()
        ? payload.reply.trim()
        : t('errors.emptyReply');
      const reply: Message = {
        id: `assistant-${Date.now()}`,
        author: t('people.assistant'),
        content: replyText,
        time: t('time.now')
      };
      setThreads((prev) => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] ?? []), reply]
      }));
    } catch (error) {
      const reply: Message = {
        id: `assistant-${Date.now()}`,
        author: t('people.assistant'),
        content: error instanceof Error && error.message
          ? error.message
          : t('errors.requestFailed'),
        time: t('time.now')
      };
      setThreads((prev) => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] ?? []), reply]
      }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Box className="chat-layout">
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
                <Chip label={audienceLabel} size="small" variant="outlined" />
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
            <Box key={message.id} className={`chat-message ${message.self ? 'self' : ''}`}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle2">{message.author}</Typography>
                <Typography
                  variant="body2"
                  component="div"
                  className="chat-message-content"
                  dangerouslySetInnerHTML={{__html: renderMarkdown(message.content)}}
                />
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
                  onClick={() => void handleSend(reply)}
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
                disabled={isSending}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend(composer);
                  }
                }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={() => void handleSend(composer)}
                disabled={isSending || composer.trim().length === 0}
                sx={{alignSelf: {xs: 'stretch', sm: 'flex-end'}}}
              >
                {t('sendLabel')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
