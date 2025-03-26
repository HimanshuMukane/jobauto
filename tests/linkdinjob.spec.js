// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto("https://in.linkedin.com/");
    await page.click("a[href='https://www.linkedin.com/login']");
    await page.fill("#username", "eashunagarkar15@gmail.com");
    await page.fill("#password", "Eashwari@15");
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    await page.click("a[href*='https://www.linkedin.com/jobs/?']");
    await page.waitForTimeout(5000);
    const fields = [
        {
            selector: 'input[aria-label="Search by title, skill, or company"]:not([disabled])',
            value: 'Software Engineer'
        },
        {
            selector: 'input[aria-label="City, state, or zip code"]:not([disabled])',
            value: 'Mumbai, Maharashtra, India'
        },
    ];

    for (const field of fields) {
        const input = page.locator(field.selector);
        await input.fill(field.value);
        await page.keyboard.press('Enter');
        let hasNextPage = true;
        let pageCount = 1;
        while (hasNextPage) {
            console.log(`Processing job cards on page ${pageCount}`);

            // Wait for job list items to be available on the page
            await page.waitForSelector('div.scaffold-layout__list ul li.scaffold-layout__list-item');

            // Get all job card <li> elements
            const jobCards = await page.$$('div.scaffold-layout__list ul li.scaffold-layout__list-item');

            for (const jobCard of jobCards) {
                // Get the job link element inside the job card
                const jobLink = await jobCard.$('a.job-card-job-posting-card-wrapper__card-link');
                if (jobLink) {
                    // Optionally, log the URL or attribute for debugging
                    const jobUrl = await jobLink.getAttribute('href');
                    console.log(`Navigating to job detail: ${jobUrl}`);

                    // Click the job link and wait for navigation or content load
                    await Promise.all([
                        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                        jobLink.click()
                    ]);

                    // Optionally, wait a bit for the job details to load
                    await page.waitForTimeout(2000);

                    // Check for the presence of the "Easy Apply" button (ignore normal "Apply")
                    const easyApplyButton = await page.$('button:has-text("Easy Apply")');
                    if (easyApplyButton) {
                        console.log('Found Easy Apply button. Clicking it.');
                        await easyApplyButton.click();
                        // Wait for modal or subsequent steps to load as necessary
                        await page.waitForTimeout(2000);
                        // Add additional steps here to complete or close the application modal if needed
                    } else {
                        console.log('No Easy Apply found; skipping this job.');
                    }

                    // Go back to the job list page
                    await Promise.all([
                        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                        page.goBack()
                    ]);

                    // Wait for the job list container to load again
                    await page.waitForSelector('div.scaffold-layout__list ul li.scaffold-layout__list-item');
                }
            }

            // Pagination: Check if a next page is available using the pagination container
            const activePage = await page.$('ul.artdeco-pagination__pages li.artdeco-pagination__indicator--number.active');
            if (activePage) {
                // Get current page number (as a string)
                const activePageText = await activePage.innerText();
                const currentPage = parseInt(activePageText);
                // Look for the next page button based on the current active page
                const nextPageSelector = `ul.artdeco-pagination__pages li.artdeco-pagination__indicator--number:nth-child(${currentPage + 1}) button`;
                const nextPageButton = await page.$(nextPageSelector);

                if (nextPageButton) {
                    console.log(`Going to page ${currentPage + 1}`);
                    await Promise.all([
                        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                        nextPageButton.click()
                    ]);
                    pageCount++;
                } else {
                    console.log('No next page found. Finished processing.');
                    hasNextPage = false;
                }
            } else {
                console.log('Active page indicator not found. Ending process.');
                hasNextPage = false;
            }
        }
    }
});
