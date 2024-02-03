
import { useEffect, useState } from "react";
import "./App.css";
import * as d3 from "d3";
import TImeSeries from "./components/TImeSeries";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let csvURL =
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";
    async function getData() {
      let tempData = [];
      await d3.csv(
        csvURL,
        () => {},
        function (res) {
          tempData.push({
            date: d3.timeParse("%Y-%m-%d")(res.date),
            value: parseFloat(res.value),
          });
        }
      );

      setData(tempData);
    }

    getData();
  }, [])

  return (
    <div className="content">
      <h2>Zoomable Line Chart with D3 </h2>
      <TImeSeries height={'50vh'} width={'50vw'} data={data} />
    </div>
  );
}

export default App;
