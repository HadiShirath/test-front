/* eslint-disable react/prop-types */
import Marquee from "react-fast-marquee";

export default function RunningText({totalSuara, persentase}) {
  return (
    <div className="bg-gray-100 py-4 mt-8">
       <Marquee
          pauseOnHover
          autoFill
          speed={30}
          // gradient
          // gradientColor="white"
        >
            <div>
            <h1 className="text-md lg:text-xl px-8">Jumlah Suara Masuk <span>{totalSuara ? totalSuara : "-"}</span> Suara dengan Presentase <span className="font-bold">{persentase ? `${persentase}%` : "-"}</span></h1>
            </div>
        </Marquee>
    </div>
  )
}
