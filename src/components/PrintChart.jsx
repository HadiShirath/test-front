/* eslint-disable no-unused-vars */
import { Pie, Bar } from "react-chartjs-2";
import { pieOptions, chartOptions } from "../utils/configChart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const PrintChart = forwardRef(({ chartData }, ref) => {
    

  return (
    <div className="flex flex-col items-center w-full">
        <div className="flex flex-col w-full py-4">
      <div className="flex flex-row w-full justify-between px-6 md:px-12">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Grafik Perolehan Suara
          </h1>
          <h1 className="text-2xl font-semibold">
            Kecamatan <span className="font-bold">-Kecamatan-</span> Kelurahan{" "}
            <span className="font-bold">Kelurahan</span> TPS{" "}
            <span className="font-bold">1</span>
          </h1>
        </div>

        <div className="hidden md:flex bg-gray-100 h-full p-4 items-center rounded-2xl">
          <h2 className="text-xl">
            Data Masuk : <span className="font-bold text-2xl">72%</span> (1394
            Suara)
          </h2>
        </div>
      </div>

      <div className="flex md:hidden w-full px-4 mt-4">
        <div className="bg-slate-100 w-full p-4 rounded-2xl">
          <h2 className="text-xl">
            Data Masuk : <span className="font-bold text-2xl">72%</span> (1394
            Suara)
          </h2>
        </div>
      </div>


      <div  className="flex flex-row w-full px-12 pt-12 h-[500px]">
        <div className="flex flex-col w-full lg:w-1/2 h-[90%]">
          <Pie data={chartData} options={pieOptions} />
        </div>

        <div className="hidden lg:flex flex-col w-full h-full z-10">
          <Bar
            data={chartData}
            options={chartOptions}
            plugins={[ChartDataLabels]}
          />
        </div>

      </div>
      <div className="grid grid-cols-2 px-4 md:flex flex-wrap w-full justify-center gap-4 pt-12">
        <div className="flex flex-col bg-gray-100 rounded-3xl items-center justify-center p-8 md:p-12">
          <div className="w-[100px] h-[100px] bg-gray-500 rounded-full mb-5"></div>
          <div className="flex flex-col bg-color1 w-full items-center justify-center py-1 rounded-xl">
            <h2 className="text-md text-white">Paslon 1</h2>
          </div>
          <h1 className="text-md md:text-xl leading-none pt-2 text-center md:max-w-[150px]">
            Nama Paslon Urut 1
          </h1>
        </div>
        <div className="flex flex-col bg-gray-100 rounded-3xl items-center justify-center p-8 md:p-12">
          <div className="w-[100px] h-[100px] bg-gray-500 rounded-full mb-5"></div>
          <div className="flex flex-col bg-color2 w-full items-center justify-center py-1 rounded-xl">
            <h2 className="text-md text-white">Paslon 2</h2>
          </div>
          <h1 className="text-md md:text-xl leading-none pt-2 text-center md:max-w-[150px]">
            Nama Paslon Urut 2
          </h1>
        </div>
        <div className="flex flex-col bg-gray-100 rounded-3xl items-center justify-center p-8 md:p-12">
          <div className="w-[100px] h-[100px] bg-gray-500 rounded-full mb-5"></div>
          <div className="flex flex-col bg-color3 w-full items-center justify-center py-1 rounded-xl">
            <h2 className="text-md text-white">Paslon 3</h2>
          </div>
          <h1 className="text-md md:text-xl leading-none pt-2 text-center md:max-w-[150px]">
            Nama Paslon Urut 3
          </h1>
        </div>
        <div className="flex flex-col bg-gray-100 rounded-3xl items-center justify-center p-8 md:p-12">
          <div className="w-[100px] h-[100px] bg-gray-500 rounded-full mb-5"></div>
          <div className="flex flex-col bg-color4 w-full items-center justify-center py-1 rounded-xl">
            <h2 className="text-md text-white">Paslon 4</h2>
          </div>
          <h1 className="text-md md:text-xl leading-none pt-2 text-center md:max-w-[150px]">
            Nama Paslon Urut 4
          </h1>
        </div>
      </div>

</div>
    </div>

  );
});

PrintChart.displayName = 'PrintChart';

PrintChart.propTypes = {
    chartData: PropTypes.object.isRequired, // Menambahkan validasi properti
  };

export default PrintChart;
