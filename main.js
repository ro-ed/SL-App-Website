let minutesToWalk;
let theSiteID;
let timeAtDestination;
let savedInput;
let timeAtDestinationMinutes;

function handleEnterPress(e){
    if(e.keyCode === 13){
        let theInput = document.getElementById('userInput').value;
        savedInput = theInput;
        e.preventDefault(); // Ensure it is only this code that runs
        
        getCoords(theInput);
        getData(theInput);
        
        let emptyTheBox = document.getElementById('stationName');
        emptyTheBox.innerHTML = '';
            
        var elmnt = document.getElementById('takemehere');
        elmnt.scrollIntoView();
    }
}



function getData(searchData)
    {
        const url = `http://api.sl.se/api2/typeahead.json?key=0cd040dd2dfa4ea2b105d29016599f5c&searchstring=${searchData}&stationsonly=true`;
         fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                    let stationName = document.getElementById('stationName')
                    stationName.appendChild(document.createTextNode(searchData.charAt(0).toUpperCase() + searchData.slice(1)));
                    let getSiteId = data.ResponseData[0].SiteId;
                    theSiteID = getSiteId;
                    useSiteID(getSiteId);

                })

            .catch(function (error) {
                console.log(error);
            });
}

//=======================================
//UPDATE TABLE

setInterval(async function(){
     await useSiteID(theSiteID), console.log("SIDAN UPPDATERAS FÖR => " + "(" + theSiteID + ")"+ minutesToWalk + "min")
},60000);

//======================================
async function useSiteID(siteID) 
{
    document.getElementById('time-grid').innerHTML = "";

    const url = `http://api.sl.se/api2/realtimedeparturesv4.json?key=f04c1a44d6294242a1bfa0f41d73270e&siteid=${siteID}&timewindow=30`;
    await fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {

            let grid = document.getElementById('time-grid');
            let respData = data.ResponseData;

            if (document.getElementById('bus').checked) {
                if (respData.Buses.length > 0) {
                    respData.Buses.forEach(element => {
                        
                        let displayTimeNumber = element.DisplayTime;
                        let countChars = displayTimeNumber.length; 
                        let oneOrTwoChars;
                        if (countChars >= 6) 
                        {
                           oneOrTwoChars = displayTimeNumber.slice(0, 2);
                        }
                        else{
                            oneOrTwoChars = displayTimeNumber.charAt(0);
                            if(oneOrTwoChars === "N")
                            {
                                oneOrTwoChars = 0;
                            }
                        }

                        let unsliced = element.ExpectedDateTime; //2021-09-02T14:20:00
                
                        const dateStr = unsliced,
      
                        [yyyy,mm,dd,hh,mi,sec] = dateStr.split(/[/:\-T]/)
      
                        let minutesAfterSliced = mi;

                        let sliced = calculate(`${hh}:${mi}:${sec}`);

                        if (timeAtDestination <= sliced && oneOrTwoChars >= minutesToWalk) {

                            console.log("Du HINNER!" + sliced + ">=" + timeAtDestination + "\nFramme: " + timeAtDestinationMinutes + "\nAvgång: " + minutesAfterSliced);

                            var line = document.createElement('div');
                            var name = document.createElement('div');
                            var minutesToGo = document.createElement('div');

                            line.className = "a1";
                            name.className = "a2";
                            minutesToGo.className = "a3";

                            line.innerHTML = element.LineNumber;
                            name.innerHTML = element.Destination;
                            minutesToGo.innerHTML = element.DisplayTime;

                            grid.appendChild(line);
                            grid.appendChild(name);
                            grid.appendChild(minutesToGo);
                        }

                        else {
                            console.log("Du hinner INTE!" + sliced + "<" + timeAtDestination);
                        }

                    });

                }
                else {
                    let message = document.createElement('div');
                    message.className = "no-departures";
                    message.innerHTML = "Det finns inga avgångar för bussar på vald hållplats.";
                    grid.appendChild(message);
                }
            }

            if (document.getElementById('train').checked) {
                if (respData.Trains.length > 0) {
                    respData.Trains.forEach(element => {
                        
                        let displayTimeNumber = element.DisplayTime;
                        let countChars = displayTimeNumber.length; 
                        let oneOrTwoChars;
                        if (countChars >= 6) 
                        {
                           oneOrTwoChars = displayTimeNumber.slice(0, 2);
                        }
                        else{
                            oneOrTwoChars = displayTimeNumber.charAt(0);
                            if(oneOrTwoChars === "N")
                            {
                                oneOrTwoChars = 0;
                            }
                        }

                        let unsliced = element.ExpectedDateTime; //2021-09-02T14:20:00
                
                        const dateStr = unsliced,
      
                        [yyyy,mm,dd,hh,mi,sec] = dateStr.split(/[/:\-T]/)
      
                        let sliced = calculate(`${hh}:${mi}:${sec}`);

                        if(timeAtDestination <= sliced && oneOrTwoChars >= minutesToWalk)
                        {

                        console.log("Du HINNER!" + sliced +">=" + timeAtDestination);

                        var line = document.createElement('div');
                        var name = document.createElement('div');
                        var minutesToGo = document.createElement('div');

                        line.className = "a1";
                        name.className = "a2";
                        minutesToGo.className = "a3";

                        line.innerHTML = element.LineNumber;
                        name.innerHTML = element.Destination;
                        minutesToGo.innerHTML = element.DisplayTime;

                        grid.appendChild(line);
                        grid.appendChild(name);
                        grid.appendChild(minutesToGo);
                        }
                        else{
                            console.log("Du hinner INTE!" + sliced +"<" + timeAtDestination);
                        }
                    });

                }
                else {
                    let message = document.createElement('div');
                    message.className = "no-departures";
                    message.innerHTML = "Det finns inga avgångar för tåg på vald hållplats.";
                    grid.appendChild(message);
                }
            }

            if (document.getElementById('metro').checked) {
                if (respData.Metros.length > 0) {
                    respData.Metros.forEach(element => {
                        
                        let displayTimeNumber = element.DisplayTime;
                        let countChars = displayTimeNumber.length; 
                        let oneOrTwoChars;
                        if (countChars >= 6) 
                        {
                           oneOrTwoChars = displayTimeNumber.slice(0, 2);
                        }
                        else{
                            oneOrTwoChars = displayTimeNumber.charAt(0);
                            if(oneOrTwoChars === "N")
                            {
                                oneOrTwoChars = 0;
                            }
                        }

                        let unsliced = element.ExpectedDateTime; //2021-09-02T14:20:00
                
                        const dateStr = unsliced,
      
                        [yyyy,mm,dd,hh,mi,sec] = dateStr.split(/[/:\-T]/)
      
                        let sliced = calculate(`${hh}:${mi}:${sec}`);

                        if (timeAtDestination <= sliced && oneOrTwoChars >= minutesToWalk) {

                            var line = document.createElement('div');
                            var name = document.createElement('div');
                            var minutesToGo = document.createElement('div');

                            line.className = "a1";
                            name.className = "a2";
                            minutesToGo.className = "a3";

                            line.innerHTML = element.LineNumber;
                            name.innerHTML = element.Destination;
                            minutesToGo.innerHTML = element.DisplayTime;

                            grid.appendChild(line);
                            grid.appendChild(name);
                            grid.appendChild(minutesToGo);
                        }
                        else{
                            console.log("Du hinner INTE!" + sliced +"<" + timeAtDestination);
                        }
                    });

                }
                else {
                    let message = document.createElement('div');
                    message.className = "no-departures";
                    message.innerHTML = "Det finns inga avgångar för metros på vald hållplats.";
                    grid.appendChild(message);
                }
            }
        })
        

        
         .catch(function (error) {
                console.log(error);
            });
}

