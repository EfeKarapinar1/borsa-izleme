import LineChart from "./Charts/LineChart";

export default function Card({userdata, title, val, artti, fark, history}) {

    var date = new Date();
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hour = date.getHours();

    var time = hour + ":" + minutes + ":" + seconds;

    return(
        <div className={artti ? "w-2/5 bg-yesil rounded-xl drop-shadow-2xl my-10" : "w-2/5 bg-kirmizi rounded-xl drop-shadow-2xl my-10"} id="cardrenk">
            
            <div className="w-full flex justify-between">
                <h1 className="font-bold my-3 mx-5 text-3xl text-beyaz">{title}</h1>
                <h1 className="font-bold my-3 mx-5 text-3xl text-beyaz">{val}</h1>
            </div>
            <div className="w-full flex justify-between">
                <h1 className=" my-3 mx-5 text-beyaz">{time}</h1>
                <h1 className=" my-3 mx-5 text-beyaz">{fark}</h1>
            </div>
            
            <div className="w-full rounded-xl">
                {userdata && <LineChart chartData={userdata}/>}
            </div>

            <table className="w-full my-3">
                <thead>
                    <tr>
                        <th className="text-center text-beyaz border-beyaz">Index</th>
                        <th className="text-center text-beyaz border-beyaz">Time</th>
                        <th className="text-center text-beyaz border-beyaz">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.toReversed().map((i,index) => {
                            return(
                                <tr key={index}>
                                    <td className="text-center text-beyaz border-beyaz border-t-2">{index}</td>
                                    <td className="text-center text-beyaz border-beyaz border-t-2">{i.date}</td>
                                    <td className="text-center text-beyaz border-beyaz border-t-2">{i.value}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}