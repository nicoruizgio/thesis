import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SourceParser = ({ text }) => {
  const parseTextWithSources = (text) => {
    // Check for "Sources:" section
    const sourcesMatch = text.match(/\n*Sources?:\s*\n?([\s\S]+)$/i);

    if (!sourcesMatch) {
      // No sources section found, look for inline URLs
      return parseInlineUrls(text);
    }

    const mainText = text.replace(sourcesMatch[0], '').trim();
    const sourcesText = sourcesMatch[1];

    // Extract sources from the sources section
    const sources = extractSourcesFromText(sourcesText);

    return { mainText, sources };
  };

  const parseInlineUrls = (text) => {
    const urlPattern = /(https?:\/\/[^\s\)]+)/g;
    const urls = [];
    let match;

    while ((match = urlPattern.exec(text)) !== null) {
      urls.push({
        url: match[0],
        index: match.index,
        length: match[0].length
      });
    }

    if (urls.length === 0) {
      return { mainText: text, sources: [] };
    }

    let mainText = text;
    const sources = [];

    urls.sort((a, b) => b.index - a.index);

    urls.forEach((urlInfo, reverseIndex) => {
      const sourceIndex = urls.length - reverseIndex;

      let displayName = extractDomainName(urlInfo.url);

      sources.unshift({
        id: sourceIndex,
        url: urlInfo.url,
        displayName: displayName
      });

      mainText = mainText.substring(0, urlInfo.index) +
                ` [${sourceIndex}]` +
                mainText.substring(urlInfo.index + urlInfo.length);
    });

    return { mainText, sources };
  };

  const extractSourcesFromText = (sourcesText) => {
    // Handle both bulleted lists and numbered lists
    const urlPattern = /(https?:\/\/[^\s\)]+)/g;
    const sources = [];
    let match;
    let sourceIndex = 1;

    while ((match = urlPattern.exec(sourcesText)) !== null) {
      let displayName = extractDomainName(match[0]);

      sources.push({
        id: sourceIndex++,
        url: match[0],
        displayName: displayName
      });
    }

    return sources;
  };

  const extractDomainName = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  const { mainText, sources } = parseTextWithSources(text);

  return (
    <div>
      {/* Render main content as markdown */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {mainText}
      </ReactMarkdown>

      {/* Sources section */}
      {sources.length > 0 && (
        <div className="sources-section">
          <div className="sources-title">Sources:</div>
          <div>
            {sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                [{source.id}]
                <span className="tooltip">{source.displayName}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceParser;