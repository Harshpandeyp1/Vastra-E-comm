import{useLocation} from 'react-router-dom'
const Searchpage = () => {
    const location = useLocation()
    const query=new URLSearchParams(location.search).get('q')
      return (
    <div className="pt-24 px-8">
      <h1 className="text-2xl font-bold">
        Results for "{query}"
      </h1>
    </div>
  )
}

export default Searchpage