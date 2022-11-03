import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {doc,setDoc,serverTimestamp} from "firebase/firestore";
import {db, storage} from "../firebase";
import PostAddIcon from '@mui/icons-material/PostAdd';
import {Box,Button,Modal} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  border: '1px solid grey',
  borderRadius:'.5rem',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const {currentUser,uid}=useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [caption,setCaption]= useState("")
  const [image,setImage]=useState(null);
  const [loading,setLoading]=useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUploadPost=async(e)=>{
    e.preventDefault();
    if(caption===""||image===null)return;

    setLoading(true);
    const storageRef = ref(storage, `images/${image.name}`)
    const uploadTask=uploadBytesResumable(storageRef,image);

    uploadTask.on("state_changed",null, (error)=>{
      alert("Error on post upload",error.message);
      handleClose();
      setLoading(false);
    },
    ()=>{

      getDownloadURL(uploadTask.snapshot.ref)
      .then((url)=>{
        
        setDoc(doc(db, "posts",uid()), {
          timestamp:serverTimestamp(),
          imageUrl:url,
          caption:caption,
          username: currentUser.displayName,
          like:[],
          comments:{}
        });

        console.log(serverTimestamp())
        setCaption("");
        setImage(null);
        handleClose();
        setLoading(false);
      })
      
    })

  
      
  }

  return (
    <div>
      <Button onClick={handleOpen}>
        <PostAddIcon sx={{ fontSize: 30, color:"gray" }}/>
      </Button>
      
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {
            loading?<div>
            <h1 className='screen-center'>Loading ....</h1>
            </div>:<div>
          <h2 className='center'>Create new post</h2>
          <form>
            <input  className='w100' type="text" placeholder='Caption' onChange={(e)=>setCaption(e.target.value)}/>
            <input className='w100' type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            <button className='btn w100' onClick={handleUploadPost}>Upload</button>
          </form>
          
          </div>
         }  
        </Box>
      </Modal>
    </div>
  );
}
