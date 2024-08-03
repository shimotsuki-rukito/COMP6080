## 1. Run the test

For the UI test, you need to run `npx cypress open`. In the open window, select E2E Testing. You will see two tests in the /specs.
The first test is register-logout.cy.js. You need to run this test in an empty backend and run this test first. Because it includes a register operation and cannot register two identical accounts. After this test is done, you can run the other test login-editslide.cy.js.

## 2. Test path

### 2.1. register-logout

This test contains a path as below:
1. Register an account as "test@test.com"
2. Creates a new presentation successfully
3. Updates the thumbnail and name of the presentation successfully
4. Add some slides in a slideshow deck successfully
5. Switch between slides successfully
6. Delete a presentation successfully
7. Logs out of the application successfully
8. Logs back into the application successfully

If the website successfully enter the /dashboard, that means account has been successfully created. Then it will find the `New Presentation` button and fill in the textareas. It will upload an image in the /fixtures folder as the thumbnail. If there is a `Test Presentation` in the dashboard, the creation success. Then it will enter the presentation and edit the presentation. This also needs to go back to the dashboard and check whether the edition has correctly taken effect. Then the test will again enter the presentation and click the `Create Slide` button. It will click the arrow and check wheather the url is changing between /presentation/0/0 and /presentation/0/1. Then the test will click the `Delete Presentation` button. If there is no presentation in the dashboard, the test success. The test will finally logout and login again to test if it can re-login.

### 2.2 login-editslide

This test need to run after register-logout. The path is more concerned on edit the slide.
1. Allows a user to log in
2. Creates a new presentation successfully
3. Add a textbox to a slide successfully
4. Edit a textbox successfully
5. Delete a textbox successfully
6. Delete a presentation successfully

The user logged in uses the information in the previous test (test@test.com). The test will also create a new presentation and add a textbox. It will fill in the inputs in the create textbox modal and then submit it. If it can find the text in the slide, then the adding test successes. Then it will double click the textbox, which will open the edit modal. It will change the text from "Test Textbox" to "Update Test Textbox". Then it will right click the textbox. If "Update Test Textbox" is no longer exist, the test successes. At last, the test will delete the presentation to ensure that repeated testing does not result in errors.

## 3. Component Test

There are 6 component tests: new presentation button, logout button, edit presentation modal, error modal, add textbox modal, and edit textbox modal.
To run the test, you need to enter the /frontend folder and run `npm test`.