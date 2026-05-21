import React, { useRef, useCallback, useState, useEffect } from "react";
import clsx from "clsx";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { HighlightSearchResults } from "docusaurus-lunr-search/src/theme/SearchBar/HighlightSearchResults";

const isProduction = process.env.NODE_ENV === "production";

const getKeyboardPlaceholder = () =>
  window.navigator.platform.startsWith("Mac") ? "Search Cmd+K" : "Search Ctrl+K";

const Search = (props) => {
  const initialized = useRef(false);
  const searchBarRef = useRef(null);
  const [indexReady, setIndexReady] = useState(false);
  const [indexFailed, setIndexFailed] = useState(false);
  const history = useHistory();
  const { siteConfig = {} } = useDocusaurusContext();
  const pluginConfig = (siteConfig.plugins || []).find(
    (plugin) =>
      Array.isArray(plugin) &&
      typeof plugin[0] === "string" &&
      plugin[0].includes("docusaurus-lunr-search"),
  );
  const isBrowser = useIsBrowser();
  const { baseUrl } = siteConfig;
  const assetUrl = pluginConfig?.[1]?.assetUrl || baseUrl;
  const pluginData = usePluginData("docusaurus-lunr-search");

  const initAlgolia = (searchDocs, searchIndex, DocSearch, options) => {
    new DocSearch({
      searchDocs,
      searchIndex,
      baseUrl,
      inputSelector: "#search_input_react",
      handleSelected: (_input, _event, suggestion) => {
        const url = suggestion.url || "/";
        _input.setVal("");
        _event.target.blur();

        let wordToHighlight = "";
        if (options.highlightResult) {
          try {
            const matchedLine = suggestion.text || suggestion.subcategory || suggestion.title;
            const matchedWordResult = matchedLine.match(new RegExp("<span.+span>\\w*", "g"));
            if (matchedWordResult && matchedWordResult.length > 0) {
              const tempDoc = document.createElement("div");
              tempDoc.innerHTML = matchedWordResult[0];
              wordToHighlight = tempDoc.textContent;
            }
          } catch (error) {
            console.error(error);
          }
        }

        history.push(url, {
          highlightState: { wordToHighlight },
        });
      },
      maxHits: options.maxHits,
    });
  };

  const getSearchJson = (fileName, label) => {
    if (!fileName) {
      return Promise.reject(new Error(`Missing ${label} file name from docusaurus-lunr-search.`));
    }

    return fetch(`${assetUrl}${fileName}`).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${label}: ${response.status} ${response.statusText}`);
      }

      return response.json();
    });
  };

  const getSearchDoc = () => getSearchJson(pluginData?.fileNames?.searchDoc, "search document");
  const getLunrIndex = () => getSearchJson(pluginData?.fileNames?.lunrIndex, "Lunr index");

  const loadAlgolia = () => {
    if (initialized.current || !isBrowser || !isProduction) {
      return;
    }

    initialized.current = true;
    Promise.all([
      getSearchDoc(),
      getLunrIndex(),
      import("docusaurus-lunr-search/src/theme/SearchBar/DocSearch"),
      import("docusaurus-lunr-search/src/theme/SearchBar/algolia.css"),
    ])
      .then(([searchDocFile, searchIndex, { default: DocSearch }]) => {
        const { searchDocs, options = {} } = searchDocFile || {};
        if (!searchDocs || searchDocs.length === 0) {
          throw new Error("The search document is empty.");
        }

        initAlgolia(searchDocs, searchIndex, DocSearch, options);
        setIndexFailed(false);
        setIndexReady(true);
      })
      .catch((error) => {
        console.error("Developer docs search failed to load.", error);
        setIndexFailed(true);
      });
  };

  const toggleSearchIconClick = useCallback(
    (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        searchBarRef.current.focus();
      }

      props.handleSearchBarToggle?.(!props.isSearchBarExpanded);
    },
    [props.handleSearchBarToggle, props.isSearchBarExpanded],
  );

  const placeholder = isBrowser ? getKeyboardPlaceholder() : "Search";
  const pendingPlaceholder = isProduction
    ? indexFailed
      ? "Search unavailable"
      : "Loading..."
    : "Search after build";

  if (isBrowser) {
    loadAlgolia();
  }

  useEffect(() => {
    if (props.autoFocus && indexReady) {
      searchBarRef.current.focus();
    }
  }, [indexReady, props.autoFocus]);

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={clsx("search-icon", {
          "search-icon-hidden": props.isSearchBarExpanded,
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder={indexReady ? placeholder : pendingPlaceholder}
        aria-label="Search"
        className={clsx(
          "navbar__search-input",
          { "search-bar-expanded": props.isSearchBarExpanded },
          { "search-bar": !props.isSearchBarExpanded },
        )}
        onClick={loadAlgolia}
        onMouseOver={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
        disabled={!indexReady}
      />
      <HighlightSearchResults />
    </div>
  );
};

export default Search;
