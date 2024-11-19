import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, title, body } = req.body;

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=YOUR_SERVER_KEY`, // ใช้ server key ที่ได้จาก Firebase Console
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: title,
          body: body,
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ message: 'Notification sent successfully', data });
    } else {
      res.status(500).json({ error: 'Failed to send notification', data });
    }
  } catch (error) {
    console.error('Error sending FCM notification:', error);
    res.status(500).json({ error: 'Error sending notification' });
  }
}
