const username = 'user' + ':' + Math.random();
const browser_name = getBrowserName();
let polling = null;

/**
 * @typedef {Object} Token
 * @property {string} username - The username of the user.
 * @property {string} browser - The name of the browser.
 */
const token = {
  username: username,
  browser: browser_name,
}

async function getToken() {
  try {
    const response = await fetch('/token');
    if (!response.ok) throw new Error('Could not get Token');
    let server_token = await response.json();
    return server_token;
  } catch (error) {
      console.error('Error getting Token:', error);
      throw error;
  }
}

async function putToken(token) {
  try {
    const response = await fetch('/token', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token)
    });
    if (!response.ok) throw new Error('Could not update Token');
    return await response.text();
  } catch (error) {
    console.error('Error updating Token:', error);
    throw error;
  }
}
  
function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
}

async function compareTokens() {
  try {
    let server_token = await getToken();
    if (server_token !== token) {
      ping_button.disabled = false;
      clearInterval(polling);
    }
  } catch (error) {
      console.error('Error retrieving Token:', error);
  }
}