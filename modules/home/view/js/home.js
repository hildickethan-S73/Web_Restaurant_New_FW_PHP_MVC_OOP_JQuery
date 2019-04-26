$(document).ready(function () {
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

    function paintPage(data){
        var template = "";
        var i = 1;
        var r;
        $.each(data, function(index, restaurant){
            r = document.createElement("div");
            r.classList.add("col-md-4","feature");

            template = 
                `<img src="view/img/restaurant${i}.jpg" alt="#">
                <h4>${restaurant.name}</h4>`;

            if (i >= 3)
                i = 1;
            else 
                i++;

            r.innerHTML = template;
            r.childNodes[0].addEventListener("click", function(){
                addDetails(restaurant);
            });
            $('#homerestaurants').append(r);
        });
    }
    
    function removePage(){
        $('#homerestaurants').html('');
    }

    function getPage(start){
        $.ajax({
            url: `api/restaurants/limit-${start},3/orderby-id`,
            type: 'GET',
            success: function(data){
                data = JSON.parse(data);
                paintPage(data);
            }
        });
    }

    $.ajax({
        url: 'api/restaurants/count-1/orderby-id',
        type: 'GET',
        success: function(data){
            data = JSON.parse(data);
            var total_pages = Math.ceil(data[0].rowcount/3);
            getPage(0);

            $("#pagination").bootpag({
                total: total_pages,
                page: 1,
                maxVisible: 3,
                next: 'next',
                prev: 'prev'
            }).on("page", function (event, page) {
                var start = (page-1)*3;
                removePage();
                getPage(start);
            });
        }
    });
    
});
