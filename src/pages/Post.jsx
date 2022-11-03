import "./Post.css";
import {db} from "../firebase";
import { useEffect,useState,useRef } from "react";
import { doc, deleteDoc, getDoc,updateDoc } from "firebase/firestore";
import Comment from "../components/Comment";
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Post = ({username,caption,imageUrl,id,like,comments,currentUserName}) => {
  const [profilePic,setProfilePic]=useState(null);
  const [postLike,setPostLike]=useState(false);
  const [postComment,setPostComment]=useState([]);
  const [showComment,setShowComment]=useState(false);
  const commentRef=useRef(null)
  const AllLikedUsers=[...like];

  const submitComment=()=>{
    let currComment=commentRef.current.value;
    if(currComment==="")
    {
      return;
    }
    let prevComments=comments[currentUserName]||"";

    updateDoc(doc(db, `posts`,id), {
      comments:{...comments,
        [currentUserName]:[...prevComments,currComment]
      }
    });

    commentRef.current.value="";
  }

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
      
      updateDoc(doc(db, `posts`,id), {
        like:AllLikedUsers
      });
    }else{
      
      const filteredArr=AllLikedUsers.filter((user)=>{
        return user!==currentUserName
      })

      updateDoc(doc(db, `posts`,id), {
        like:filteredArr
      });
      
    }

  }


  const handlePostDelete=async (id)=>{
    try{
      await deleteDoc(doc(db, "posts", id));
    }catch(error)
    {
      console.log(error.message);
    }
  }

  // const getProfilePic=async ()=>{
  //   const docRef = doc(db, "usernames", username);
  //   try {
  //     console.log('vfz');
  //     console.log(db);
  //     const docSnap = await getDoc(docRef);
  //     console.log(docSnap.exists());
  //     if(docSnap.exists()) {
  //        setProfilePic(docSnap.data().profilePic)
  //       //  console.log(docSnap.data().profilePic);
  //         return;
  //     }
  //   } catch(error) {
  //     alert(error.message)
  //   }
  // }
  const getProfilePic=async ()=>{
    const docRef = doc(db, "usernames", username);
    try {
      const docSnap = await getDoc(docRef);
      console.log(docSnap.exists())
      if(docSnap.exists()) {
        
         setProfilePic(docSnap.data().profilePic)
         return;
      }
    } catch(error) {
      console.log(error)
    }
  }
  


  useEffect(()=>{
    getProfilePic();
    findLike();
    // eslint-disable-next-line
  },[])
  

  useEffect(()=>{
     setPostComment(Object.entries({...comments}));
  },[comments])


  return (
    <div className='post'>
     {/* {console.log(profilePic)} */}
        <div className="post_header">
          <div className="display_flex_center">
            <Avatar className='post_avatar'
                alt={username}

                // src={profilePic}/>
                src={imageUrl}/>
                
            <h3>{username}</h3>
          </div>
          
          <div className="display_flex_center">
            {
              (username===currentUserName)?<DeleteIcon className="delete" onClick={()=>handlePostDelete(id)}/>:""
            }
          </div>
        
        </div>
{<img className='post_image' src={imageUrl} alt="" />}
        

        <div className="post_tools">
          {
            postLike?<FavoriteIcon className="like" onClick={handleLike} sx={{color:"red"}}/>:<FavoriteBorderIcon className="like" onClick={handleLike}/>
          }
            <ChatBubbleOutlineIcon className="commentIcon" onClick={()=>setShowComment(!showComment)}/>
        </div>

        <div className="post_likes">
          <p>{like.length} likes</p>
        </div>

            
        <h4 className='post_text'><strong>{username} </strong> {caption}</h4>
  
        {
          showComment&&<>
          <div className="post_comment">

            <div className="comment_form">
              <input type="text" ref={commentRef} placeholder="Add a comment" className="comment_input"/>
              <button className="comment_submit" onClick={submitComment}>Post</button>
            </div>
          
            {
              postComment&&postComment.map((item,index)=>{
                return <Comment key={index} username={item[0]} comment={item[1]}/>
              })
            }
        
          </div>
          </>

        }

    </div>
  )
}

export default Post;