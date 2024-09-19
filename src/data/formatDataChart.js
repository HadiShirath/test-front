export const formatChartData = (data) => {
  return {
    labels: ["Paslon1", "Paslon2", "Paslon3", "Paslon4", "Suara Tidak Sah"],
    datasets: [
      {
        label: "Total Suara",
        data: data
          ? [
              data.paslon1,
              data.paslon2,
              data.paslon3,
              data.paslon4,
              data.suara_tidak_sah,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: [
          "#775DD0",
          "#00E396",
          "#FFB01A",
          "#FF4560",
          "#4BC0C0",
          "#FF9F40",
          "#C9CBCF",
          "#FF5733",
        ],
      },
    ],
  };
};

export const formatPieData = (data) => {
    return {
      labels: ["Paslon1", "Paslon2", "Paslon3", "Paslon4"],
      datasets: [
        {
          label: "Total Suara",
          data: data
            ? [
                data.paslon1,
                data.paslon2,
                data.paslon3,
                data.paslon4,
              ]
            : [0, 0, 0, 0],
          backgroundColor: [
            "#775DD0",
            "#00E396",
            "#FFB01A",
            "#FF4560",
            "#4BC0C0",
            "#FF9F40",
            "#C9CBCF",
            "#FF5733",
          ],
        },
      ],
    };
  };