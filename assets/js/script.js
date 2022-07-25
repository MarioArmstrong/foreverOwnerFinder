var APIkey = "21NQtYEipffSbGzB9w4Spg1IZ2SD9yRB4sNq7Gm27NZsP3dCgM";
var secret ='OSiRfIrLm4JY5Is4X7qG0d5lFc2f5CdLRl44k2I2';
var token ="";
const Form = document.querySelector("#form");
Form.addEventListener("submit", fetchAnimals);

// fetch animals from API
function fetchAnimals(event) {
  event.preventDefault();

  // Get user Input
  const animal = document.querySelector("#animal").value;
  const zipCode = document.querySelector("#zipCode").value;

  // check if zipcode if valid
  if (!isValidZip(zipCode)) {
    showAlert("Invalid Zipcode. Please try again!");
    return;
  }

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
        .then((data) => diplayResults(data.animals));
    })

}


    // Display the of pets
function displayResults(pets) {
    var results = document.querySelector("#results");
  
    // empty the list first
    results.innerHTML = "";
  
    // loop over searching result
    pets.forEach((pet) => {
      const information = document.createElement("div");
      information.classList.add("card", "card-body", "mb-3");
      information.innerHTML = `
        <div class="row">
          <div class="col-sm-6">
            <h4>${pet.name} (${pet.age})</h4>
            <p class="text-secondary">${pet.breeds.primary}</p>
            <p>${pet.contact.address.city}, ${pet.contact.address.state} ${pet.contact.address.postcod}</p>
            <p class=" .text-info"> Phone: ${pet.contact.phone}</li>
          <img class="img-fluid rounded-circle mt-2" src="${pet.photos[0] ? pet.photos[0].medium : ""}">
          </div>
        </div> `;
      results.appendChild(information);
    });
  }
