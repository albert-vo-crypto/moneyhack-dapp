import React from "react";

const NFTCollectionStatsLabel = ({ title, primaryText, secondaryText, percentageChanged }) => {
  return (
    <div class="px-4 py-5 sm:p-6">
      <dt class="text-base font-normal text-left text-primaryoff">{title || "Stats"}</dt>
      <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div class="flex items-baseline text-2xl font-semibold text-hightlightlight">
          {primaryText || 0}
          <span class="ml-2 text-sm font-medium text-hightlight"> {secondaryText} </span>
        </div>

        {percentageChanged ? (
          percentageChanged >= 0 ? (
            <div class="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 md:mt-2 lg:mt-0">
              <svg
                class="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="sr-only"> Increased by </span>
              {percentageChanged.toFixed(2)}%
            </div>
          ) : (
            <div class="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 md:mt-2 lg:mt-0">
              <svg
                class="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="sr-only"> Decreased by </span>
              {Math.abs(percentageChanged).toFixed(2)}%
            </div>
          )
        ) : null}
      </dd>
    </div>
  );
};

export default NFTCollectionStatsLabel;
