$(document).ready(function(){

    ////////////////////////////////////////////////
    // Initial checks
    ////////////////////////////////////////////////

    try {
        var type = document.getElementById('searchtype').value;
    } catch (error) {
        // todo
    }

    if (getCurrentPage() == 'shop'){
        restaurantSearch();
    }

    if (getCurrentPage() == 'details'){
        loadRestaurant();
    }

    ////////////////////////////////////////////////
    // onclick
    ////////////////////////////////////////////////

    $('#searchtype').on('click', function(){
        type = document.getElementById('searchtype').value;
    });

    $('#searchbutton_shop').on('click', function(){
        restaurantSearch();
    });

    $('#searchname, #searchtastes').on('click', function(){
        removeChildren(document.getElementById('dropdown-name'));
        removeChildren(document.getElementById('dropdown-tastes'));
    });

    // $('#searchbutton_home').on('click', function(){
    //     var searchdata = getSearchdata();
        
    //     $.ajax({
    //         data: searchdata,
    //         url: 'api/shop/savesearch-true',
    //         type: 'POST',
    //         success: function(){
    //             window.location.href='shop';
    //         }
    //     });
    // });

        ////////////////////////////////////////////////
        // Keyup / Autocomplete
        ////////////////////////////////////////////////

    $('#searchname, #searchtastes').on('keyup', function(){
        
        var fielddata = {
            "name": this.value,
            "field": this.id.substring(6), //all ids are "searchX"
            "type": type,
        };

        //no suggestions if nothing is input
        var inputbox = document.getElementById("dropdown-"+this.id.substring(6));
        removeChildren(inputbox);

        if (fielddata.name != ""){
            var url = buildURL(fielddata,1);
            $.ajax({
                type: 'GET',
                url: url,
                success: function(data) {
                    data = JSON.parse(data);

                    //show the div
                    if (!inputbox.classList.contains("show")) {
                        inputbox.classList.toggle("show");
                    }

                    //fill out the div
                    $.each(data, function(index,restaurant){
                        addChild(restaurant,fielddata.field,inputbox);
                    });
                }
            });
        }
    });

    ////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////

    function getCurrentPage(){
        var query = window.location.pathname;
        var vars = query.split("/");
        return(vars[2]);
    }

    function paintPage(r,restaurant, api = false){
        var template = "";
        
        r = document.createElement("div");
        r.classList.add("col-md-4","feature");

        if (api){
            template = 
            `<img src='${restaurant.image_url}' alt='No image available'>
            <h4>${restaurant.name}</h4>`;
        } else {
            var imgs = [1,2,3];
            var i = imgs[Math.floor(Math.random()*imgs.length)];
            template = 
                `<img src="view/img/restaurant${i}.jpg" alt="#">
                <h4>${restaurant.name}</h4>
                <a type="button" class="site-btn sb-c3">+</a>`;
        }


        r.innerHTML = template;
        return r;
    }

    function addListeners(r,restaurant,api = false){
        r.childNodes[0].addEventListener("click", function(){
            addDetails(restaurant);
        });
        if (!api){
            r.childNodes[4].addEventListener('click', function(){
                addCart(restaurant);
            });
        }
        return r;
    }

    function addDetails(post){
        $.ajax({
            data: post,
            url: 'api/shop/savedetails-true',
            type: 'POST',
            success: function(){
                window.location.href ="details";
            }
        });
    }

    //todo
    function addCart(restaurant){
        console.log('cart');
    /*if (localStorage && localStorage.getItem('cart')) {
        var exists = false;
        // console.log(quantity);
        var cart = JSON.parse(localStorage.getItem('cart'));
        cart.restaurants.forEach(element => {
            if (element.id == restaurant.id){
                exists = true;
            }
            // break?
        }); 
    } else {
        var cart = {};
        cart.restaurants = [];
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    restaurant.quantity = 1; 

    if (exists){
        cart.restaurants.forEach(element => {
            if (element.id == restaurant.id){
                element.quantity++;
            }
            // break?
        }); 
    } else {
        cart['restaurants'].push(restaurant);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    $('#cart-number').html(cart.restaurants.length);*/
    }

    function buildURL(array,num){
        var url = 'api/restaurants/';
        switch (num) {
            case 0:
                $.each(array, function (field, value) {
                    if (value != "" && value != 'Type')
                        url += `${field}-${value}/`;
                });
                break;

            case 1:
                url += 'limit-6/';
                url += `${array['field']}-!${array['name']}!/`;
                if (array['type'] != "Type")
                    url += `type-${array['type']}/`;
                break;
        
            default:
                break;
        }
        return url;
    }

    function restaurantSearch(){
        
        var searchdata = getSearchdata();
        var url = buildURL(searchdata,0);

        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                data = JSON.parse(data);
                document.getElementById('restaurantsshop').innerHTML="";

                var r;
                $.each(data, function(index, restaurant){
                    r = paintPage(r,restaurant);
                    r = addListeners(r,restaurant);
                    
                    $('#restaurantsshop').append(r);
                });
            }
        });

        ////////////////////////////////////////////////
        // API
        ////////////////////////////////////////////////

        var api_promise = new Promise(function(resolve, reject) {
            var json = null;
            $.ajax({
                type: 'GET',
                url: "model/token.json",
                dataType: 'JSON',
                success: function (data) {
                    json = data;
                }
            });
            setTimeout(function() {
            resolve(json);
            }, 200);
        });
        
        api_promise.then(function(tokens) {
            // console.log(value);
            $.ajax({
                type: 'GET',
                url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=valenciancommunity&categories=restaurants&limit=10',
                headers: {
                    'Authorization':`Bearer ${tokens.keys.yelp_api}`,
                },
                dataType: 'JSON',
                success: function(data) {
                    $.each(data.businesses, function(index, restaurant){
                        var r;
                        r = paintPage(r,restaurant,true);
                        r = addListeners(r,restaurant,true);
                        
                        $('#restaurantsshop').append(r);
                    });
                },
                error: function(e) {
                    console.log('ERROR '+e.status);
                    console.log(e.responseText);
                }
            });
        });
    }

    function removeChildren(inputbox){
        //remove old
        while (inputbox.firstChild) {
            inputbox.removeChild(inputbox.firstChild);
        }
    }

    function addChild(restaurant,field,inputbox){
        var node = document.createElement("a");                  
        switch (field) {
            case 'name':
                node.appendChild(document.createTextNode(restaurant.name));    
            break;

            case 'tastes':
                node.appendChild(document.createTextNode(restaurant.tastes));    
            break;

            default:
                break;
        }  
        inputbox.appendChild(node);
        
        node.addEventListener("click", function(){
            document.getElementById('search'+field).value = node.text;
            removeChildren(inputbox);
        });
    }

    function fillDetails(data){
        $.each(data, function (field, value) {
            if (field == 'detailsimg')
                document.getElementById(field).setAttribute('src', value)
            else if (value.startsWith('<'))
                document.getElementById(field).innerHTML = value;
            else 
                document.getElementById(field).textContent = value;
        });
    }
    
    function loadRestaurant(){
        // get clicked restaurant
        $.ajax({
            url: 'api/shop/details-true',
            type: 'GET',
            success: function(data){
                data = JSON.parse(data);

                // bandaid fix for DB vs API restaurants, unstable
                var obj;
                if (data.id.length < 5) {
                    obj = {
                        'detailsname':data.name,
                        'details1':`Type: ${data.type}`,
                        'details2':`People: ${data.people}`,
                        'details3':`Date: ${data.selected_date}`,
                        'details4':`Tastes: ${data.tastes}`
                    }
                } else {
                    obj = {
                        'detailsimg':data.image_url,
                        'detailsname':data.name,
                        'details1':`Location: ${data.location.display_address.toString()}`,
                        'details2':`Phone: ${data.display_phone}`,
                        'details3':`Rating: ${data.rating}`,
                        'details4':`<a href=${data.url}>Restaurant on Yelp</a>`
                    }
                }
                fillDetails(obj);
            }
        });
    }

    function getSearchdata(){
        return {
            "type": type,
            "tastes": document.getElementById('searchtastes').value,
            "name": document.getElementById('searchname').value
        };
    }
});