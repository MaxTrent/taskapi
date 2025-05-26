import { calendar_v3, calendar } from '@googleapis/calendar';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

const oAuth2Client = new OAuth2Client(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI 
);

export const getAuthUrl = (): string => {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
  });
};

export const getAccessToken = async (code: string): Promise<any> => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  return tokens;
};

export const createCalendarEvent = async (accessToken: string, task: any): Promise<calendar_v3.Schema$Event> => {
  oAuth2Client.setCredentials({ access_token: accessToken });
  const googleCalendar = calendar({ version: 'v3', auth: oAuth2Client });

  const event: calendar_v3.Schema$Event = {
    summary: task.title,
    description: task.description || '',
    start: {
      dateTime: new Date().toISOString(), // No dueDate, use current time
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
      timeZone: 'UTC',
    },
  };

  const response = await googleCalendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return response.data;
};