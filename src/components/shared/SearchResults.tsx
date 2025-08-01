import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts:  Models.Document[];
}

function SearchResults({isSearchFetching, searchedPosts}: SearchResultProps) {
  if (isSearchFetching) {
    return <Loader />
  }
// @ts-ignore
  if (searchedPosts && searchedPosts.documents.length > 0) {
    return (
      // @ts-ignore
      <GridPostList posts={searchedPosts.documents} />
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No Results Found</p>
  )
}

export default SearchResults
