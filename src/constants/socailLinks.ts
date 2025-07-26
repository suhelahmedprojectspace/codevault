import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaDiscord,
} from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';

export const SOCIAL_MEDIA_PLATFORMS = [
  {
    id: 'github',
    label: 'GitHub',
    icon: FaGithub, // Just reference the component, don't create JSX here
    baseUrl: 'https://github.com/',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: FaLinkedin,
    baseUrl: 'https://linkedin.com/in/',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: FaYoutube,
    baseUrl: 'https://youtube.com/',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: FaTwitter,
    baseUrl: 'https://x.com/',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FaFacebook,
    baseUrl: 'https://facebook.com/',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: FaInstagram,
    baseUrl: 'https://instagram.com/',
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: FaThreads,
    baseUrl: 'https://threads.net/',
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: FaDiscord,
    baseUrl: 'https://discord.com/users/',
  },
] as const;

export type SocialMediaPlatform = (typeof SOCIAL_MEDIA_PLATFORMS)[number]['id'];
