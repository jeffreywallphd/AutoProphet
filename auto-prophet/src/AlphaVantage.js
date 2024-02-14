const APIKey = "BQWCPFV1XJFJ7ZPH";


//Takes a security keyword and returns an array of objects of matching securities with their metadata
async function GetSearchData(keyword) {

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${APIKey}&datatype=json`;

    const response = await fetch(url);
    const data = await response.json();

    //console.log(data["bestMatches"][0]["1. symbol"]);

    var arrayData = FormatSearchData(data["bestMatches"]);

    //console.log(arrayData);

    return arrayData;
}

//Gets hourly data from AlphaVantage for a given ticker
async function GetHourlyData(ticker) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${APIKey}&datatype=json`;

    const response = await fetch(url);
    const data = await response.json();

    //console.log(data);

    var arrayData = FormatHourlyData(data);

    //console.log(arrayData);

    return arrayData;
}

//Takes json object of security data and turns it into an array of objects of securities
function FormatSearchData(data) {
    var array = [];
    
    Object.entries(data).forEach((entry) => {
        //console.log(entry[1]["1. symbol"]);
        const security = {
            ticker: entry[1]["1. symbol"],
            name: entry[1]["2. name"]
        }

        //console.log(security);

        array.push(security);
    });

    //console.log(array);

    return array;

}

//Takes json object of security price and volume data and turns it into a parsable array
function FormatHourlyData(data) {
    var array = [];
    var metaData = [];
    var priceData = [];

    //Add metadata to the returned data array
    var lastUpdatedDateTime = new Date(Date.parse(data["Meta Data"]["3. Last Refreshed"]));
    metaData["ticker"] = data["Meta Data"]["2. Symbol"];
    metaData["lastUpdatedDate"] = lastUpdatedDateTime.toLocaleDateString();
    metaData["lastUpdatedTime"] = lastUpdatedDateTime.toLocaleTimeString();
    array["MetaData"] = metaData;
    
    Object.entries(data["Time Series (1min)"]).forEach((entry) => {
        //console.log(entry);
        var dateTime = new Date(Date.parse(entry[0]));
        //console.log(dateTime);
        //console.log(dateTime.toLocaleDateString());
        const price = {
            date: dateTime.toLocaleDateString(),
            time: dateTime.toLocaleTimeString(),
            price: entry[1]["4. close"],
            volume: entry[1]["5. volume"]
        }
        priceData.push(price);
    });

    array["Data"] = priceData;

    //console.log(array);

    return array;

}

export {GetSearchData, GetHourlyData}