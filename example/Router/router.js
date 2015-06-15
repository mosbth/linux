/**
 * Router
 */

/* Example usage..

    var http = require('http');
    var router = new Router();

    // Write a simple route..
    router.get('/', function(req, res) {
        res.end('hello');
    });

    http.createServer(function (req, res) {
        router.route(req, res);
    }).listen(1337);
*/


var url = require('url');


class Router {

    constructor() {
        this.routes = [];
        this.methods = {
            'GET': 'get',
            'POST': 'post',
            'PUT': 'put',
            'DELETE': 'delete'
        };

        this.validRegex = {
            ':id': /[0-9]/,
            ':name': /[a-zA-Z]+/,
        };
    }

    add(method, path, handler) {
        // Push to the routes array.
        this.routes.push({
            method: method,
            path: path,
            handler: handler
        });
    }

    /**
     * Shorthand GET route
     */
    get(path, handler) {
        this.add('GET', path, handler);
    }

    /**
     * Shorthand POST route
     */
    post(path, handler) {
        this.add('POST', path, handler);
    }

    /**
     * Route
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    route(req, res) {



        // Get the path and the method.
        var path = url.parse(req.url).pathname;
        var method = req.method;


        var urlParams = path.split('/');
        //req.params = urlParams;

        // Filter out the routes to process..
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        var routesToProcess = this.routes.filter(function (r) {

            // Get params.
            var currentParams = r.path.split('/');

            currentParams = currentParams.filter(function (p) {
                return p.includes(':');
            });
            /*
                /animal/:name
                /animal/dog

                /animal/:name/:id
                /animal/dog/1
             */


            if (currentParams.length > 0) {
                console.log('-------------------------');
                console.log('Urlen är special, R', r);
                console.log('Current params: ', currentParams);
                var begin = r.path.indexOf(currentParams[0]);
                console.log('BEGIN', begin);
                console.log('PATH: ', path);
                console.log('-------------------------');

                /*var found = [];
                for (var i = 0; i < urlParams.length; i ++) {

                    if (urlParams[i].search(/[a-zA-Z]+/)) {

                    }
                }*/

                if (r.path.substr(begin, r.path.length).search(/[a-zA-Z]+/)) {
                    req.params = { id: urlParams[2] };
                    return true;
                }

                return false;
                //return method === r.method &&
             }

            // Without regex.
            return method === r.method && path === r.path;
        });

        //console.log('Routes to process: ', routesToProcess);

        //console.log(req);


        // If we have no routes, write 404.
        if (!routesToProcess || routesToProcess.length === 0) {
            console.log(404);
            res.writeHead(404);
            res.end('404 Not Found');
            return;
        }
        console.log('--------------');
        console.log('Routes to process: ', routesToProcess);
        console.log('--------------');


        // Handle the request.
        routesToProcess.forEach(function (route, i) {
            // Calling the function.
            route.handler(req, res);
        });
    }

    nrOfRoutes() {
        return this.routes.length;
    }

    params() {
        return { name: 'dog' };
    }
}

export default Router;