function getCoords(input)
{
    const url = `https://api.resrobot.se/v2/location.name.json?key=9eb605e0-b6cd-4d6f-a4ca-270ae91630c9&input=${input}`;
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {

               let startlongitude = 18.05811;
               let startlatitude = 59.32000;

               let stoplongitude = data.StopLocation[0].lon;
               let stoplatitud = data.StopLocation[0].lat;
               useCoords(startlatitude, startlongitude, stoplatitud, stoplongitude);
            })

        .catch(function (error) {
            console.log(error);
        });
}

function useCoords(startlat, startlon, stoplat, stoplon) {
    const url = `https://api.resrobot.se/v2/trip?key=9eb605e0-b6cd-4d6f-a4ca-270ae91630c9&originCoordLat=${startlat}&originCoordLong=${startlon}&destCoordLat=${stoplat}&destCoordLong=${stoplon}&format=json`;
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            let originTime = data.Trip[0].LegList.Leg[0].Origin.time;
            let destinationTime = data.Trip[0].LegList.Leg[0].Destination.time;

            console.log(originTime);
            console.log(destinationTime);

            const seconds = calculate(originTime);
            const seconds2 = calculate(destinationTime);

            console.log(seconds);

            timeAtDestination = seconds2;
            timeAtDestinationMinutes = (seconds2/60);
            console.log(seconds2);

            let subraction = (seconds2 - seconds)/60;

            console.log(subraction);

            minutesToWalk = subraction;
            console.log("useCoords-metoden:" + minutesToWalk);


            })

        .catch(function (error) {
            console.log(error);
        });
}

function calculate(time){
    const arr = time.split(":");
    const seconds = arr[0] * 3600 + arr[1] * 60 + (+arr[2]);

    return seconds;
}