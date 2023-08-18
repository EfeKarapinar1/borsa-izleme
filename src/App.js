import { useState, useEffect } from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import LineChart from './Charts/LineChart';
import Card from './Card';
import Chart from 'chart.js/auto';

function App() {

  var currentdate = new Date();
  var socketUrl = 'wss://streaming.forexpros.com/echo/738/dyyw6hyw/websocket';

  const message = [
    "{\"_event\":\"bulk-subscribe\",\"tzID\":63,\"message\":\"pid-eu-19155:%%pid-eu-172:\"}",
    "{\"_event\":\"UID\",\"UID\":0}",
    "{\"_event\":\"heartbeat\",\"data\":\"h\"}"
  ]

  const [bistuserData, setbistUserData] = useState(null);
  const [daxuserData, setdaxUserData] = useState(null);

  const [bistMessageHistory, setBistMessageHistory] = useState([]);
  const [daxMessageHistory, setDaxMessageHistory] = useState([]);

  const [ bist100, setBist100 ] = useState("");
  const [ lastbist100, setLastbist100 ] = useState("");
  const [ bistartti, setbistartti ] = useState(false);
  const [ bistfark, setBistfark ] = useState("");

  const [ dax, setDax ] = useState("");
  const [ lastdax, setLastDax ] = useState("");
  const [ daxartti, setdaxartti ] = useState(false);
  const [ daxfark, setDaxfark ] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

   useEffect(() => {
      // Bist 100
     if (lastMessage !== null && String(lastMessage.data).includes("pid-eu-19155")) {
      setLastbist100(bist100);
      var getLastFromJson = JSON.parse(String(JSON.parse(JSON.parse(String(lastMessage.data).slice(1))[0]).message).slice(14));
      setBist100(getLastFromJson.last);
      setBistMessageHistory([...bistMessageHistory,{date:currentdate.getHours() + "." + currentdate.getMinutes() + "." + currentdate.getSeconds(), value:getLastFromJson.last, fvalue:parseFloat(getLastFromJson.last)}])
      if((parseFloat(lastbist100) - parseFloat(getLastFromJson.last)) < 0)
      {
        setbistartti(true);
      }else{
        setbistartti(false);
      }
      setBistfark((parseFloat(lastbist100) - parseFloat(getLastFromJson.last)));
    }

     // DAX
     if (lastMessage !== null && String(lastMessage.data).includes("pid-eu-172")) {
      setLastDax(dax);
      
      var getLastFromJson = JSON.parse(String(JSON.parse(String(JSON.parse(String(lastMessage.data).slice(1))[0])).message).slice(12));
      setDax(getLastFromJson.last);
      setDaxMessageHistory([...daxMessageHistory,{date:currentdate.getHours() + "." + currentdate.getMinutes() + "." + currentdate.getSeconds(), value:getLastFromJson.last, fvalue:parseFloat(getLastFromJson.last) }])
      if((parseFloat(lastdax) - parseFloat(getLastFromJson.last)) < 0)
      {
        setdaxartti(true);
      }else{
        setdaxartti(false);
      }
      setDaxfark((parseFloat(lastdax) - parseFloat(getLastFromJson.last)));
    }
   }, [lastMessage]); 

  useEffect(() => {
    setbistUserData({
      labels: bistMessageHistory.map((i) => i.date),
      datasets: [
        {
          label: "Bist100",
          data: bistMessageHistory.map(i => i.fvalue),
          borderColor: 'rgb(255,255,255)',
          backgroundColor: 'rgba(255,255,255)',
        }
      ],
    })
    if(bistMessageHistory.length > 20){
      bistMessageHistory.splice(0,1);
    }

    setdaxUserData({
      labels: daxMessageHistory.map((i) => i.date),
      datasets: [
        {
          label: "DAX",
          data: daxMessageHistory.map(i => i.fvalue),
          borderColor: 'rgb(255,255,255)',
          backgroundColor: 'rgba(255,255,255)',
        }
      ],
    })
    if(daxMessageHistory.length > 20){
      daxMessageHistory.splice(0,1);
    }
  }, [bistMessageHistory,daxMessageHistory ]); 

  useEffect(() => {
    if(readyState !== ReadyState.OPEN)
    {
      sendMessage(message[0]);
      sendMessage(message[1]);
      setInterval(() => {
        handleClickSendMessage()
      }, 1000)
    }
  },[])

  const handleClickSendMessage = () => {
    sendMessage(message[2]);
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className="w-screen h-screen flex justify-around flex-wrap">

      <Card userdata={bistuserData} title="BİST 100" val={bist100} artti={bistartti} fark={bistfark} history={bistMessageHistory}/>
      <Card userdata={daxuserData} title="DAX" val={dax} artti={daxartti} fark={daxfark} history={daxMessageHistory}/>

    </div>
  );
}

export default App;
