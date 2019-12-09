# Introduction
*By Jonathan BOUTAKHOT, Quynh-Nhien PHAN, Océane SALMERON (ING4, GP03)*

#### Lab 3 - Storage

This is a nodejs lab for the Web Technology course at ECE Paris-Lyon, ING4.

## Installation

##### This app uses
- **Nodemon** for hot reload
- **Express**
- **EJS**
- **Typescript**
- **ts-node**
- **body-parser**
- **encoding-down**
- **level-ws**
- **leveldown**
- **levelup**
- **@types/express**
- **@types/node**
- **@types/levelup**

##### Install the dependencies

`npm install`

## Run the server
 
#### Run the app in dev mode (with nodemon)
 
`npm run dev`

The page will reload if you make edits.<br>

#### Run the app
 
`npm run start`

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## Build the app

To build the app and convert .ts files into .js files, run

`npm run build`

The .js files will be created in the */dist* folder.

#### Populate the database

To populate the database, run 

` tsc && ./node_modules/.bin/ts-node bin/populate.ts`