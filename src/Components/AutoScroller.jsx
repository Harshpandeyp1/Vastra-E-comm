
import {useEffect,useState} from 'react'

const AutoScroller = ({images}) => {
    const[index,setIndex] = useState(0)

    useEffect(()=>{
        const interval=setInterval(()=>{
            setIndex((prevIndex)=>(prevIndex+1)%images.length)
        },3000)

        return()=>clearInterval(interval)
    },[images])
  return ( 
    <div className="w-full py-10 px-6 overflow-hidden relative">
    <div className="flex transition-transform duration-700 ease-in-out"
        style={{transform:`translateX(-${index*100}%)`}}>
            {images.map((img,i)=>(
                <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-full h-60 object-cover flex-shrink-0 rounded-xl"
                />
            ))}
    </div>
    </div>
  )
}

export default AutoScroller