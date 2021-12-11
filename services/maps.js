const axios  = require("axios");


exports.maps = async (address, landmark, city, zipcode) => {
  
   try {
    // const response = await axios.get('https://geocode.search.hereapi.com/v1/geocode?q=F4+Navyug+Colony%2C+380022+India%2C+Ahmedabad&apiKey=WOWOWOW',{
    // });
    // console.log(response);
    const res = await axios.get('https://geocode.search.hereapi.com/v1/geocode', {
       params: {
          q: address +" " + landmark + " " + city + " " + "india" + "-" + zipcode,
           apiKey:process.env.GEOCODE_API_KEY 
              } 
        });
    return res.data
  } catch (error) {
    console.error(error);
  }
}

