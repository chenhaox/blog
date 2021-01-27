(function (w, d) {

    var _main = w["parameter"]["main"];
    var _header = w["parameter"]["header"];
    var _defaultRoute = null;
    var _blogpath = w["parameter"]["blogpath"];
    var _websitetitle = ""
    var _websitesubtitle = ""
    var _header_title = w["parameter"]["header_title"];
    var _header_subtitle = w["parameter"]["header_subtitle"];
    var _wrapper = $id("wrapper")
    const searchQueryURL = "https://api.github.com/repos/chenhaox/blog/issues"

    // mvc framework
    function mvc() {
        this._route = {};
    }

    // add a new route to the mvc
    mvc.prototype.addRoute = function (m, r, t) {
        this._route[r] = new createRoute(model = m, route = r, template = t);


        // //register the nav link here
        // let li_dom = d.createElement('li');
        // li_dom.classList.add('nav-item');
        // let a_dom = d.createElement('a');
        // a_dom.setAttribute('href','#'+route);
        // a_dom.classList.add('nav-link');
        // // linkName = route.replace('/','');
        // // a_dom.innerText = linkName.charAt(0).toUpperCase() + linkName.slice(1);
        // a_dom.innerText = r
        // li_dom.appendChild(a_dom);
        // $id(w["parameter"]["menuid"]).appendChild(li_dom);
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
        let pagenumber = 1
        var hashlist = w.location.hash.replace("#",'').split("?=");
        let routeName = hashlist[0]
        if (hashlist.length > 1){
            pagenumber = parseInt(hashlist[1])
            if (typeof pagenumber !== "number") pagenumber = 1
        }
        var route = null;
        // route name is not found then use default route
        if(!this._route.hasOwnProperty(routeName)){
            route =  _defaultRoute;
        }else{
            // fetch the route object using the route name
            route = this._route[routeName];
        }
        // render the view html associated with the route
        renderView(route_instance = route, view = _main, page = pagenumber)
    }

    function renderView(route_instance,view, page = 1) {
        _wrapper.style.opacity = 0;
        sleep(500).then(()=>{
            if (route_instance.route == "home"){
                view.innerHTML = "";
                if( _websitetitle){
                    _header_title.innerText = _websitetitle;
                    _header_subtitle.innerHTML = _websitesubtitle;
                }

                fetch(searchQueryURL).then(
                    res => res.json()

                ).then(res =>{
                    res.forEach( element=>{
                        if (element["user"]["id"] === 3233768) {
                            let url = element["url"].split("/")
                            let id = url[url.length - 1]
                            let title = element["title"]
                            let create_data = element["created_at"]
                            let labels = element["labels"]
                            let body = element["body"]
                            let input = {
                                "id": id,
                                "title": title,
                                "body": body,
                            }
                            divblock(input,view, true);

                        }})

                })
            }
            else{
                _websitetitle = _header_title.innerText
                _websitesubtitle = _header_subtitle.innerHTML
                view.innerHTML = "";
                _header_subtitle.innerHTML = "<a href='#home'> BACK TO HOMEPAGE </a>";
                fetch(searchQueryURL+"/"+page).then(
                    res => res.json()

                ).then(element=>{
                    if (element["user"]["id"] === 3233768){
                        let url = element["url"].split("/")
                        let id = url[url.length-1]
                        let title = element["title"]
                        let create_data = element["created_at"]
                        let labels = element["labels"]
                        let body = element["body"]
                        let input = {
                            "id": id,
                            "title" : title,
                            "body": body,
                        }
                        d.getElementById("header_title").innerText = title
                        divblock2(input,view)
                    }

                })

            }

        })
        // call the corresponding controller function according to the route

    }
    function divblock(input, view){
        //
        let section = d.createElement('section');
        section.classList.add('main');
        section.classList.add('special');
        let spotlight = d.createElement('div');
        spotlight.classList.add('spotlight');
        let content = d.createElement('div');
        content.classList.add("content");
        let header = d.createElement('header');
        header.classList.add("major");
        let title = d.createElement('h2');
        title.innerHTML =input["title"];
        let article_content = d.createElement('p');
        article_content.innerHTML = input["body"]
        let ul = d.createElement('ul');
        ul.classList.add("actions");
        ul.classList.add("special");
        let li = d.createElement('li');
        let a = d.createElement('a');
        a.classList.add("button");
        a.innerText = "Learn More";
        a.href ="#article?=" + input["id"];
        view.appendChild(section);
        section.appendChild(spotlight);
        // content
        spotlight.appendChild(content);
        //header
        content.appendChild(header);
        header.appendChild(title);
        //article content
        content.appendChild(article_content);
        //button
        content.appendChild(ul);
        ul.appendChild(li);
        li.appendChild(a);


            // setTimeout(()=>{
            //     view.style.opacity = 1;
            //     _header_title.style.opacity = 1;
            //     _header_subtitle.style.opacity = 1;
            // }, 1000);
        _wrapper.style.opacity = 1;
    }

    function divblock2(input, view){
        let main_section = d.createElement('section');
        main_section.classList.add('main');
        let content_section = d.createElement('section');

        content_section.innerHTML = markdownToHtml(input["body"])
        view.appendChild(main_section);
        main_section.appendChild(content_section);
        _wrapper.style.opacity = 1;
    }
    // create a route
    function createRoute(model, route, template) {
        this.model = model;
        this.route = route;
        this.template = template;
    }

    w['mvc'] = mvc;

})(window, document);