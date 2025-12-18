const { test, describe, expect, beforeEach } = require('@playwright/test')


describe('Blog app', () => {
	beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173')
	})

	test('front page can be opened', async ({ page }) => {

		const locator = page.getByText('Blogs')
		await expect(locator).toBeVisible()
	})

	test('user can log in', async ({ page }) => {

		await page.getByTestId('username').fill('kola')
		await page.getByTestId('password').fill('Jumpman99')

		await page.getByRole('button', { name: 'login' }).click()
		await expect(page.getByText('kola logged in')).toBeVisible()
	})

})
