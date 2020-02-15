zomatoApi = "5a33e1ec7d6535e6ef16c81e3833e48a";
ticketmasterApi = "mGRhyVGMqSKLiGRVm4XLR9SJBSPsX0Eg";

zomatoURL = "https://developers.zomato.com/api/v2.1/cities?q=Orlando"

breweryURL = "https://api.openbrewerydb.org/breweries?by_city=san_diego"


$(document).ready(function () {
    

    var searchBtn = $("#search-button");


    searchBtn.on("click", function (event) {
        event.preventDefault();

        var citySearch = $("#city-search").val().trim();
        if (!citySearch) return;
        $("#city-search").val("");

        var breweryURL = "https://api.openbrewerydb.org/breweries?by_city=" + citySearch;
        var zomatoCityID = "https://developers.zomato.com/api/v2.1/cities?q=" + citySearch;

        //BREWERYAPI
        $.ajax({
            url: breweryURL,
            method: 'GET'
        })
            .then(function (res) {
                $(".brew-carousel").empty();

                for (var i = 0; i < res.length; i++) {
                    var carouselItem = $("<a>").addClass("carousel-item");
                    var newBrewDiv = $("<div>").addClass("card");

                    var brewNameP = $("<h5>").text(res[i].name);
                    var brewTypeP = $("<p>").text("Brewery Type: " + res[i].brewery_type);
                    var brewAddressP = $("<p>").text("Address: " + res[i].street + ", " + res[0].city);
                    var brewPhoneP = $("<p>").text("Phone: " + res[i].phone);
                    var brewWebP = $("<a>").attr("href", res[i].website_url).attr("target", "_blank").text("Visit Website");

                    newBrewDiv.append(brewNameP, brewTypeP, brewAddressP, brewPhoneP, brewWebP)
                    carouselItem.append(newBrewDiv);

                    $(".brew-carousel").append(carouselItem);
                }

                $('.brew-carousel').carousel({
                    noWrap: true,
                    indicators: true,
                });
            });






        //GET's CITYID
        $.ajax({
            url: zomatoCityID,
            method: "GET",
            headers: {
                "Accept": "application/json",
                "user-key": "5a33e1ec7d6535e6ef16c81e3833e48a"
            }
        }).then(function (res) {
            console.log("city id " + res.location_suggestions[0].id)
            var cityID = res.location_suggestions[0].id;

            var zomatoListURL = "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=city";

            //REST LIST by City ID
            $.ajax({
                url: zomatoListURL,
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "user-key": "5a33e1ec7d6535e6ef16c81e3833e48a"
                }
            }).then(function (res) {
                var restList = res.restaurants;
                console.log(restList);
                $(".rest-display").empty();

                console.log(restList[0].restaurant.featured_image);
                console.log(restList[0].restaurant.name);
                console.log(restList[0].restaurant.cuisines)
                console.log(restList[0].restaurant.location.address);
                console.log(restList[0].restaurant.location.locality);
                console.log(restList[0].restaurant.phone_numbers);
                console.log(restList[0].restaurant.menu_url);


                for (var i = 0; i < restList.length; i++) {

                    var newRestDiv = $("<div>").addClass("card");

                    var restImg = $("<img>").attr("src", restList[i].restaurant.featured_image).attr("alt text", "Featured Image");
                    var restNameP = $("<h5>").text(restList[i].restaurant.name);
                    var restCuisineP = $("<p>").text(restList[i].restaurant.cuisines);
                    var restAddressP = $("<p>").text("Address: " + restList[i].restaurant.location.address + ", Locality: " + restList[i].restaurant.location.locality);
                    var restPhoneP = $("<p>").text("Phone: " + restList[i].restaurant.phone_numbers);
                    var restMenu = $("<a>").attr("href", restList[i].restaurant.menu_url).attr("target", "_blank").text("View Menu");

                    newRestDiv.append(restImg, restNameP, restCuisineP, restAddressP, restPhoneP, restMenu);
                    $(".rest-display").append(newRestDiv);

                }


            });

        });

        // TICKETMASTER Event Search
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/events.json?size=20&apikey=mGRhyVGMqSKLiGRVm4XLR9SJBSPsX0Eg&city=" + citySearch,
            async: true,
            dataType: "json",
            success: function (json) {
                console.log(json);
                // Parse the response.
                // Do other things.
            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        });

        //Ticketmaster Attraction Search
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=mGRhyVGMqSKLiGRVm4XLR9SJBSPsX0Eg&keyword=" + citySearch,
            async: true,
            dataType: "json",
            success: function (json) {
                console.log(json);
                // Parse the response.
                // Do other things.
            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        });


    });
});