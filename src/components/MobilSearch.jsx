
export default function MobileSearch({searchTerm,onSearch,isSearchDisabled }) {
  return (
    <>
      <div class="search">
      <input 
      type="search" autocomplete="off" required
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 1000 150">
        <path class="path" fill="none" d="M924.4 85.2c-19.5 19.5-50.8 19.7-70.3 0-19.3-19.4-19.3-51 .3-70.6 19.5-19.5 51-19.4 70.6 0 19.3 19.7 19.3 50.8-.5 70.6l35.4 35.3H0"/>
      </svg>
      </div>
      {isSearchDisabled && <div className="search-blocker"></div>}
    </>
  )
}

