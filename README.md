# YeetBot 2.0
A discord bot, based on the ideas from [YeetBot](https://github.com/alexding123/YeetBot), but written in JavaScript. 

## Installation
Run the following
```bash
git clone https://github.com/christopherm99/YeetBot2.0.git YeetBot
cd YeetBot
npm i
```

## Configuration
Create config.js in the repository folder
```js
let prefix = "+";
let token = "YOUR_BOT_TOKEN"

export { prefix, token };
```

## Running
### ESNext via Babel-Node
This method substitutes `node` with `babel-node` as this project uses ESNext syntax.
```bash
npm start 
```
### Building for Node
This method utilizes @babel/preset-env alongside browserslist to compile to a current node version. It will build to the dist/ folder.
```bash
npm run build
```
### Development Mode
This method uses Babel-Node and Nodemon to constantly refresh the server upon changes to local files.
```bash
npm run dev
```
