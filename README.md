# wikipedia-client-prototypes

Prototypes for testing a better Wikipedia experience.


## Dependencies

- NodeJS and NPM
- React, as the view library
- NextJS, to render the React app to HTML on the server-side
- Express, to handle requests and pass them on to NextJS on the server-side


## Running in Development

1. Make sure NPM and NodeJS are installed on your system.

2. Clone the project repository and `cd` into it.

    $ git clone <repository-url>
    $ cd path/to/code

3. Install dependencies from NPM.

    $ npm i

4. Run the server in development mode.

    $ npm run dev


## Running in Production

1. Make sure NPM and NodeJS are installed on your system.

2. Once NPM is installed, install `pm2` globally (may require sudo).

    $ npm i -g pm2

3. Clone the project repository and `cd` into it.

    $ git clone <repository-url>
    $ cd path/to/code

4. Install dependencies from NPM.

    $ npm i

5. Build an optimized version of the code.

    $ npm run build

6. Start the app using `pm2`.

    $ pm2 start npm --name "wikipedia-client-prototypes" -- start

## Resources

- Bug tracking and project status: https://www.pivotaltracker.com/n/projects/2319822
- Design: https://www.figma.com/file/fKoEklJl32G7gNN1l4m7O8a3/00-Sprint?node-id=0%3A1
