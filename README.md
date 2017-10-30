This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# How to build
In the project directory, you can run:

`npm install`
Installs all dependencies needed to `start` and `build`.

`npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

`npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
The app is ready to be deployed!

#What is this?
A full screen "spreadsheet" of enery drink purchases.  At the upper left are selector drop-downs to allow filtering of the data.  At the right is a vertical slider to select which page (if multiple) to view.  Clicking on the thumb ("large sliding dot") gives it focus so you can press the up/down arrow keys to move up/down in the page list. At the bottom are dollar and item totals of the displayed page's data.

#Is that a scrollbar?
Rather than reinvent the wheel with `<div>`s, I used and rotated `<input type='range' ... />` as a quick and dirty scrollbar.  If I had more time, I would style it to look like a more traditional scrollbar.

#Known Bugs:
* On Firefox, the number of cells is too great for the viewport, pushing the footer offscreen.

#To Do's
- Make state in App.js true state; pull out constants and make them part of the App class
- Up/down buttons with press-and-hold functionality to move the slider's thumb
- Mouse wheel event listening for slider updates
- Fix issue:  when there is only one page of results (e.g. Costco x 5 Hour Energy), the thumb appears at the 'bottom' of the scrollbar (this seems to be a browser issue though)
- Loading screen so the "scrollbar" isn't in the middle of the screen for a few seconds while the .csv loads
- Resize functionality (e.g. increase/decrease the number of cells per page with window height)
- Unit tests
- Prettier styling
