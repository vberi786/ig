import Post from "./Post";
import { Link } from "react-router-dom";
import Upload from "../components/UploadPost"; 
import { AuthContext } from "../context/AuthContext";
import { useState, useEffect,useContext } from 'react';
import {db, auth } from "../firebase";
import {signOut} from 'firebase/auth';
import {onSnapshot, collection, orderBy,query} from "firebase/firestore";
import ProfileUpload from "../components/ProfileUpload";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const Feed = () => {
    const [posts,setPosts]=useState([])
    const {currentUser}=useContext(AuthContext);
    
    useEffect(()=>{
      //Get all posts
      const q = query(collection(db, "posts"), orderBy("timestamp","desc"));
      onSnapshot(q,(snapshot)=>{

        setPosts(snapshot.docs.map((doc)=> (
          {
          id:doc.id, 
          post:doc.data(),
          pp:doc.data().profilePic
          }
        )))

      })
    },[])

  return (
    <>
      <div className="app_header">
        
        <div className="app_header_image">
          <img src="https://www.kuleuven.be/campussen/campus-groep-t-leuven/afbeeldingen/socials_images/instagram-fullwidth.png/image" alt="" />
        </div>

        <div className='tools'>
          <Link to="/reel">
            <PlayCircleIcon  fontSize="large" sx={{color:"red"}} />
          </Link>

          <Upload/>
          <ProfileUpload profilePic={currentUser.photoURL}/>
        </div>
        
        <div className='logout'>
          <button className='btn' onClick={()=>signOut(auth)}>Log Out</button>
        </div>
      </div>

     
      <div className="container">
        <div className="app_posts">
          {
            
            posts.map(({id,post})=>{
              return <Post key={id} id={id} {...post} currentUserName={currentUser.displayName}/>
            })
          }
           {console.log(posts)}
        </div>      
      </div>

    </>
  )
}

export default Feed;