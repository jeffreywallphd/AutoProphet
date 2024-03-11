//Alphavantage API key pulled from the user's .env file
const APIKey = await GetAPIKey();

/* 
**************  Exported Functions *****************
*/
//Takes a security keyword and returns an array of objects of matching securities with their metadata
async function GetSearchBarData(keyword) {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${APIKey}&datatype=json`;

    const response = await fetch(url);
    const data = await response.json();

    var arrayData = FormatSearchBarData(data["bestMatches"]);

    return arrayData;
}

//Gets hourly data from AlphaVantage for a given ticker
async function Get1DMinuteData(ticker) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${APIKey}&extended_hours=false&outputsize=full&datatype=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.hasOwnProperty("Error Message")){
        return "Error";
    } else {
        return Format1DMinuteData(data);
    }
}

/* 
**************  Helper Functions *****************
*/
//Gets the api key from the .env file in the auto-prophet folder
async function GetAPIKey() {
    var ENVContents;

    await fetch("../.env")
        .then((response) => response.text() )
        .then((contents) => ENVContents = contents);
    
    ENVContents = JSON.parse(ENVContents);

    return ENVContents["ALPHAVANTAGE_API_KEY"];
}

//Takes json object of security data and turns it into an array of objects of securities
function FormatSearchBarData(data) {
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

//Takes json object of security price and volume data and turns it into a parsable array of minute by minute data for one day
function Format1DMinuteData(data) {
    var array = [];
    var metaData = [];
    var priceData = [];

    //Add metadata to the returned data array
    var lastUpdatedDateTime = new Date(Date.parse(data["Meta Data"]["3. Last Refreshed"]));
    metaData["ticker"] = data["Meta Data"]["2. Symbol"];
    metaData["company"] = "";
    metaData["lastUpdatedDate"] = lastUpdatedDateTime.toLocaleDateString();
    metaData["lastUpdatedTime"] = lastUpdatedDateTime.toLocaleTimeString();
    array["MetaData"] = metaData;

    var recentDay = new Date(Object.entries(data["Time Series (1min)"])[0][0]).toLocaleDateString();
    
    Object.entries(data["Time Series (1min)"]).forEach((entry) => {
        var dateTime = new Date(entry[0]);
        const minuteData = {
            date: dateTime.toLocaleDateString(),
            time: dateTime.toLocaleTimeString(),
            price: entry[1]["4. close"],
            volume: entry[1]["5. volume"]
        }
        if (recentDay == minuteData.date)
            priceData.push(minuteData);
    });

    array["Data"] = priceData.reverse();

    return array;
}

export {GetSearchBarData, Get1DMinuteData}