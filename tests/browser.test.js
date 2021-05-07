const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

const fileUnderTest = 'file://' + __dirname.replace(/ /g, '%20') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5; // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
	let stack = await driver.findElement(By.id('top_of_stack')).getText();
	expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
	it('should open a prompt box', async () => {
		let push = await driver.findElement(By.id('push'));
		await push.click();
		let alert = await driver.switchTo().alert();
		await alert.sendKeys("Bananer");
		await alert.accept();
	});

});

describe ('Clicking "Poppa Stacken!"', () => {
	it ('should open alert box', async () => {
		let pop = await driver.findElement(By.id('pop'));
		await pop.click();
		let alert = await driver.switchTo().alert();
		await alert.accept();

	})
});

describe ('Clicking "Vad finns överst på stacken?"', () => {
	it ('should update the span text', async () => {
		// Hämtar alla tre knappar från sidan.
		let push = driver.findElement(By.id('push'));
		let pop = driver.findElement(By.id('pop'));
		let peek = driver.findElement(By.id('peek'));

		// Pushar 2 element till stacken.
		push.click();
		let alert = driver.switchTo().alert();
		alert.sendKeys("1");
		alert.accept();

		push.click();
		alert = driver.switchTo().alert();
		alert.sendKeys("2");
		alert.accept();

		// Kontrollerar span text innan pop.
		let beforePop = driver.findElement(By.id('top_of_stack')).getText();
		expect(beforePop).toBe("2");
		pop.click();

		// Kontrollerar span text efter pop.
		let afterPop = driver.findElement(By.id('top_of_stack')).getText();
		expect(afterPop).toBe("2");

		peek.click();

		// Kontrollerar att span text ändras. 
		let stack = driver.findElement(By.id('top_of_stack')).getText();
		expect(stack).toBe("1");
	})
});