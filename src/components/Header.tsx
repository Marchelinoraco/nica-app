import React from "react";

export default function Header() {
  return (
    <>
      <div className="bg-slate-400 w-full h-28">
        <div className="">
          {" "}
          <div className="flex  ml-12">
            {" "}
            <h1 className="text-4xl mt-10 font-bold tex">NICA</h1>
          </div>
          <div className="flex justify-center items-center mt-[-40px] ">
            {" "}
            <p className="text-3xl">
              Naive Bayes Intelligent Classifier for Analysis
            </p>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
