import React, { Component, useState, useEffect } from 'react';
import axios, { formToJSON } from 'axios';
import './statsStyle.css';


function StatPanel() {

  const id_options = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/players/statistics',
    params: {id: '882', season: '2020'},
    headers: {
      'X-RapidAPI-Key': '[Insert Your API Key Here]',
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  const gameOptions = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/games',
    params: {id: '8899'},
    headers: {
      'X-RapidAPI-Key': '[Insert Your API Key Here]',
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  let srchLastname = ""
  let srchID = -10
  let srchSeason = -2

  let playerID = -90
  let playerIDSeason = -90

  let srchOptions = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/players',
    params: {team: '2', season: '2021', search: 'tatum'},
    headers: {
      'X-RapidAPI-Key': '[Insert Your API Key Here]',
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }

  }



    const [data, setData] = useState([null]);

    const [pointsData, setPoints] = useState({});
    const [pointsPG, setPointsPG] = useState(-1);

    const [assistsData, setAssists] = useState({});
    const [assistsPG, setAssistsPG] = useState(-1);

    const [reboundsData, setRebounds] = useState({});
    const [reboundsPG, setReboundsPG] = useState(-1);

    const [stealsData, setSteals] = useState({});
    const [stealsPG, setStealsPG] = useState(-1);

    const [blocksData, setBlocks] = useState({});
    const [blocksPG, setBlocksPG] = useState(-1);

    const [foulsData, setFouls] = useState({});
    const [foulsPG, setFoulsPG] = useState(-1);

    const [numSrchResults, setResults] = useState(0)
    const [idSrchName, setIDName] = useState("")

    let srchPlayers = []
    const [playerResults, setPlayerResults] = useState([null])

    async function getPlayer(playID, seasonNum, setName){


      playerID = document.getElementById("playerID").value
      playerIDSeason = document.getElementById("playerIDSeason").value

      if(typeof playID === 'undefined'){
        id_options.params.id = playerID
      }
      if(typeof seasonNum === 'undefined'){
        id_options.params.id = playerID
        id_options.params.season = playerIDSeason
      }
      if ((typeof playID != 'undefined') && (typeof seasonNum != 'undefined')){
      
      id_options.params.id = playID
      id_options.params.season = seasonNum
      }

      try{
      const {data} = await axios.request(id_options);

      console.log("|REAL P DATA|")
      console.log(data)
      console.log("|REAL GAME DATA|")
      console.log(data.response.game)

      console.log("|GET PLAYER ID|")
      console.log(data.response[0].player.firstname, data.response[0].player.lastname)

      if(typeof setName === "undefined"){
      setIDName(data.response[0].player.firstname + " " + data.response[0].player.lastname)

      //Set Results back to zero to clear any previous search renders
      setResults(0)
        }

      getStats(data.response)
      return data;
      }
      catch(error){}
    }

    function getTopFiveByValue(dict){

      var items = Object.keys(dict).map(function(key){
        return [key, dict[key]];
      });

      items.sort(function(first, second){
        return second[1] - first[1];
      });

      return (items.slice(0,5))

    }

    let pointSum = 0
    let assistSum = 0
    let reboundSum = 0
    let stealSum = 0 
    let blockSum = 0
    let foulSum = 0 

    let pointList = {}
    let assistList = {}
    let reboundList = {}
    let stealList = {}
    let blockList = {}
    let foulList = {}

    function getStats(jsonData){

      pointList = {}
      assistList = {}
      reboundList = {}
      stealList = {}
      blockList = {}
      foulList = {}

      for (let i = 0 ;  i < jsonData.length; i++ ){

        pointSum += jsonData[i].points
        assistSum += jsonData[i].assists
        stealSum += jsonData[i].steals
        blockSum += jsonData[i].blocks
        foulSum += jsonData[i].pFouls
        reboundSum += jsonData[i].offReb
        reboundSum += jsonData[i].defReb

        pointList[jsonData[i].min] = jsonData[i].points
        assistList[jsonData[i].min] = jsonData[i].assists
        reboundList[jsonData[i].min] = jsonData[i].offReb + jsonData[i].defReb
        stealList[jsonData[i].min] = jsonData[i].steals
        blockList[jsonData[i].min] = jsonData[i].blocks
        foulList[jsonData[i].min] = jsonData[i].pFouls

      }

      // Sort Stat lists by their values
      pointList = getTopFiveByValue(pointList)
      assistList = getTopFiveByValue(assistList)
      reboundList = getTopFiveByValue(reboundList)
      stealList = getTopFiveByValue(stealList)
      blockList = getTopFiveByValue(blockList)
      foulList = getTopFiveByValue(foulList)

      setPoints(pointList)
      setAssists(assistList)
      setRebounds(reboundList)
      setSteals(stealList)
      setBlocks(blockList)
      setFouls(foulList)

      // Set season averages for each stat category
      setPointsPG((pointSum/jsonData.length).toFixed(2))
      setAssistsPG((assistSum/jsonData.length).toFixed(2))
      setStealsPG((stealSum/jsonData.length).toFixed(2))
      setBlocksPG((blockSum/jsonData.length).toFixed(2))
      setFoulsPG((foulSum/jsonData.length).toFixed(2))
      setReboundsPG((reboundSum/jsonData.length).toFixed(2))
      
    }

    //Rename this function, this is our search button logic
    async function searchPlayer(){
      srchLastname = document.getElementById("playerLastname").value
      srchID = document.getElementById("playerTeamID").value
      srchSeason = document.getElementById("playerSeason").value

      console.log("|Lastname|", srchLastname, "|ID|" ,  srchID, "|Season|", srchSeason )

      srchOptions.params.search = srchLastname
      srchOptions.params.team = srchID
      srchOptions.params.season = srchSeason

      console.log(srchOptions.params)

      try {
        const {data} = await axios.request(srchOptions);

        console.log(data)
        console.log(data.response.length)

        if(data.response.length > 1){
          setIDName("")
          setResults(data.response.length)

          let resultsStr = ""
          for (let i = 0; i < data.response.length ; i++){

            resultsStr = data.response[i].firstname + " " + data.response[i].lastname + " with player ID Number: " + data.response[i].id
            srchPlayers.push(resultsStr)
            
          }
          setPlayerResults(srchPlayers)

        }
        else if(data.response.length === 1){
          setIDName("")
          setResults(data.response.length)
          let resultStr = data.response[0].firstname + " " + data.response[0].lastname + " with player ID Number: " + data.response[0].id
          srchPlayers.push(resultStr)
          setPlayerResults(srchPlayers)
          getPlayer(data.response[0].id, srchSeason, false)
          
        }

        return data;
      }
      catch(error){
        console.log("|ERROR|")
      }

    }

    return (
        <div>
            <div id="heading">NBA Stats (Search Top 5 Performances Per Season/Stat)</div>

           Search Player: Lastname  &ensp;<input type="text" id="playerLastname"/> &ensp;
           Team ID: &ensp;<input type="text" id="playerTeamID"/> &ensp;
           Season (YYYY): &ensp;<input type="text" id="playerSeason"/>
           &ensp;<button onClick={searchPlayer}> Search</button>
           <br></br>
           ID Search: &ensp; <input type="text" id="playerID"/>
           &ensp; ID Season (YYYY): &ensp;<input type="text" id="playerIDSeason"/>
           &ensp;<button onClick={getPlayer}> ID Search</button>

            {numSrchResults > 1 &&

             <div>
             <h2> You have {numSrchResults} results</h2>
             {playerResults.map((value,idx) => (
                <div
                key={idx}

                > {value} </div>
                ))}

             </div>

            }

            <div>
            { (numSrchResults === 1) &&

            <div>
             <h2> Found Result for {playerResults[0]}</h2>
             </div>

            }
            </div>

            <div>
            { (idSrchName != "")  &&

            <div>
             <h2> Found Result for {idSrchName}</h2>
             </div>

            }
            </div>


            <br></br>
            <p className="rcorners1"> Points {(pointsPG > -1) && <b> (PPG {pointsPG}) </b>}
              <br></br>(Minutes Played | Value)

              { pointsData.length > 1 && <div>
              <li className="statItem"> {pointsData[0][0]} | {pointsData[0][1]} </li>
              <li className="statItem"> {pointsData[1][0]} | {pointsData[1][1]}</li>
              <li className="statItem"> {pointsData[2][0]} | {pointsData[2][1]}</li>
              <li className="statItem"> {pointsData[3][0]} | {pointsData[3][1]}</li>
              <li className="statItem"> {pointsData[4][0]} | {pointsData[4][1]}</li></div>}

            </p>
            <p className="rcorners1"> Assists {(assistsPG > -1) && <b> (APG {assistsPG}) </b>}
              <br></br>(Minutes Played | Value)
              {assistsData.length > 1 && <div>
              <li className="statItem"> {assistsData[0][0]} | {assistsData[0][1]} </li>
              <li className="statItem"> {assistsData[1][0]} | {assistsData[1][1]}</li>
              <li className="statItem"> {assistsData[2][0]} | {assistsData[2][1]}</li>
              <li className="statItem"> {assistsData[3][0]} | {assistsData[3][1]}</li>
              <li className="statItem"> {assistsData[4][0]} | {assistsData[4][1]}</li> </div>}
            </p>
            <p className="rcorners1"> Rebounds {(reboundsPG > -1) && <b> (RPG {reboundsPG}) </b>}
              <br></br>(Minutes Played | Value)
              {reboundsData.length > 1 && <div>
              <li className="statItem"> {reboundsData[0][0]} | {reboundsData[0][1]}</li>
              <li className="statItem"> {reboundsData[1][0]} | {reboundsData[1][1]}</li>
              <li className="statItem"> {reboundsData[2][0]} | {reboundsData[2][1]}</li>
              <li className="statItem"> {reboundsData[3][0]} | {reboundsData[3][1]}</li>
              <li className="statItem"> {reboundsData[4][0]} | {reboundsData[4][1]}</li></div>}
            </p>
            <p className="rcorners1"> Steals {(stealsPG > -1) && <b> (SPG {stealsPG}) </b>}
              <br></br>(Minutes Played | Value)
              {stealsData.length > 1 && <div>
              <li className="statItem"> {stealsData[0][0]} | {stealsData[0][1]}</li>
              <li className="statItem"> {stealsData[1][0]} | {stealsData[1][1]}</li>
              <li className="statItem"> {stealsData[2][0]} | {stealsData[2][1]}</li>
              <li className="statItem"> {stealsData[3][0]} | {stealsData[3][1]}</li>
              <li className="statItem"> {stealsData[4][0]} | {stealsData[4][1]}</li></div>}
            </p>
            <p className="rcorners1"> Blocks {(blocksPG > -1) && <b> (BPG {blocksPG}) </b>}
              <br></br>(Minutes Played | Value)
              {blocksData.length > 1 && <div>
              <li className="statItem"> {blocksData[0][0]} | {blocksData[0][1]}</li>
              <li className="statItem"> {blocksData[1][0]} | {blocksData[1][1]}</li>
              <li className="statItem"> {blocksData[2][0]} | {blocksData[2][1]}</li>
              <li className="statItem"> {blocksData[3][0]} | {blocksData[3][1]}</li>
              <li className="statItem"> {blocksData[4][0]} | {blocksData[4][1]}</li></div>}
            </p>
            <p className="rcorners1"> Fouls {(foulsPG > -1) && <b> (FPG {foulsPG}) </b>}
              <br></br>(Minutes Played | Value)
              {foulsData.length > 1 && <div>
              <li className="statItem"> {foulsData[0][0]} | {foulsData[0][1]}</li>
              <li className="statItem"> {foulsData[1][0]} | {foulsData[1][1]}</li>
              <li className="statItem"> {foulsData[2][0]} | {foulsData[2][1]}</li>
              <li className="statItem"> {foulsData[3][0]} | {foulsData[3][1]}</li>
              <li className="statItem"> {foulsData[4][0]} | {foulsData[4][1]}</li></div>}
            </p>

            <p className="rcorners2"> Team Code Legend:
            <div className="grid">
              <div className="textLeft">1  ATL Hawks</div>
              <div className="textLeft">14 HOU Rockets</div>
              <div className="textLeft">25 OKC Thunder</div>
              <div className="textLeft">2  BOS Celtics</div>
              <div className="textLeft">15 IND Pacers</div>
              <div className="textLeft">26 ORL Magic</div>
              <div className="textLeft">4  BRK Nets</div>
              <div className="textLeft">16 LAC Clippers</div>
              <div className="textLeft">27 PHI 76ers</div> 
              <div className="textLeft">5  CHA Hornets</div>

              <div className="textLeft">17 LAL Lakers</div>
              <div className="textLeft">28 PHX Suns</div>
              <div className="textLeft">6  CHI Bulls</div>
              <div className="textLeft">19 MEM Grizzlies</div>
              <div className="textLeft">29 POR Trailblazers</div>
              <div className="textLeft">7  CLE Cavaliers</div>
              <div className="textLeft">20 MIA Heat</div>
              <div className="textLeft">30 SAC Kings</div>
              <div className="textLeft">8  DAL Mavericks</div> 
              <div className="textLeft">21 MIL Bucks</div>

              <div className="textLeft">31 SAS Spurs</div>
              <div className="textLeft">9  DEN Nuggets</div>
              <div className="textLeft">22 MIN Timberwolves</div>
              <div className="textLeft">38 TOR Raptors</div>
              <div className="textLeft">10 DET Pistons</div>
              <div className="textLeft">23 NOP Pelicans</div>
              <div className="textLeft">40 UTA Jazz</div>
              <div className="textLeft">11 GSW Warriors</div>
              <div className="textLeft">24 NYK Knicks</div> 
              <div className="textLeft">41 WAS Wizards</div> 
            </div>
            </p>


        </div>
    )

}

export default StatPanel;