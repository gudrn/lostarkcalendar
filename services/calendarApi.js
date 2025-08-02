// services/calendarApi.js
import { apiGet } from '../util/apiUtils.js';

export const fetchLandApi = async () => {
  return await apiGet('/gamecontents/calendar');
};

export const fetchNoticesApi = async () => {
  return await apiGet('/news/notices');
};
