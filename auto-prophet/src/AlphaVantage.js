
//Takes a security keyword and returns an array of objects of matching securities with their metadata
async function GetSearchData(keyword) {

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=BQWCPFV1XJFJ7ZPH&datatype=json`;

    const response = await fetch(url);
    const data = await response.json();

    //console.log(data);

    var arrayData = FormatSearchData(data.bestMatches);

    //console.log(arrayData);

    return arrayData;
}

//Takes json object of security data and turns it into an array of objects of securities
function FormatSearchData(data) {
    var array = [];
    
    Object.entries(data).forEach((entry) => {
        //console.log(entry);
        const security = {
            ticker: (Object.entries(entry[1])[0])[1],
            name: (Object.entries(entry[1])[1])[1]
        }

        //console.log(security);

        array.push(security);
    });

    //console.log(array);

    return array;

}

export {GetSearchData}