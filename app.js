const express = require('express');
require('dotenv').config();
const openai = require('openai');

const app = express();
app.set('view engine', 'ejs');

// Set your OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

const { OpenAI } = require('openai');

client = new OpenAI()



// Define a route handler
app.get('/', async (req, res) => {
  //res.render('index');

  const response = await client.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt: 'write me a very short poam with 2 verse , to my birthday',
    max_tokens: 1000,
  });
  console.log("this response:", response);
  const parsableJSONResponse = response.choices[0].text;

  // try {
  //   parsedResponse = JSON.parse(response);
  // }
  // catch (error) {
  //   console.error( error)
  // }

  console.log("response!!! ", parsableJSONResponse);

  //return { parsableJSONResponse }

  // Extract and send the relevant data to the client
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
