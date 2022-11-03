import { useEffect,useState,useRef} from 'react';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { doc,getDoc,updateDoc,deleteDoc } from "firebase/firestore";
import {db} from "../firebase";

const Reel = ({caption,username,videoUrl,currentUserName,id,like}) => {
  const [playing,setPlaying]=useState(true);
  const [profilePic,setProfilePic]=useState(null);
  const [postLike,setPostLike]=useState(false);
  const reelRef=useRef(null); 
  const AllLikedUsers=[...like]
 
  const findLike=()=>{
    try{
      for(let val of like)
      {
        if(val===currentUserName)
        {
          setPostLike(true);
        }
      }
    }catch(e)
    {
      console.log(e.message)
    }
  }
  

  const handleLike=()=>{
    let toggleBoolean=!postLike;
    setPostLike(toggleBoolean);
    
    if(toggleBoolean)
    {
      AllLikedUsers.push(currentUserName);

      updateDoc(doc(db, `reels`,id), {
        like:AllLikedUsers
      });

    }else{
      
      const filteredArr=AllLikedUsers.filter((user)=>{
        return user!==currentUserName
      })

      updateDoc(doc(db, `reels`,id), {
        like:filteredArr
      });
      
    }

  }

  const handleVideoClick=()=>{
    if(playing)
    {
      reelRef.current.pause();
      setPlaying(false);
    }else{
      reelRef.current.play();
      setPlaying(true);
    }
  }

  const getProfilePic=async ()=>{
    const docRef = doc(db, "usernames", username);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
         setProfilePic(docSnap.data().profilePic)
         return;
      }
    } catch(error) {
      console.log(error)
    }
  }

  const handlePostDelete=async (id)=>{
    try{
      await deleteDoc(doc(db, "reels", id));
    }catch(error)
    {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    findLike();
    getProfilePic();
    handleVideoClick();
    // eslint-disable-next-line
  },[])

  return (
    <div className='outer_container' >
        <div className='reel_video' onClick={handleVideoClick}>
        
        <video width="320" height="550" ref={reelRef} loop>
            <source src={videoUrl} type="video/mp4"/>
        </video> 
        
        <div className="reel_delete">
            {
              (username===currentUserName)?<DeleteIcon className="delete" sx={{fontSize:30,color:"white"}} onClick={()=>handlePostDelete(id)}/>:""
            }
          </div>

          <div className='reel_content'>
            
            <div className="post_header">
              <div className="display_flex_center">
                <Avatar className='post_avatar'
                    alt={username}
                    src={profilePic}/>
                <h3>{username}</h3>
              </div>

            <div  className="reel_like">
            {
             postLike?<FavoriteIcon onClick={handleLike} sx={{color:"red",fontSize:40}}/>:<FavoriteBorderIcon onClick={handleLike} sx={{fontSize:40}}/>
            }
            <h3>{like.length} likes</h3>
            </div>
          
          </div>

            
          </div>

          <div className='reel_caption'>
                 {/* eslint-disable-next-line */}
                <marquee>
                  <h3>{caption}</h3>
                  
                </marquee>
          </div>

        </div>
    </div>
  )
}

export default Reel;