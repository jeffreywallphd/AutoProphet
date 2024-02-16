//Alphavantage API key pulled from the user's .env file
const APIKey = GetAPIKey();

//Gets the api key from the .env file in the auto-prophet folder
async function GetAPIKey() {
    var ENVContents;

    await fetch("../.env")
        .then((response) => response.text() )
        .then((contents) => ENVContents = contents);
    
    ENVContents = JSON.parse(ENVContents);

    return ENVContents["ALPHAVANTAGE_API_KEY"];
}


//Takes a security keyword and returns an array of objects of matching securities with their metadata
async function GetSearchData(keyword) {

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${APIKey}&datatype=json`;

    const response = await fetch(url);
    const data = await response.json();

    var arrayData = FormatSearchData(data["bestMatches"]);

    return arrayData;
}

//Takes json object of security data and turns it into an array of objects of securities
function FormatSearchData(data) {
    var array = [];
    
    Object.entries(data).forEach((entry) => {
        const security = {
            ticker: entry[1]["1. symbol"],
            name: entry[1]["2. name"]
        }

        array.push(security);
    });

    return array;
}

export {GetSearchData}