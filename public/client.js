const username = 'user' + ':' + Math.random();
const browser_name = getBrowserName();
const ping_button = document.getElementById('pingButton');

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

/**
 * @typedef {Object} Token
 * @property {string} username - The init phrase.
 * @property {string} browser - The init phrase
 */
const init_token = {
  username: 'init',
  browser: 'init',
}

async function getToken() {
  try {
    const response = await fetch('/token');
    if (!response.ok) throw new Error('Could not get Token');
    const server_token = await response.json();
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
      body: JSON.stringify(token),
      keepalive: true,
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

async function ping(){
  ping_button.disabled = true;

  try{
    await putToken(token);
    console.log('Ping sent. Waiting for opponent...');
  } catch (error){
    console.error('Error during ping:', error);
  }

  polling = setInterval(compareTokens, 1000);
}

async function compareTokens() {
  try {
    const server_token = await getToken();
    if (server_token.username !== token.username ||server_token.browser !== token.browser) {

      if (server_token.username === init_token.username || server_token.browser === init_token.browser) {
        return;
      }

      ping_button.disabled = false;
      clearInterval(polling);
      console.log('Opponent responded. Your turn!');
    }
  } catch (error) {
      console.error('Error retrieving Token:', error);
  }
}

async function init() {
  try {
    const server_token = await getToken();
    if (!server_token || Object.keys(server_token).length === 0) {
      await putToken(init_token);
      ping_button.disabled = false;
      alert('Your internet is faster, you ping first!');
    } else {
      polling = setInterval(compareTokens, 1000);
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

window.onload = () => {
  ping_button.addEventListener('click', ping);
  console.log('Client ready:', token);
  init();
}

window.addEventListener('beforeunload', () => {
  putToken({});
});
