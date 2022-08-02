var APIkey = "21NQtYEipffSbGzB9w4Spg1IZ2SD9yRB4sNq7Gm27NZsP3dCgM";
var secret = 'OSiRfIrLm4JY5Is4X7qG0d5lFc2f5CdLRl44k2I2';
var token = "";
const searchBtnEl = document.querySelector("#search");
var GoogleAPI = "AIzaSyBOyvzJ4HnoViMXPbiH55KF0vqM08GOZ-I";
var geocoder;
var map;
searchBtnEl.addEventListener("click", fetchAnimals);

// fetch animals from API
function fetchAnimals(event) {
  event.preventDefault();
var hideMissionStatement = document.getElementById("missionStatement");
    hideMissionStatement.classList.add("is-hidden");    //hidding the Mission statement

  // Get user Input
  const animal = document.querySelector("#animal").value;
  const zipCode = document.querySelector("#zipCode").value;

// return response status
var handleErrors = (response) => {
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}
 // request an access token, which will enable us to receive information from the servers.
 fetch("https://api.petfinder.com/v2/oauth2/token", {
    //POST method is used to send data to the server to create token
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" + APIkey + "&client_secret=" + secret,
    headers: {
        //telling the web server that you will be encoding the parameters in the URL 
        // for example Name=John+Smith&Age=23 instead of JSON data {"Name": "John Smith", "Age": 23}
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then (handleErrors)
    .then((response) => response.json())
    .then((data) => {
      token = data.access_token;
    })
    .then(() => {
      // use token to fetch animals
      fetch(
        `https://api.petfinder.com/v2/animals?type=${animal}&location=${zipCode}`,
        {
            //GET method is used to request data from a specified resource
          method: "GET",
            // i found this on stackoverflow, i'm not sure how it functions but it seems to be important
            // CORS is a mechanism that allows various resources (fonts, Javascript, etc.) 
            //of a web page to be queried from a domain other than that of the site.
            // CORS is an acronym for cross-origin resource sharing.
          mode: "cors",
          
          headers: {
            "Content-Type": "application/json",
            //"Bearer" means the server will not expect other identification along with the token
            "Authorization": "Bearer " + token,
          },
        }
      )
        .then (handleErrors)
        .then((response) => response.json())
        .then((data) => displayResults(data.animals));
    })
}


    // Display pets
function displayResults(pets) {
    var results = document.querySelector("#Holder");
  
    // empty the list first
    //results.innerHTML = "";
    results.innerHTML = "";

    // loop over searching result
    pets.forEach((pet) => {
      console.log(pet);
      const information = document.createElement("div");
      information.classList.add("columns", "pl-5");
      information.innerHTML = `
      <div class="column is-one-quarter">
      <h1 class="is-size-1">${pet.name} (${pet.age})</h1>
                <p class="">${pet.breeds.primary}</p>
                <p>${pet.contact.address.city}, ${pet.contact.address.state} ${pet.contact.address.postcode}</p>
                <p>Phone: ${pet.contact.phone}</p>
                <p>Email: ${pet.contact.email} </p>
                <p>Shelter ID: ${pet.organization_id} </p>
      </div>
      <div class="column is-one-quarter"><img alt="picture of loveable pet" class="mt-2" src="${
                pet.photos[0] ? pet.photos[0].medium : ""
              }"></div>
      <div class="column"> 
              <h2>Google Map:</h2>
              <input type="submit" value="Show Location" onclick="showMap(event, '${pet.contact.address.postcode}')">
              <div id="map"></div>

      </div>`;
      results.appendChild(information);
    });
  }

  var address = "San Diego, CA";
  function showMap(event, address) {
    console.log(event);
    var mapNode= event.target.nextElementSibling;
    console.log(event.target.nextElementSibling);
    if (address===undefined){
      address= "San Diego, CA";
    }else{
  
      address = address;
    }
  
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 14,
      center: latlng
    };
    map = new google.maps.Map(mapNode, myOptions);
    if (geocoder) {
      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);
  
            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: address
            });
          } else {
            alert("No results found");
          }
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  }
  
