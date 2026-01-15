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
  isTyping?: boolean;
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
  const activeRoom = {
    name: t('rooms.care.name'),
    topic: t('rooms.care.topic')
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [composer, setComposer] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  const activeMessages = useMemo(() => {
    if (!isAssistantTyping) {
      return messages;
    }
    return [
      ...messages,
      {
        id: 'assistant-typing',
        author: t('people.assistant'),
        content: '',
        time: t('status.typing'),
        isTyping: true
      }
    ];
  }, [isAssistantTyping, messages, t]);

  useEffect(() => {
    let cancelled = false;
    const introPrompt =
      'Introduce yourself as the Helpclub AI agent and explain how you can help in this chat.';

    const wait = (ms: number) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

    const fetchIntro = async () => {
      setIsAssistantTyping(true);
      while (!cancelled) {
        try {
          const response = await fetch(chatEndpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: introPrompt})
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
          if (!cancelled) {
            setMessages((prev) => [
              ...prev,
              {
                id: `assistant-${Date.now()}`,
                author: t('people.assistant'),
                content: replyText,
                time: t('time.now')
              }
            ]);
          }
          break;
        } catch {
          await wait(2000);
        }
      }
      if (!cancelled) {
        setIsAssistantTyping(false);
      }
    };

    void fetchIntro();

    return () => {
      cancelled = true;
    };
  }, [chatEndpoint, t]);

  const handleSend = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isSending || isAssistantTyping) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: t('people.you'),
      content: trimmed,
      time: t('time.now'),
      self: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setComposer('');

    setIsSending(true);
    setIsAssistantTyping(true);
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
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      const reply: Message = {
        id: `assistant-${Date.now()}`,
        author: t('people.assistant'),
        content: error instanceof Error && error.message
          ? error.message
          : t('errors.requestFailed'),
        time: t('time.now')
      };
      setMessages((prev) => [...prev, reply]);
    } finally {
      setIsSending(false);
      setIsAssistantTyping(false);
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
            <Box
              key={message.id}
              className={`chat-message ${message.self ? 'self' : ''} ${message.isTyping ? 'typing' : ''}`}
            >
              <Stack spacing={0.5}>
                <Typography variant="subtitle2">{message.author}</Typography>
                {message.isTyping ? (
                  <Box className="typing-indicator" aria-label={message.time}>
                    <span />
                    <span />
                    <span />
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    component="div"
                    className="chat-message-content"
                    dangerouslySetInnerHTML={{__html: renderMarkdown(message.content)}}
                  />
                )}
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
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                value={composer}
                placeholder={t('composerPlaceholder')}
                onChange={(event) => setComposer(event.target.value)}
                disabled={isSending || isAssistantTyping}
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
                disabled={isSending || isAssistantTyping || composer.trim().length === 0}
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
