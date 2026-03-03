import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request =>
        console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText)
    );

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

    console.log('Page loaded, clicking chat button...');
    // Click the chat button to open it (AIChatButton is at bottom-6 right-6)
    await page.evaluate(() => {
        const chatBtn = document.querySelector('button.fixed.bottom-6');
        if (chatBtn) chatBtn.click();
    });

    await new Promise(r => setTimeout(r, 1000));

    // Type message and submit
    console.log('Typing message...');
    await page.evaluate(() => {
        const input = document.querySelector('input[type="text"]');
        const form = document.querySelector('form');
        if (input && form) {
            // Simulate input event
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, 'Hello, who are you?');
            const ev2 = new Event('input', { bubbles: true });
            input.dispatchEvent(ev2);

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
        }
    });

    console.log('Waiting for response...');
    await new Promise(r => setTimeout(r, 4000));

    await browser.close();
})();
