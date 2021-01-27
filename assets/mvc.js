(function (w, d) {

    var _main = w["parameter"]["main"];
    var _defaultRoute = null;

    // mvc framework
    function mvc() {
        this._route = {};
    }

    // add a new route to the mvc
    mvc.prototype.addRoute = function (m, r, t) {
        this._route[r] = new createRoute(model = m, route = r, template = t);

        //register the nav link here
        let li_dom = d.createElement('li');
        li_dom.classList.add('nav-item');
        let a_dom = d.createElement('a');
        a_dom.setAttribute('href','#'+route);
        a_dom.classList.add('nav-link');
        // linkName = route.replace('/','');
        // a_dom.innerText = linkName.charAt(0).toUpperCase() + linkName.slice(1);
        a_dom.innerText = r
        li_dom.appendChild(a_dom);
        $id(w["parameter"]["menuid"]).appendChild(li_dom);
    };

    // update view function
    mvc.prototype.initialize = function(){
        // create the update view function delegate ( according to the different view)
        var delegateUpdateView = updateView.bind(this);
        // create a default route
        if(Object.keys(this._route).length > 0){
            _defaultRoute = this._route[Object.keys(this._route)[0]];      // first added route will be considered as the default route

        }
        // wire up the hash change event with the update view function
        w.onhashchange = function () {
            delegateUpdateView()
        };
        // call the update view delegate
        delegateUpdateView()
    };


    
    function updateView() {
        //get the route name from the address bar hash
        var routeName = w.location.hash.replace("#",'');
        var route = null;
        // route name is not found then use default route
        if(!this._route.hasOwnProperty(routeName)){
            route =  _defaultRoute;
        }else{
            // fetch the route object using the route name
            route = this._route[routeName];
        }
        // render the view html associated with the route
        renderView(route_instance = route, view = _main)
    }
    
    function renderView(route_instance,view) {
        // call the corresponding controller function according to the route
        var model  = route_instance.model();
        if(typeof model !== "object") model = {};
        //replace the tokens with the model properties
        // render the view
        $ajax(
            {
                url: route_instance.template,
                method:'GET',
                success:function (rq) {
                    if (route_instance.template.match(/\.md$/))
                        view.innerHTML = markdownToHtml(rq.responseText);
                    else
                        view.innerHTML = rq.responseText;

                    if (model.hasOwnProperty('callback'))
                        model.callback();
                },
                loading:function (rq) {
                        view.innerHTML = "Loading ...";
                }
            }
        )

    }

    // create a route
    function createRoute(model, route, template) {
        this.model = model;
        this.route = route;
        this.template = template;
    }

    w['mvc'] = mvc;

})(window, document);