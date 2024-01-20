const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser'); // Import body-parser module

const openai = require('openai');

const app = express();

app.use(express.static('staticFiles'));

app.use(bodyParser.json());

app.set('view engine', 'ejs');

openai.apiKey = process.env.OPENAI_API_KEY;

const { OpenAI } = require('openai');

client = new OpenAI()


app.post('/submit', async (req, res) => {
  const formData = req.body;

  console.log('Received Form Data:', formData);
  const dynamicPrompt = generateDynamicPrompt(formData);
  console.log(dynamicPrompt);
  const response = await client.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt: dynamicPrompt,
    max_tokens: 1000,
  });

  const parsableJSONResponse = response.choices[0].text;

  try {
    jsonObject = JSON.parse(parsableJSONResponse);
    console.log('Parsed JSON:', jsonObject);
  } catch (error) {
    console.error('JSON Parsing Error:', error);
    jsonObject = {};
  }

  console.log('Generated Poems:', jsonObject);

  res.json({
    success: true,
    message: 'Blessing submitted successfully!',
    poems: jsonObject,
  });
});

function generateDynamicPrompt(formData) {
  let prompt = `write me 3 ${formData.atmosphere} ${formData.blessingType}s for ${formData.name}'s ${formData.event}.`;

  if (formData.event === 'wedding') {
    prompt += ` Spouse's name is ${formData.spouseName} in the hall ${formData.hall}.`;
  } else if (formData.event === 'birthday') {
    prompt += ` He will be ${formData.age}-years-old in the ${formData.season}.`;
  }

  prompt += `Return the response in a parsable JSON format exactly like follows: { "option 1":"...", "option 2":"...", "option 3":"..." }.`;
  console.log(prompt);
  return prompt;
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = {
  generateDynamicPrompt,
};