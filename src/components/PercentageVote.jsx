/* eslint-disable react/prop-types */
import { AnimatedNumber } from '../utils/animatedNumber.jsx';

export default function PercentageVote({ allVotes }) {

  return (
    <div className="flex flex-row gap-2 items-center">
      <h2 className="text-xl">Data Masuk : </h2>
      <div className="flex flex-row text-2xl font-bold">
        <h1><AnimatedNumber n={allVotes.persentase} integer/></h1>
        <h1>%</h1>
      </div>{" "}
      <h2 className="text-xl">({allVotes.total_suara} Suara)</h2>
    </div>
  );
}
