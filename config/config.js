import dotenv from 'dotenv';
dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const LOSTARK_API_BASE = process.env.LOSTARK_API_BASE;
export const getAuthHeader = () => ({
  Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
});

export const channelId = {
  channelId1: process.env.CHANNEL_ID,
  channelId2: process.env.CHANNEL_ID2,
};

export const marketAuction = {
  RELIC_MAX_PAGES: parseInt(process.env.RELIC_MAX_PAGES, 10) || 4,
  RELIC_TOP_N: parseInt(process.env.RELIC_TOP_N, 10) || 50,
};
