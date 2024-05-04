import {useSelector} from "react-redux"
import {Navigate}  from "react-router-dom"

function OpenRoute({children}){
    const {currentUser} = useSelector((state)=>state.user) 
    if(currentUser==null){
        return children;
    }
    else{
        return <Navigate to="/dashboard"/>
    }
}


export default OpenRoute;