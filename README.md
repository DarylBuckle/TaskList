# Tasklist
A basic task management interface.

View a list of Tasks, create tasks and update tasks.

Web API in .Net Core 3.1. SQL Server Database, ReactJS Client

---

## Contents

* [Server](#server)
  * [SQL](#sql)
  * [Running Web Api](#running-web-api)
* [Client](#client)
  * [Configuration](#configuration)
  * [Running Client](#running-client)
* [Application Info](#application-info)
* [Code Structure](#code-structure)
  * [API Code](#api-code)
  * [Client Code](#client-code)
* [License](#license)

<br/>

## Server
Created in Visual Studio 2019 16.4.3 on Windows 10 VM.

Framework - .Net Core 3.1.1

Consists of;
- tasklist_api - the REST web api
- tasklist_api_tests - Unit tests for tasklist_api
- A postman collection of sample requests
  
Dependancies;
- EntityFramework
- EntityFramework Core
- Serlilog

#### SQL
This application requires a connection to SQL Server.
The included appsettings.development.json has a connection configured to localdb. This can be changed if needed.
Migrations have been included - run "dotnet ef database update" in command line to apply migrations.
Alternatively run InitialCreateScript.sql (this was generated from migrations).

#### Running Web Api
Open server\tasklist_api.sln in Visual Studio 2019.
Run tasklist_api.
Application will start on http://localhost:4000.
For production builds or if the clients url is changed from http://localhost:3000 the Cors policy will need to be altered in startup.cs.

---

## Client
Created in Visual Studio Code on macOS Catalina.

Requires Node.js (built with v12.14.0)

**Built and tested using Chrome (macOS) Chrome (windows), Safari and Edge. Does not currently work on IE11 due to missing polyfills.**

Consists of;
- tasklist_ui - a ReactJS client

Dependancies;
- create-react-app
- redux
- react router
- bootstrap + react-bootstrap
- fontawsome (free)
- moment
- node-sass
- react-select

#### Configuration
Run "npm-install" to install packages
By default it will use the web api hosted at http://localhost:4000. To change this open client\public\appconfig.js and edit the apiurl.


#### Running Client
Run npm script "npm start".
Application will start on http://localhost:3000.
The web api has to be running for this to work.



---

## Application Info

The schema features 1 table - Task and the web api has one controller for entity accessed at http://loclahost:4000/task.

The controller has 4 functions;
- GetList (GET /task) returns a list of all incomplete tasks ordered by DateCreated ascending. URI parameter include_completed=true allows this endpoint to return all tasks
- GetOne (GET /task/id) returns a single task by id
- Post (POST /task accepts a Task in the body in json format) is used to create and update records. If an id is specified it will update the record if it exists. If an id is not specified it will create a new record
- Delete (DELETE /task/id) deletes an existing task by id

The Task model;
- Id - auto increment primary key with clustered index
- Name - nvarchar(100) - the name of the task (text field). Required.
- Description - nvarchar(1000) - a description of the task (memo field). Required.
- StatusId - int - 0 = Not started. 1 = In progress, 2 = Complete. Defaults to 0.
- DateCreated - datetime2 - date the task was created. Cannot be modified. Has non clustered index.
- LastModified - datetime2 - the date the task was last created/modified. Cannot be edited.

The client;
- Uses api/task to return a list of all tasks when it renders
- Add button displays a modal screen where Name, Description and StatusId can be set
- Selecting a row allows editing of that task (same fields as new)
- Adding/Updating updates the row in the table
- The client implements reusable classes for listing data and displaying an input form


---

## Code Structure

#### API Code

- Common: Contains static functions and constants classes used throughout the application
- Controller: TaskController.cs - executes logic for each method
- Data: ApplicationDbContext properties
- Migrations: entity framework migration sripts. Done using code first approach.
- Models: Contains the Task model
- Startup.cs: Startup code and app configuration

#### Client Code

- Public - index.html and public resources
- index.js - Renders the app on an element in index.html. Creates fontawesome library, configures redux store, Renders App.js.
- index.scss - Contains all css outside of third party libraries
- App.js - Renders nav bar and router. Renders TaskList.js when at /tasks
- TaskList.js - A class containing logic regarding task properties (ie api endpoint, properties, table columns etc)
- MainScreen.js and List.js - generic classes for getting and displaying a list of data. When List.js renders it does a Get to the todo endpoint (apiActions.js), updates listdataReducer with the result which returns the data to List.js. List.js will then use the props parsed to it to determine what columns should be shown.
- TaskDetails.js - Defines how the add/edit task form should be rendered. Defines an array of objects which contain data on how the field controls should be rendered. FormBuilder actually renders them.
- FormBuilder.js - generic class for displaying a form. Takes an array of objects and renders controls. Handles posting to the api (via apiActions.js).
- CommonFunctions.js -  static functions used throughout the application


<br/>

## License

MIT Licensed. Copyright (c) Daryl Buckle 2020.