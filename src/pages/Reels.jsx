import "./Reels.css";
import Reel from './Reel';
import { useEffect,useState,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import UploadReel from "../components/UploadReel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {db} from "../firebase";
import {onSnapshot, collection, orderBy,query} from "firebase/firestore";

const Reels = () => {
  const [reels,setReels]=useState([])
  const {currentUser}=useContext(AuthContext);

  useEffect(()=>{
    const q = query(collection(db, "reels"), orderBy("timestamp","desc"));
    onSnapshot(q,(snapshot)=>{

      setReels(snapshot.docs.map((doc)=> (
        {
        id:doc.id, 
        post:doc.data()
        }
      )))

    })
  },[])


  return (
    <div className='reels'>

        <div className="top_reel_bar">
          <Link to="/">
            <ArrowBackIcon sx={{fontSize:45,color:"white"}}/>
          </Link>
          <UploadReel/>
        </div>
        
        <div className='bottom_reel_bar'>
          
          {
           reels.map(({id,post})=>{
            return <Reel key={id} id={id} {...post} currentUserName={currentUser.displayName}/>
          })
          }
          
        </div>
    </div>
  )
}

export default Reels;