const crypto = require('crypto');

async function submitApplication() {
  const secret = 'hello-there-from-b12';
  const url = 'https://b12.io/apply/submission';

  
  const data = {

    timestamp: new Date().toISOString(),
    name: "Diego Robayo",
    email: "diegoleoro@gmail.com",
    resume_link: "https://docs.google.com/document/d/11ZRtj6ta3irpLgFI5UkBxhoSIJe4jcWuB2TCOqFK-bE/edit?usp=sharing",
    repository_link: "https://github.com/diegoleonardoro/b12.git",
    action_run_link: process.env.RUN_URL 
  };

 
  const sortedKeys = Object.keys(data).sort();
  const sortedData = {};
  sortedKeys.forEach(key => sortedData[key] = data[key]);
  
  const payloadString = JSON.stringify(sortedData);


  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payloadString, 'utf-8');
  const signature = hmac.digest('hex');


  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature-256': `sha256=${signature}`
      },
      body: payloadString
    });

    const result = await response.json();

    if (response.ok) {
 
      console.log(result.receipt);
    } else {
      console.error(`Error ${response.status}:`, result);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

submitApplication();