1. Please describe the process you have gone through before writing the automated test
suite

First think I do is write down roughly what my steps should look like. So the first thing I created were the feature files. Following that I created the js file the contains my steps, and finally the pages that run the actual tests. 
This gives me a clear direction as to how the tests should be behaving and a rough picture of what my scripts should look like. 

2. If you were unable to automate a test because you could not find a selector for an
element, what would you do?

Either create the selector from scratch, like I did on several occasions for the zoopla page, or find a workaround like I did for the rightmove page. It depends on what the goal of the test is and I wanted to somewhat showcase that. 
If the goal is end2end testing where I should go through the whole motion then obviously I have to create the selector. If the goal of the test is to verify that the we get search results then a workaround it is. 

3. Please add in asserts at each stage that you feel would provide good test coverage (We
might ask you to justify your coverage in the interview call).

Unfortunately here I fell short. Due to time constraints I didn't have the time to add assertations throughout my code. Regardless I'm looking forward to discussing this further during the interview call.


To run the feature files open a terminal and execute 
npm install --save-dev puppeteer
npx codeceptjs run ./features/Lettings.feature --reporter mocha-multi
npx codeceptjs run ./features/Sales.feature --reporter mocha-multi