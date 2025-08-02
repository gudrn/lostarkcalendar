import dotenv from 'dotenv';
dotenv.config();

export const LOSTARK_API_BASE = 'https://developer-lostark.game.onstove.com';
export const getAuthHeader = () => ({
  Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
});
