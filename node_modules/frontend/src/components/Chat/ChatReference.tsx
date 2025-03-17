import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { green } from "@mui/material/colors";

import { RetrievalResult } from "../../contexts/AppContext";

type ChatReferenceProps = {
  retrievalResults?: RetrievalResult[];
};

export default function ChatReference({
  retrievalResults,
}: ChatReferenceProps) {

  const [copied, setCopied] = useState(false);

  const textToCopy = retrievalResults?.map(result => 
    `${result.title}\n${result.link || ''}\n${result.description || ''}`
    ).join('\n\n') || '';

  return (
    <div className="flex-col">
      <div className="flex-col p-2 mb-2 space-y-3 rounded-xl">
        {retrievalResults?.map((retrievalResult, index) => (
          <div className="flex-col space-y-1.5" key={index}>
            <div className="text-base line-clamp-1">
              {retrievalResult.link ? (
                <a href={retrievalResult.link} target="_blank" rel="noopener noreferrer" className="text-dark-blue dark:text-link-white hover:underline">
                  {retrievalResult.title}
                </a>
              ) : (
                retrievalResult.title
              )}
            </div>
            <p className="text-sm">
            <span className="font-bold">{retrievalResult.date || 'No date'}</span> | <span className="font-bold">{retrievalResult.id || 'No chunk id'}</span> | <span className="font-bold">{retrievalResult.score || 'No score'}</span>
            </p>
            <p className="text-base min-h-[3rem]">
              {retrievalResult.description || ''}
            </p>
          </div>
        ))}
      </div>
      <div className="flex p-2 mb-2 gap-3 items-center opacity-85 border-t dark:border-t-[#2e2e2e]">
        <CopyToClipboard
          text={textToCopy}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }}
        >
          <div className="flex items-center cursor-pointer ml-2.5">
            <ContentCopyIcon
              fontSize="small"
              sx={{ color: copied ? green[500] : {} }}
            />
            {copied ? (
              <span className="text-green-500 text-sm ml-2">
                Copied!
              </span>
            ) : (
              <span className="text-sm ml-2">Copy</span>
            )}
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
}
