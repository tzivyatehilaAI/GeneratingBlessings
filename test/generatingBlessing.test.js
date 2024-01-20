
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const { generateDynamicPrompt } = require('./app');

test('Form Submission', async () => {
    const formData = {
        event: 'wedding',
        name: 'John Doe',
        blessingType: 'short poem',
        atmosphere: 'Joyful',
        spouseName: 'Jane Doe',
        hall: 'Grand Hall',
    };

    const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const responseData = await response.json();

    expect(responseData).toMatchObject({
        success: true,
        message: 'Blessing submitted successfully!',
    });
    expect(responseData.poems).toBeDefined();
});

test('Dynamic Prompt Generation', () => {
    const formData = {
        event: 'wedding',
        name: 'John Doe',
        blessingType: 'short poem',
        atmosphere: 'Joyful',
        spouseName: 'Jane Doe',
        hall: 'Grand Hall',
    };

    const dynamicPrompt = generateDynamicPrompt(formData);

    expect(dynamicPrompt).toContain('write me 3');
});

test('UI Interaction', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://localhost:3000');
    await page.select('#event', 'wedding');
    await page.type('#name', 'John Doe');

    await page.click('button[onclick="submitForm()"]');

    await page.waitForSelector('#responseContainer');

    const blessingOption = await page.evaluate(() => {
        return document.querySelector('#responseContainer').textContent;
    });

    expect(blessingOption).toBeDefined();

    await browser.close();
});
