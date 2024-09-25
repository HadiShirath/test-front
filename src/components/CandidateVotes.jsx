/* eslint-disable react/prop-types */
import { AnimatedNumber } from '../utils/animatedNumber.jsx';

export default function CandidateVotes({percentage, dataVoter}) {
    const data = [
        {
            title:"Paslon 1",
            color: "bg-color1",
            name:"Nama & Nama",
        },
        {
            title:"Paslon 2",
            color: "bg-color2",
            name:"Nama & Nama",
        },
        {
            title:"Paslon 3",
            color: "bg-color3",
            name:"Nama & Nama",
        },
        {
            title:"Paslon 4",
            color: "bg-color4",
            name:"Nama & Nama",
        },
        // {
        //     title:"Suara Tidak Sah",
        //     color: "bg-color5",
        //     name:"",
        // }
       
    ]


  
  return (
    <div className="flex flex-wrap w-full justify-center pt-8 gap-4">
        {percentage && dataVoter && data.map((item, key) => (
          <div key={key} className="bg-slate-100 w-full md:w-auto mx-8 md:mx-0 py-8 px-8 xl:px-12 rounded-3xl">
            <div className="flex flex-row items-center justify-center">
              <div className="w-[80px] h-[80px] bg-gray-600 rounded-full"></div>
              <div className="pl-2">
                <div className="flex flex-row">

                <h1 className="text-3xl font-semibold"><AnimatedNumber n={percentage[key]} /></h1>
                <h1 className="text-3xl font-semibold">%</h1>
                </div>
                <h1 className="text-xl">{dataVoter[key]} Suara</h1>
              </div>
            </div>

            <div className={`flex flex-col ${item.color}  mt-4 w-full items-center justify-center py-1 rounded-xl`}>
              <h2 className="text-xl text-white">{item.title} </h2>
            </div>

            <div className="flex flex-col w-full items-center">
              <h1 className="text-xl  pt-2">{item.name ? item.name : "-"}</h1>
            </div>
          </div>
        ))}
          
        </div>
  )
}
