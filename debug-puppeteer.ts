import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log('Attempting to launch browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        console.log('Browser launched successfully!');
        console.log('Executable path: ', puppeteer.executablePath());
        await browser.close();
        console.log('Browser closed.');
    } catch (err) {
        console.error('FAILED to launch browser:');
        console.error(err);
    }
})();
